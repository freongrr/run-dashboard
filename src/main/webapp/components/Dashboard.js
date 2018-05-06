// @flow
"use strict";

import type {Activity, ActivityBuilder, AppState} from "../types/Types";
import React from "react";
import {Button, ButtonToolbar, Glyphicon, PageHeader} from "react-bootstrap";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import DeleteDialog from "./DeleteDialog";
import {formatHourMinutes, parseDuration} from "../utils/TimeUtils";
import {formatKm, parseDistance} from "../utils/DistanceUtils";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import * as redux from "react-redux";

// TODO : the props don't have to match exactly
type DashboardProps = AppState & {
    dispatch: Dispatch
};

// TODO : remove
type DashboardState = {
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};

export class Dashboard extends React.Component<DashboardProps, DashboardState> {

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
                    {/* TODO */}
                </div>

                <PageHeader className="subTitle">
                    <Glyphicon glyph="list"/> Activities
                </PageHeader>

                <ActivityTable activities={this.props.activities}
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
        this.props.dispatch(actions.fetchActivitiesIfNeeded());
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

        // TODO : handle inside redux
        this.setState({editedActivity: null});
        this.props.dispatch(actions.saveActivity(activity));
    }

    promptDelete(activity: Activity) {
        // TODO : it would be better to do it anyway and let the user undo it
        // TODO : handle inside redux
        this.setState({deletedActivity: activity});
    }

    deleteActivity() {
        const activity = this.state.deletedActivity;
        if (activity) {
            // TODO : handle inside redux
            this.setState({deletedActivity: null});
            this.props.dispatch(actions.deleteActivity(activity));
        }
    }
}

function mapStateToProps(state: AppState) {
    return state;
}

export default redux.connect(mapStateToProps)(Dashboard);
