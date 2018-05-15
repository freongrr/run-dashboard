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
const CHART_API = "/api/chart";

export function fetchActivities(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState) => {
        if (!getState().isFetching) {
            dispatch(actionBuilders.loadActivitiesStart());
            rpc.get(ACTIVITY_API)
                .then((json) => {
                    const activities = (json: any);
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
        dispatch(fetchChartData());
    };
}

export function updateChartMeasure(measure: string): ThunkAction {
    return (dispatch: Dispatch) => {
        dispatch(actionBuilders.setChartMeasure(measure));
        dispatch(fetchChartData());
    };
}

export function updateChartGrouping(grouping: string): ThunkAction {
    return (dispatch: Dispatch) => {
        dispatch(actionBuilders.setChartGrouping(grouping));
        dispatch(fetchChartData());
    };
}

export function fetchChartData(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState) => {
        // TODO : this should check a different flag
        const state = getState();
        if (!state.isFetching) {
            dispatch(actionBuilders.loadChartDataStart());
            rpc.get(`${CHART_API}?interval=${state.chartInterval}&measure=${state.chartMeasure}&grouping=` + state.chartGrouping)
                .then((json) => {
                    const data = (json: any);
                    dispatch(actionBuilders.loadActivitiesSuccess(data));
                })
                .catch((error) => {
                    dispatch(actionBuilders.loadChartDataFailure(error));
                });
        }
    };
}

export function dismissError(): Action {
    return actionBuilders.setError(null);
}
