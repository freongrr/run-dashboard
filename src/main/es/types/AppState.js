// @flow

import type {Activity, ActivityBuilder, AttributeType} from "./Types";

export type AppState = {
    attributeTypes: AttributeType[],
    isFetching: boolean,
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};
