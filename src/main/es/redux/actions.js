// @flow
/* global process */

import type {Activity, ActivityBuilder} from "../types/Types";
import type {AppState} from "../types/AppState";
import type {Action} from "./actionBuilders";
import * as actionBuilders from "./actionBuilders";
import RPC from "../utils/RPC";
import DummyRPC from "../utils/DummyRPC";
import * as CopyTools from "../data/CopyTools";

export type Dispatch = (action: Action | ThunkAction) => void;
type GetState = () => AppState;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => void;

// TODO : inject service interface in store state?
let rpc;
if (process.env.NODE_ENV === "production") {
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
    const builder: ActivityBuilder = {
        id: null,
        date: "",
        duration: "",
        distance: "",
        attributes: {}
    };
    return actionBuilders.setEditedActivity(builder);
}

export function startEditActivity(activity: Activity): Action {
    const builder = CopyTools.toBuilder(activity);
    return actionBuilders.setEditedActivity(builder);
}

export function dismissEditActivity(): Action {
    // HACK - a specialized action would br cleaner...
    return actionBuilders.setEditedActivity(null);
}

export function saveActivity(builder: ActivityBuilder): ThunkAction {
    const activity = CopyTools.fromBuilder(builder);
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
