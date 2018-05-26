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
export type GetState = () => AppState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => void;

const useRealBackendInDev = true;

// TODO : inject service interface in store state?
let rpc;
if (useRealBackendInDev || process.env.NODE_ENV === "production") {
    rpc = new RPC();
} else {
    rpc = new DummyRPC();
}

export function overrideRPC(providedRPC: RPC) {
    rpc = providedRPC;
}

const ACTIVITY_API = "/api/activities";
const CHART_API = "/api/graph"; // TODO : use CHART or GRAPH everywhere

export function fetchActivities(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState) => {
        if (!getState().loadingActivities) {
            dispatch(dismissError());
            dispatch(actionBuilders.loadActivitiesStart());
            rpc.get(ACTIVITY_API)
                .then((activities) => {
                    dispatch(actionBuilders.loadActivitiesSuccess(activities));
                })
                .catch((error) => {
                    console.error("Failed to load activities", error);
                    dispatch(actionBuilders.loadActivitiesFailure(error));
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
                console.error("Failed to load activities", error);
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

export function updateChartInterval(interval: string): ThunkAction {
    return (dispatch: Dispatch) => {
        dispatch(actionBuilders.setChartInterval(interval));
        dispatch(doFetchChartData);
    };
}

export function updateChartMeasure(measure: string): ThunkAction {
    return (dispatch: Dispatch) => {
        dispatch(actionBuilders.setChartMeasure(measure));
        dispatch(doFetchChartData);
    };
}

export function updateChartGrouping(grouping: string): ThunkAction {
    return (dispatch: Dispatch) => {
        dispatch(actionBuilders.setChartGrouping(grouping));
        dispatch(doFetchChartData);
    };
}

export function fetchChartData() {
    return doFetchChartData;
}

export function doFetchChartData(dispatch: Dispatch, getState: GetState) {
    if (!getState().loadingGraph) {
        dispatch(dismissError());
        dispatch(actionBuilders.loadChartDataStart());
        const {chartInterval, chartMeasure, chartGrouping} = getState();
        rpc.get(`${CHART_API}?interval=${chartInterval}&measure=${chartMeasure}&grouping=${chartGrouping}`)
            .then((data) => {
                dispatch(actionBuilders.loadChartDataSuccess(data));
            })
            .catch((error) => {
                console.error("Failed to load chart data", error);
                dispatch(actionBuilders.loadChartDataFailure(error));
            });
    }
}

export function dismissError(): Action {
    return actionBuilders.setError(null);
}
