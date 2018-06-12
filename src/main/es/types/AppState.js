// @flow

import type {Activity, ActivityBuilder, Attribute, GraphData} from "./Types";

export type AppState = {
    loadingAttributes: boolean,
    loadingActivities: boolean,
    loadingGraph: boolean,
    attributes: Attribute[],
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    chartInterval: string,
    chartMeasure: string,
    chartGrouping: string,
    chartData: GraphData,
    error: ?Error
};
