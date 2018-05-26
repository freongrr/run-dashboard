// @flow
"use strict";

import type {Attribute} from "../types/Types";

// TODO : load from server?
export const ACTIVITY_ATTRIBUTES: Attribute[] = [
    // Core attributes
    {
        id: "duration",
        label: "Duration",
        type: "core",
        dataType: "number"
    },
    {
        id: "distance",
        label: "Distance",
        type: "core",
        dataType: "number"
    },
    // Derived attributes
    {
        id: "count",
        label: "Number of runs",
        type: "derived",
        dataType: "number",
    },
    {
        id: "time1km",
        label: "Time for 1km",
        type: "derived",
        dataType: "number"
    },
    {
        id: "speed",
        label: "Speed",
        type: "derived",
        dataType: "number"
    },
    // Extra attributes
    {
        id: "city",
        label: "City",
        type: "extra",
        dataType: "string"
    },
    {
        id: "temperature",
        label: "Temperature (Celsius)",
        type: "extra",
        dataType: "number"
    }
];
