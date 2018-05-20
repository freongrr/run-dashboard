// @flow
"use strict";

import type {Activity, ActivityBuilder, AttributeType} from "../types/Types";
import type {AppState} from "../types/AppState";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import * as redux from "react-redux";
import React from "react";
import {Button, ButtonToolbar, Glyphicon, PageHeader} from "react-bootstrap";
import ActivityTable from "../components/ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "../components/ErrorDialog";
import DeleteDialog from "../components/DeleteDialog";

type ActivityPageProps = {
    attributeTypes: AttributeType[],
    isFetching: boolean,
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error,
    fetchActivities: () => void,
    startAddActivity: () => void,
    startEditActivity: (Activity) => void,
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

                {this.props.editedActivity && <ActivityDialog activityBuilder={this.props.editedActivity}/>}

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

// TODO : is there a way to test this?
function mapDispatchToProps(dispatch: Dispatch): $Shape<ActivityPageProps> {
    return {
        fetchActivities: () => dispatch(actions.fetchActivitiesIfNeeded()),
        startAddActivity: () => dispatch(actions.startAddActivity()),
        startEditActivity: (a) => dispatch(actions.startEditActivity(a)),
        startDeleteActivity: (a) => dispatch(actions.startDeleteActivity(a)),
        dismissDeleteActivity: () => dispatch(actions.dismissDeleteActivity()),
        deleteActivity: () => dispatch(actions.deleteActivity()),
        dismissError: () => dispatch(actions.dismissError())
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(ActivityPage);
