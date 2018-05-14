// @flow
"use strict";

// TODO : redo activity with generic data

export type Activity = {|
    id: string,
    date: string,
    duration: number,
    distance: number,
    metadata: { [string]: string | number | boolean }
|};

// Metadata, used for grouping activities on a graphs (it would be pointless to graph it):
export type Property = {|
    id: string,
    label: string,
    type: "string" | "number" | "boolean",
    hint?: string
|};

/** This is used in the edit dialog */
export type ActivityBuilder = {
    id: ?string,
    date: string,
    duration: string,
    distance: string
};

export type GraphSeriesBuilder = {
    name: string,
    secondY: boolean,
    format: (value: number) => string
};

export type GraphAxisBuilder = {
    name: string,
    format: (value: number) => string
};

export type GraphBuilder = {
    type: "line" | "bar",
    time: boolean,
    x: GraphAxisBuilder,
    series: Array<GraphSeriesBuilder>
};

export type AppState = {
    isFetching: boolean,
    activities: Activity[],
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};
