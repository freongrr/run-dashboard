// @flow
"use strict";

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

export type GraphBuilder = {
    type: "line" | "bar",
    time: boolean,
    x: {
        id: string,
        name: string,
        provider: (a: Activity) => any,
        format: (value: number) => string,
        values?: any[]
    },
    series: Array<GraphSeriesBuilder>
};
