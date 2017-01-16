// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {RouteLocation, Activity, ActivityBuilder} from "./Types";
import React from "react";
import update from "react-addons-update";
import {PageHeader, ButtonToolbar, Button, Glyphicon} from "react-bootstrap";
import RPC from "./RPC";
import ChartPanel from "./ChartPanel";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import DeleteDialog from "./DeleteDialog";
import {parseDuration, formatHourMinutes} from "./TimeUtils";
import {parseDistance, formatKm} from "./DistanceUtils";

type DashboardProps = {
    route: {
        rpc: RPC
    },
    location: RouteLocation
};

type DashboardState = {
    activities: Array<Activity>,
    lastUpdate: Date,
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};

export default class Dashboard extends React.Component {
    props: DashboardProps;
    state: DashboardState;

    rpc: RPC;

    constructor(props: DashboardProps) {
        super(props);

        this.state = {
            activities: [],
            lastUpdate: new Date(),
            editedActivity: null,
            deletedActivity: null,
            error: null
        };

        this.rpc = props.route.rpc;
    }

    render() {
        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="stats"/> Stats
                </PageHeader>

                <div className="dashboard-graph">
                    {/* I gave up on using the route here because I need to keep it up to date when saving or deleting 
                     activities. I could pass it the activities, but I plan on moving the generation of the graph data 
                     to the server. Instead I only pass it the last time the local data was updated at. */}
                    <ChartPanel location={this.props.location} rpc={this.rpc} lastUpdate={this.state.lastUpdate}/>
                </div>

                <PageHeader>
                    {/* TODO : the browser complains about having a h3 in a h1... */}
                    <h3><Glyphicon glyph="list"/> Activities</h3>
                </PageHeader>

                <ActivityTable activities={this.state.activities}
                               editHandler={(a) => this.editActivity(a)}
                               deleteHandler={(a) => this.deleteActivity(a)}/>

                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={() => this.refresh()}>
                        <Glyphicon glyph="refresh"/> Refresh
                    </Button>
                    <Button bsStyle="primary" onClick={() => this.addActivity()}>
                        <Glyphicon glyph="plus"/> Add
                    </Button>
                </ButtonToolbar>

                {this.state.editedActivity !== null
                && <ActivityDialog initialActivity={this.state.editedActivity}
                                   onDismiss={() => this.setState({editedActivity: null})}
                                   onSave={(a) => this.saveActivity(a)}/> }

                {this.state.error
                && <ErrorDialog error={this.state.error}
                                onDismiss={() => this.setState({error: null})}/>}

                {this.state.deletedActivity
                && <DeleteDialog activity={this.state.deletedActivity}
                                 onDismiss={() => this.cancelDeleteActivity()}
                                 onConfirm={() => this.doDeleteActivity()}/>}
            </div>
        );
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        this.rpc.get("/activities")
            .then((activities) => {
                this.setState({
                    activities: activities,
                    lastUpdate: new Date(),
                    error: null
                });
            })
            .catch((e) => {
                this.setState({error: e});
            });
    }

    addActivity() {
        this.setState({
            editedActivity: {
                id: null,
                date: "",
                duration: "",
                distance: ""
            }
        });
    }

    editActivity(activity: Activity) {
        this.setState({
            editedActivity: {
                id: activity.id,
                date: activity.date,
                duration: formatHourMinutes(activity.duration),
                distance: formatKm(activity.distance)
            }
        });
    }

    saveActivity(builder: ActivityBuilder) {
        console.info("Saving", builder);

        const activity: {} = {
            id: builder.id ? builder.id : null,
            date: builder.date,
            duration: parseDuration(builder.duration),
            distance: parseDistance(builder.distance)
        };

        this.rpc.post("/activities", {activity: activity})
            .then((result) => this.updateState(result))
            .then(() => this.setState({editedActivity: null}))
            .catch((e) => this.setState({error: e, editedActivity: null}));
    }

    updateState(activity: Activity) {
        const index = this.findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Replacing activity at index ${index}`);
            this.setState(update(this.state, {
                activities: {$splice: [[index, 1, activity]]},
                lastUpdate: {$set: new Date}
            }));
        } else {
            // TODO : insert at the correct position or refresh from the server!
            console.debug("Adding new activity");
            this.setState(update(this.state, {
                activities: {$splice: [[0, 0, activity]]},
                lastUpdate: {$set: new Date}
            }));
        }
    }

    findIndexOfActivity(activity: Activity | ActivityBuilder) {
        let index = -1;
        if (activity.id !== null) {
            this.state.activities.forEach((a, i) => {
                if (a.id === activity.id) {
                    index = i;
                }
            });
        }
        return index;
    }

    deleteActivity(activity: Activity) {
        // TODO : it would be better to do it anyway and let the user undo it
        this.setState({deletedActivity: activity});
    }

    cancelDeleteActivity() {
        this.setState({deletedActivity: null});
    }

    doDeleteActivity() {
        const activity = this.state.deletedActivity;
        if (activity) {
            this.rpc._delete("/activities", {activity: activity})
                .then(() => this.deleteFromState(activity))
                .then(() => this.setState({deletedActivity: null}))
                .catch((e) => this.setState({error: e, deletedActivity: null}));
        }
    }

    deleteFromState(activity: Activity) {
        const index = this.findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Deleting activity at index ${index}`);
            this.setState(update(this.state, {
                activities: {$splice: [[index, 1]]},
                lastUpdate: {$set: new Date}
            }));
        }
    }
}
