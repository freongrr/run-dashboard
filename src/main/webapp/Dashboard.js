// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import React from "react";
import {PageHeader, ButtonToolbar, Button, Glyphicon} from "react-bootstrap";
import DataStore from "./DataStore";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import DeleteDialog from "./DeleteDialog";
import {parseDuration, formatHourMinutes} from "./TimeUtils";
import {parseDistance, formatKm} from "./DistanceUtils";

type DashboardProps = {
    chart: any,
    route: {
        dataStore: DataStore
    }
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

    dataStore: DataStore;

    constructor(props: DashboardProps) {
        super(props);

        this.state = {
            activities: [],
            editedActivity: null,
            deletedActivity: null,
            error: null
        };

        this.dataStore = props.route.dataStore;
    }

    render() {
        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="stats"/> Stats
                </PageHeader>

                <div className="dashboard-graph">
                    {this.props.chart}
                </div>

                <PageHeader>
                    {/* TODO : the browser complains about having a h3 in a h1... */}
                    <h3><Glyphicon glyph="list"/> Activities</h3>
                </PageHeader>

                <ActivityTable activities={this.state.activities}
                               editHandler={(a) => this.promptEdit(a)}
                               deleteHandler={(a) => this.promptDelete(a)}/>

                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={() => this.refresh()}>
                        <Glyphicon glyph="refresh"/> Refresh
                    </Button>
                    <Button bsStyle="primary" onClick={() => this.promptAdd()}>
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
                                 onDismiss={() => this.setState({deletedActivity: null})}
                                 onConfirm={() => this.deleteActivity()}/>}
            </div>
        );
    }

    componentDidMount() {
        this.dataStore.subscribe((activities, e) => {
            if (activities) {
                this.setState({activities: activities, error: null});
            } else if (e) {
                this.setState({error: e});
            }
        });

        this.refresh();
    }

    refresh() {
        this.dataStore.refresh();
    }

    promptAdd() {
        this.setState({
            editedActivity: {
                id: null,
                date: "",
                duration: "",
                distance: ""
            }
        });
    }

    promptEdit(activity: Activity) {
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
        const activity: Activity = {
            id: "", /* HACK */
            date: builder.date,
            duration: parseDuration(builder.duration),
            distance: parseDistance(builder.distance)
        };

        this.setState({editedActivity: null});
        this.dataStore.put(activity);
    }

    promptDelete(activity: Activity) {
        // TODO : it would be better to do it anyway and let the user undo it
        this.setState({deletedActivity: activity});
    }

    deleteActivity() {
        const activity = this.state.deletedActivity;
        if (activity) {
            this.setState({deletedActivity: null});
            this.dataStore.remove(activity);
        }
    }
}
