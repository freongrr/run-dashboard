// @flow
"use strict";

import type {Activity, ActivityBuilder} from "../types/Types";
import type {AppState} from "../types/AppState";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import * as redux from "react-redux";
import React from "react";
import Button from "react-bootstrap/lib/Button";
import ButtonToolbar from "react-bootstrap/lib/ButtonToolbar";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import PageHeader from "react-bootstrap/lib/PageHeader";
import ActivityTable from "../components/ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "../components/ErrorDialog";
import DeleteDialog from "../components/DeleteDialog";

// TODO : split into multiple connected components (e.g. edit dialog, list, etc)
type ActivityPageProps = {
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

// TODO : this should load activities one page at a time
// (e.g. with a "Load More" button, or with an infinite scroll
export class ActivityPage extends React.Component<ActivityPageProps> {

    render() {
        return (
            <div className="ActivityPage">
                <PageHeader>
                    <Glyphicon glyph="list"/> Activities
                </PageHeader>

                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={this.props.fetchActivities}>
                        <Glyphicon glyph="refresh"/> Refresh
                    </Button>
                    <Button bsStyle="primary" onClick={this.props.startAddActivity}>
                        <Glyphicon glyph="plus"/> Add
                    </Button>
                </ButtonToolbar>

                <ActivityTable activities={this.props.activities}
                    editHandler={this.props.startEditActivity}
                    deleteHandler={this.props.startDeleteActivity}/>

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
    return {
        isFetching: state.loadingActivities,
        activities: state.activities,
        editedActivity: state.editedActivity,
        deletedActivity: state.deletedActivity,
        error: state.error
    };
}

// TODO : is there a way to test this?
function mapDispatchToProps(dispatch: Dispatch): $Shape<ActivityPageProps> {
    return {
        fetchActivities: () => dispatch(actions.fetchActivities()),
        startAddActivity: () => dispatch(actions.startAddActivity()),
        startEditActivity: (a) => dispatch(actions.startEditActivity(a)),
        startDeleteActivity: (a) => dispatch(actions.startDeleteActivity(a)),
        dismissDeleteActivity: () => dispatch(actions.dismissDeleteActivity()),
        deleteActivity: () => dispatch(actions.deleteActivity()),
        dismissError: () => dispatch(actions.dismissError())
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(ActivityPage);
