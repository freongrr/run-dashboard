// @flow
/* global process */

import type {Activity, ActivityBuilder, AppState} from "../types/Types";
import type {Action} from "./actionBuilders";
import * as actionBuilders from "./actionBuilders";
import * as DistanceUtils from "../utils/DistanceUtils";
import * as TimeUtils from "../utils/TimeUtils";
import RPC from "../utils/RPC";
import DummyRPC from "../utils/DummyRPC";

export type Dispatch = (action: Action | ThunkAction) => void;
type GetState = () => AppState;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => void;

// TODO : inject service interface in store state?
let rpc;
if (1 === 1 || process.env.NODE_ENV === "production") {
    rpc = new RPC();
} else {
    rpc = new DummyRPC();
}

const ACTIVITY_API = "/api/activities";

export function fetchActivitiesIfNeeded(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState) => {
        if (!getState().isFetching) {
            dispatch(actionBuilders.requestActivities());
            rpc.get(ACTIVITY_API)
                .then((json) => {
                    const activities = (json: any);
                    dispatch(actionBuilders.receivedActivities(activities));
                })
                .catch((error) => {
                    dispatch(actionBuilders.setError(error));
                });
        }
    };
}

export function startAddActivity(): Action {
    const editedActivity = {
        id: null,
        date: "",
        duration: "",
        distance: ""
    };
    return actionBuilders.setEditedActivity(editedActivity);
}

export function startEditActivity(activity: Activity): Action {
    const editedActivity = {
        id: activity.id,
        date: activity.date,
        duration: TimeUtils.formatHourMinutes(activity.duration),
        distance: DistanceUtils.formatKm(activity.distance)
    };
    return actionBuilders.setEditedActivity(editedActivity);
}

export function dismissEditActivity(): Action {
    // HACK - a specialized action would br cleaner...
    return actionBuilders.setEditedActivity(null);
}

export function saveActivity(builder: ActivityBuilder): ThunkAction {
    const activity: Activity = {
        id: builder.id ? builder.id : "" /* HACK */,
        date: builder.date,
        duration: TimeUtils.parseDuration(builder.duration),
        distance: DistanceUtils.parseDistance(builder.distance)
    };

    return (dispatch) => {
        rpc.post(ACTIVITY_API, activity)
            .then((updatedActivity) => {
                dispatch(actionBuilders.activitySaved(updatedActivity));
            })
            .catch((error) => {
                dispatch(actionBuilders.setError(error));
            });
    };
}

export function startDeleteActivity(activity: Activity): Action {
    return actionBuilders.setDeletedActivity(activity);
}

export function dismissDeleteActivity(): Action {
    // HACK - a specialized action would br cleaner...
    return actionBuilders.setDeletedActivity(null);
}

export function deleteActivity(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState) => {
        const activity = getState().deletedActivity;
        if (activity) {
            rpc._delete(ACTIVITY_API, activity)
                .then(() => {
                    dispatch(actionBuilders.activityDeleted(activity));
                })
                .catch((error) => {
                    dispatch(actionBuilders.setError(error));
                });
        }
    };
}

export function dismissError(): Action {
    return actionBuilders.setError(null);
}
