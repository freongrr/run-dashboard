// @flow
"use strict";

import type {Property} from "../types/Types";

// TODO : load from server?

export const ACTIVITY_PROPERTIES: Property[] = [
    {
        id: "city",
        label: "City",
        type: "string",
        hint: "city"
    },
    {
        id: "temperature",
        label: "Temperature (Celsius)",
        type: "number"
    }
];
