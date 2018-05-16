// @flow
"use strict";

import type {AttributeType} from "../types/Types";

// TODO : load from server?

const ALL_AGGREGATES = ["min", "max", "avg"];

export const ACTIVITY_ATTRIBUTES: AttributeType[] = [
    {
        id: "city",
        label: "City",
        type: "string",
        output: false
    },
    {
        id: "temperature",
        label: "Temperature (Celsius)",
        type: "number",
        output: false
    },
    {
        id: "distance",
        label: "Distance",
        type: "number",
        output: true,
        aggregates: ALL_AGGREGATES
    },
    {
        id: "duration",
        label: "Duration",
        type: "number",
        output: true,
        aggregates: ALL_AGGREGATES
    },
    {
        id: "runs",
        label: "Number of runs",
        type: "number",
        output: true,
        aggregates: []
    },
    {
        id: "time1km",
        label: "Time for 1km",
        type: "number",
        output: true,
        aggregates: ALL_AGGREGATES
    },
    {
        id: "speed",
        label: "Speed",
        type: "number",
        output: true,
        aggregates: ALL_AGGREGATES
    }
];
