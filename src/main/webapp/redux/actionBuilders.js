// @flow

import type {Activity, ActivityBuilder} from "../types/Types";

export class RequestActivitiesPayload {

}

export class ReceivedActivitiesPayload {
    activities: Activity[];

    constructor(activities: Activity[]) {
        this.activities = activities;
    }
}

export class SetEditedActivityPayload {
    builder: ?ActivityBuilder;

    constructor(builder: ?ActivityBuilder) {
        this.builder = builder;
    }
}

export class ActivitySavedPayload {
    activity: Activity;

    constructor(activity: Activity) {
        this.activity = activity;
    }
}

export class SetDeletedActivityPayload {
    activity: ?Activity;

    constructor(activity: ?Activity) {
        this.activity = activity;
    }
}

export class ActivityDeletedPayload {
    activity: Activity;

    constructor(activity: Activity) {
        this.activity = activity;
    }
}

export class SetErrorPayload {
    error: ?Error;

    constructor(error: ?Error) {
        this.error = error;
    }
}

export type Action = {
    type: string,
    payload: RequestActivitiesPayload |
        ReceivedActivitiesPayload |
        SetEditedActivityPayload |
        ActivitySavedPayload |
        SetDeletedActivityPayload |
        ActivityDeletedPayload |
        SetErrorPayload
};

export function requestActivities() {
    return {
        type: "REQUEST_ACTIVITIES",
        payload: new RequestActivitiesPayload()
    };
}

export function receivedActivities(activities: Activity[]) {
    return {
        type: "REQUEST_ACTIVITIES",
        payload: new ReceivedActivitiesPayload(activities)
    };
}

export function setEditedActivity(builder: ?ActivityBuilder) {
    return {
        type: "EDIT_ACTIVITY",
        payload: new SetEditedActivityPayload(builder)
    };
}

export function activitySaved(activity: Activity) {
    return {
        type: "ACTIVITY_SAVED",
        payload: new ActivitySavedPayload(activity)
    };
}

export function setDeletedActivity(activity: ?Activity) {
    return {
        type: "SET_DELETED_ACTIVITY",
        payload: new SetDeletedActivityPayload(activity)
    };
}

export function activityDeleted(activity: Activity) {
    return {
        type: "ACTIVITY_DELETED",
        payload: new ActivityDeletedPayload(activity)
    };
}

export function setError(error: ?Error) {
    return {
        type: "SET_ERROR",
        payload: new SetErrorPayload(error)
    };
}
