// @flow

import type {Activity, ActivityBuilder, AttributeType} from "./Types";

export type AppState = {
    attributeTypes: AttributeType[],
    isFetching: boolean,
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    chartInterval: string,
    chartMeasure: string,
    chartGrouping: string,
    chartData: mixed[][],
    error: ?Error
};
