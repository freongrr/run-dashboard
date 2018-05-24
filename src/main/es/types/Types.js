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

// Metadata, used for grouping activities on a graphs (it would be pointless to graph it):
export type AttributeType = {|
    id: string,
    label: string,
    type: "string" | "number" | "date"
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
    series: Array<GraphSeriesBuilder>
};

