// @flow

import type {Activity, ActivityBuilder} from "../types/Types";

export type Action =
    { type: "REQUEST_ACTIVITIES" } |
    { type: "RECEIVED_ACTIVITIES", activities: Activity[] } |
    { type: "SET_EDITED_ACTIVITY", builder: ?ActivityBuilder } |
    { type: "ACTIVITY_SAVED", activity: Activity } |
    { type: "SET_DELETED_ACTIVITY", activity: ?Activity } |
    { type: "ACTIVITY_DELETED", activity: Activity } |
    { type: "SET_ERROR", error: ?Error };

export function requestActivities(): Action {
    return {type: "REQUEST_ACTIVITIES"};
}

export function receivedActivities(activities: Activity[]): Action {
    return {type: "RECEIVED_ACTIVITIES", activities};
}

export function setEditedActivity(builder: ?ActivityBuilder): Action {
    return {type: "SET_EDITED_ACTIVITY", builder};
}

export function activitySaved(activity: Activity): Action {
    return {type: "ACTIVITY_SAVED", activity};
}

export function setDeletedActivity(activity: ?Activity): Action {
    return {type: "SET_DELETED_ACTIVITY", activity};
}

export function activityDeleted(activity: Activity): Action {
    return {type: "ACTIVITY_DELETED", activity};
}

export function setError(error: ?Error): Action {
    return {type: "SET_ERROR", error};
}
