// @flow

import type {Activity, ActivityBuilder, Attribute} from "./Types";

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
    chartData: mixed[][],
    error: ?Error
};
