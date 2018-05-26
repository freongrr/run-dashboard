// @flow
"use strict";

// TODO : store duration and distance as attributes too?

export type Activity = {|
    id: string,
    date: string,
    duration: number,
    distance: number,
    attributes: { [string]: string }
|};

// Attributes associated with an activity:
// - "core" attributes are the date, distance, etc
// - "derived" attributes are extracted or calculated from the core attributes
// - "extra" attributes are dynamic values, similar to tags (e.g. city, temperature, etc)
export type Attribute = {|
    id: string,
    label: string,
    type: "core" | "derived" | "extra",
    dataType: "string" | "number" | "date"
|};

/** This is used in the edit dialog */
export type ActivityBuilder = {|
    id: ?string,
    date: string,
    duration: string,
    distance: string,
    attributes: { [string]: string }
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
