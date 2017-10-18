// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import React from "react";
import {Button, ButtonToolbar, Glyphicon, PageHeader} from "react-bootstrap";
import type {Subscription} from "./DataStore";
import DataStore from "./DataStore";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import DeleteDialog from "./DeleteDialog";
import {formatHourMinutes, parseDuration} from "./TimeUtils";
import {formatKm, parseDistance} from "./DistanceUtils";

type DashboardProps = {
    chart: any,
    dataStore: DataStore
};

type DashboardState = {
    activities: Array<Activity>,
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};

const RESOURCE = "activities";

export default class Dashboard extends React.Component<DashboardProps, DashboardState> {
    props: DashboardProps;
    state: DashboardState;

    subscription: Subscription;

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

                <div className="dashboard-graph">
                    {this.props.chart}
                </div>

                <PageHeader className="subTitle">
                    <Glyphicon glyph="list"/> Activities
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

                {this.state.editedActivity && <ActivityDialog
                    initialActivity={this.state.editedActivity}
                    onDismiss={() => this.setState({editedActivity: null})}
                    onSave={(a) => this.saveActivity(a)}/>}

                {this.state.error && <ErrorDialog
                    error={this.state.error}
                    onDismiss={() => this.setState({error: null})}/>}

                {this.state.deletedActivity && <DeleteDialog
                    activity={this.state.deletedActivity}
                    onDismiss={() => this.setState({deletedActivity: null})}
                    onConfirm={() => this.deleteActivity()}/>}
            </div>
        );
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        if (this.subscription) {
            this.subscription.cancel();
        }
        this.subscription = this.props.dataStore.subscribe(RESOURCE, (activities, e) => {
            if (activities) {
                this.setState({activities: activities, error: null});
            } else if (e) {
                this.setState({error: e});
            }
        });
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
            id: builder.id ? builder.id : "" /* HACK */,
            date: builder.date,
            duration: parseDuration(builder.duration),
            distance: parseDistance(builder.distance)
        };

        this.setState({editedActivity: null});
        this.props.dataStore.put(RESOURCE, activity);
    }

    promptDelete(activity: Activity) {
        // TODO : it would be better to do it anyway and let the user undo it
        this.setState({deletedActivity: activity});
    }

    deleteActivity() {
        const activity = this.state.deletedActivity;
        if (activity) {
            this.setState({deletedActivity: null});
            this.props.dataStore.remove(RESOURCE, activity);
        }
    }
}
