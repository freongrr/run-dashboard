// @flow

import type {Activity, ActivityBuilder} from "../types/Types";

// TODO : standardize action naming
export type Action =
    { type: "LOAD_ACTIVITIES_START" } |
    { type: "LOAD_ACTIVITIES_SUCCESS", activities: Activity[] } |
    { type: "LOAD_ACTIVITIES_FAILURE", error: Error } |
    { type: "SET_EDITED_ACTIVITY", builder: ?ActivityBuilder } |
    { type: "ACTIVITY_SAVED", activity: Activity } |
    { type: "SET_DELETED_ACTIVITY", activity: ?Activity } |
    { type: "ACTIVITY_DELETED", activity: Activity } |
    { type: "SET_CHART_INTERVAL", interval: string } |
    { type: "SET_CHART_MEASURE", measure: string } |
    { type: "SET_CHART_GROUPING", grouping: string } |
    { type: "LOAD_CHART_DATA_START" } |
    { type: "LOAD_CHART_DATA_SUCCESS", data: number[][] } |
    { type: "LOAD_CHART_DATA_FAILURE", error: Error } |
    { type: "SET_ERROR", error: ?Error };

export function loadActivitiesStart(): Action {
    return {type: "LOAD_ACTIVITIES_START"};
}

export function loadActivitiesSuccess(activities: Activity[]): Action {
    return {type: "LOAD_ACTIVITIES_SUCCESS", activities};
}

export function loadActivitiesFailure(error: Error): Action {
    return {type: "LOAD_ACTIVITIES_FAILURE", error};
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

export function setChartInterval(interval: string): Action {
    return {type: "SET_CHART_INTERVAL", interval};
}

export function setChartMeasure(measure: string): Action {
    return {type: "SET_CHART_MEASURE", measure};
}

export function setChartGrouping(grouping: string): Action {
    return {type: "SET_CHART_GROUPING", grouping};
}

export function loadChartDataStart(): Action {
    return {type: "LOAD_CHART_DATA_START"};
}

export function loadChartDataSuccess(data: number[][]): Action {
    return {type: "LOAD_CHART_DATA_SUCCESS", data};
}

export function loadChartDataFailure(error: Error): Action {
    return {type: "LOAD_CHART_DATA_FAILURE", error};
}

export function setError(error: ?Error): Action {
    return {type: "SET_ERROR", error};
}
