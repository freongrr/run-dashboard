// @flow

import {combineReducers} from "redux";
import update from "immutability-helper";

import type {Activity, ActivityBuilder} from "../types/Types";
import type {Action} from "./actionBuilders";
import {
    ActivityDeletedPayload,
    ActivitySavedPayload,
    ReceivedActivitiesPayload,
    RequestActivitiesPayload,
    SetDeletedActivityPayload,
    SetEditedActivityPayload,
    SetErrorPayload
} from "./actionBuilders";

function isFetching(state = false, action: Action): boolean {
    const payload = action && action.payload;
    if (payload instanceof RequestActivitiesPayload) {
        return true;
    } else if (payload instanceof ReceivedActivitiesPayload) {
        return false;
    } else {
        return state;
    }
}

function activities(state: Activity[] = [], action: Action): Activity[] {
    const payload = action && action.payload;
    if (payload instanceof ReceivedActivitiesPayload) {
        return (payload: ReceivedActivitiesPayload).activities;
    } else if (payload instanceof ActivitySavedPayload) {
        const updatedActivity = (payload: ActivitySavedPayload).activity;
        const index = state.findIndex(a => a.id === updatedActivity.id);
        // TODO : sort? or refresh?
        if (index >= 0) {
            return update(state, {[index]: {$set: updatedActivity}});
        } else {
            return update(state, {$unshift: [updatedActivity]});
        }
    } else if (payload instanceof ActivityDeletedPayload) {
        const updatedActivity = (payload: ActivityDeletedPayload).activity;
        const index = state.findIndex(a => a.id === updatedActivity.id);
        if (index >= 0) {
            return update(state, {$splice: [[index, 1]]});
        } else {
            console.warn("Could not remove element");
            return state;
        }
    } else {
        return state;
    }
}

function editedActivity(state: ?ActivityBuilder = null, action: Action): ?ActivityBuilder {
    const payload = action && action.payload;
    if (payload instanceof SetEditedActivityPayload) {
        return (payload: SetEditedActivityPayload).builder;
    } else if (payload instanceof ActivitySavedPayload) {
        return null;
    } else {
        return state;
    }
}

function deletedActivity(state: ?Activity = null, action: Action): ?Activity {
    const payload = action && action.payload;
    if (payload instanceof SetDeletedActivityPayload) {
        return (payload: SetDeletedActivityPayload).activity;
    } else if (payload instanceof ActivityDeletedPayload) {
        return null;
    } else {
        return state;
    }
}

function error(state: ?Error = null, action: Action): ?Error {
    const payload = action && action.payload;
    if (payload instanceof SetErrorPayload) {
        return (payload: SetErrorPayload).error;
    } else {
        return state;
    }
}

export default combineReducers({
    isFetching,
    activities,
    editedActivity,
    deletedActivity,
    error
});
