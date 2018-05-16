// @flow
"use strict";

// TODO : store duration and distance as attributes too?

export type Activity = {|
    id: string,
    date: string,
    duration: number,
    distance: number,
    attributes: { [string]: AttributeValue }
|};

export type AggregateOperation = "min" | "max" | "avg" | "count";

// Extra attributes associated with an activity.
// The output parameter controls whether the attribute can be used to group data (e.g. "City")
// on a graph, or if it is the data itself ("Total distance per month", "Average distance per month", etc)
export type AttributeType = {|
    id: string,
    label: string,
    type: "string" | "number" | "date",
    output: boolean,
    aggregates?: AggregateOperation[]
|};

export type AttributeValue = string;

/** This is used in the edit dialog */
export type ActivityBuilder = {|
    id: ?string,
    date: string,
    duration: string,
    distance: string,
    attributes: { [string]: AttributeValue }
|};

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
    series: GraphSeriesBuilder[]
};
