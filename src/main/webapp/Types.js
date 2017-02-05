// @flow
"use strict";

// I could not find a way to export a flowtype interface...
export type RPC = {
    get(path: string): Promise<any>;
    post(path: string, data: {[key: string]: any}): Promise<any>;
    _delete(path: string, data: {[key: string]: any}): Promise<any>;
};

// export type RouteLocation = {
//     pathname: string,
//     search: string,
//     state: any,
//     action: string,
//     key: string
// };

export type Activity = {
    id: string,
    date: string,
    duration: number,
    distance: number
};

/** This is used in the edit dialog */
export type ActivityBuilder = {
    id: ?string,
    date: string,
    duration: string,
    distance: string
};

export type GraphSeriesBuilder = {
    id: string,
    name: string,
    provider: (a: Activity) => number,
    aggregator?: string | (values: number[]) => number,
    format: (value: number) => string,
    secondY: boolean
    // TODO : tick config
};

export type GraphAxisBuilder = {
    id: string,
    name: string,
    provider: (a: Activity) => any,
    format: (value: number) => string,
    values?: any[]
};

export type GraphBuilder = {
    type: "line" | "bar",
    time: boolean,
    x: GraphAxisBuilder,
    series: Array<GraphSeriesBuilder>
};
