// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import React from "react";
import update from "react-addons-update";
import {PageHeader, Nav, NavItem, ButtonToolbar, Button, Glyphicon} from "react-bootstrap";
import RPC from "./RPC";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import DeleteDialog from "./DeleteDialog";
import {parseDuration, formatHourMinutes} from "./TimeUtils";
import {parseDistance, formatKm} from "./DistanceUtils";

type DashboardProps = {
    rpc: RPC,
    graph: React.Component<*>,
    graphEventKey: string
};

type DashboardState = {
    activities: Array<Activity>,
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};

export default class Dashboard extends React.Component {
    props: DashboardProps;
    state: DashboardState;

    constructor(props: DashboardProps) {
        super(props);

        this.state = {
            activities: [],
            editedActivity: null,
            deletedActivity: null,
            error: null
        };
    }

    render() {
        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="stats"/> Stats
                </PageHeader>

                <Nav bsStyle="tabs" activeKey={this.props.graphEventKey}>
                    {/*HACK - I can't use Link here because it put a <a> inside a <a> ...*/}
                    <NavItem eventKey="y" href="/#/Year">Year</NavItem>
                    <NavItem eventKey="m" href="/#/Month">Month</NavItem>
                    <NavItem eventKey="w" href="/#/Week">Week</NavItem>
                </Nav>

                <div className="dashboard-graph">
                    {this.props.graph}
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
        this.props.rpc.get("/activities")
            .then((activities) => {
                this.setState({
                    activities: activities,
                    error: null
                });
            })
            .catch((e) => {
                // TODO : this should be cleared when the dialog is dismissed (just like the delete dialog)
                this.setState({error: e});
            });
    }

    addActivity() {
        // TODO : this should be cleared when the dialog is dismissed (just like the delete dialog)
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
        // TODO : this should be cleared when the dialog is dismissed (just like the delete dialog)
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

        this.props.rpc.post("/activities", {activity: activity})
            .then((result) => this.updateState(result))
            .then(() => this.setState({editedActivity: null}))
            .catch((e) => this.setState({error: e, editedActivity: null}));
    }

    updateState(activity: Activity) {
        const index = this.findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Replacing activity at index ${index}`);
            this.setState(update(this.state, {activities: {$splice: [[index, 1, activity]]}}));
        } else {
            // TODO : insert at the correct position or refresh from the server!
            console.debug("Adding new activity");
            this.setState(update(this.state, {activities: {$splice: [[0, 0, activity]]}}));
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
            this.props.rpc._delete("/activities", {activity: activity})
                .then(() => this.deleteFromState(activity))
                .then(() => this.setState({deletedActivity: null}))
                .catch((e) => this.setState({error: e, deletedActivity: null}));
        }
    }

    deleteFromState(activity: Activity) {
        const index = this.findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Deleting activity at index ${index}`);
            this.setState(update(this.state, {activities: {$splice: [[index, 1]]}}));
        }
    }
}
