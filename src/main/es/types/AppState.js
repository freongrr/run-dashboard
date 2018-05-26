// @flow

import type {Activity, ActivityBuilder, Attribute} from "./Types";

export type AppState = {
    attributes: Attribute[],
    loadingActivities: boolean,
    loadingGraph: boolean,
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    chartInterval: string,
    chartMeasure: string,
    chartGrouping: string,
    chartData: mixed[][],
    error: ?Error
};
