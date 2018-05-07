// @flow
"use strict";

import type {Activity, ActivityBuilder, AppState} from "../types/Types";
import React from "react";
import {Button, ButtonToolbar, Glyphicon, PageHeader} from "react-bootstrap";
import ActivityTable from "../components/ActivityTable";
import ActivityDialog from "../components/ActivityDialog";
import ErrorDialog from "../components/ErrorDialog";
import DeleteDialog from "../components/DeleteDialog";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import * as redux from "react-redux";

type ActivityPageProps = {
    isFetching: boolean,
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error,
    fetchActivities: () => void,
    startAddActivity: () => void,
    startEditActivity: (Activity) => void,
    dismissEditActivity: () => void,
    saveActivity: (ActivityBuilder) => void,
    startDeleteActivity: (Activity) => void,
    dismissDeleteActivity: () => void,
    deleteActivity: () => void,
    dismissError: () => void
};

export class ActivityPage extends React.Component<ActivityPageProps> {

    render() {
        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="list"/> Activities
                </PageHeader>

                <ActivityTable activities={this.props.activities}
                    editHandler={this.props.startEditActivity}
                    deleteHandler={this.props.startDeleteActivity}/>

                <ButtonToolbar>
                    <Button bsStyle="primary" href="/#/">
                        <Glyphicon glyph="chevron-left"/> Back
                    </Button>
                    <Button bsStyle="primary" onClick={this.props.fetchActivities}>
                        <Glyphicon glyph="refresh"/> Refresh
                    </Button>
                    <Button bsStyle="primary" onClick={this.props.startAddActivity}>
                        <Glyphicon glyph="plus"/> Add
                    </Button>
                </ButtonToolbar>

                {this.props.editedActivity && <ActivityDialog
                    initialActivity={this.props.editedActivity}
                    onDismiss={this.props.dismissEditActivity}
                    onSave={this.props.saveActivity}/>}

                {this.props.error && <ErrorDialog
                    error={this.props.error}
                    onDismiss={this.props.dismissError}/>}

                {this.props.deletedActivity && <DeleteDialog
                    activity={this.props.deletedActivity}
                    onDismiss={this.props.dismissDeleteActivity}
                    onConfirm={this.props.deleteActivity}/>}
            </div>
        );
    }

    componentDidMount() {
        this.props.fetchActivities();
    }
}

function mapStateToProps(state: AppState): $Shape<ActivityPageProps> {
    return state;
}

function mapDispatchToProps(dispatch: Dispatch): $Shape<ActivityPageProps> {
    return {
        fetchActivities: () => dispatch(actions.fetchActivitiesIfNeeded()),
        startAddActivity: () => dispatch(actions.startAddActivity()),
        startEditActivity: (a) => dispatch(actions.startEditActivity(a)),
        dismissEditActivity: () => dispatch(actions.dismissEditActivity()),
        saveActivity: (a) => dispatch(actions.saveActivity(a)),
        startDeleteActivity: (a) => dispatch(actions.startDeleteActivity(a)),
        dismissDeleteActivity: () => dispatch(actions.dismissDeleteActivity()),
        deleteActivity: () => dispatch(actions.deleteActivity()),
        dismissError: () => dispatch(actions.dismissError())
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(ActivityPage);
