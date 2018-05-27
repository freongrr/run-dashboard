// @flow
"use strict";

import type {Attribute} from "../types/Types";

export const ATTRIBUTES: Attribute[] = [
    // Core attributes
    {
        id: "duration",
        label: "Duration",
        type: "CORE",
        dataType: "NUMBER"
    },
    {
        id: "distance",
        label: "Distance",
        type: "CORE",
        dataType: "NUMBER"
    },
    // Derived attributes
    {
        id: "count",
        label: "Number of runs",
        type: "DERIVED",
        dataType: "NUMBER",
    },
    {
        id: "time1km",
        label: "Time for 1km",
        type: "DERIVED",
        dataType: "NUMBER"
    },
    {
        id: "speed",
        label: "Speed",
        type: "DERIVED",
        dataType: "NUMBER"
    },
    // Extra attributes
    {
        id: "city",
        label: "City",
        type: "EXTRA",
        dataType: "STRING"
    },
    {
        id: "temperature",
        label: "Temperature (Celsius)",
        type: "EXTRA",
        dataType: "NUMBER"
    }
];

export const ACTIVITIES = [
    {
        id: "1",
        date: "2016-12-17",
        duration: 2544,
        distance: 8500,
        attributes: {
            "temperature": "12",
            "city": "Setagaya"
        }
    },
    {
        id: "2",
        date: "2016-12-11",
        duration: 2145,
        distance: 7000,
        attributes: {
            "temperature": "8",
            "city": "Setagaya"
        }
    },
    {
        id: "3",
        date: "2016-10-22",
        duration: 3391,
        distance: 11500,
        attributes: {
            "temperature": "16",
            "city": "Setagaya"
        }
    },
    {
        id: "4",
        date: "2016-10-06",
        duration: 1547,
        distance: 5500,
        attributes: {
            "temperature": "18",
            "city": "Paris"
        }
    }
];
