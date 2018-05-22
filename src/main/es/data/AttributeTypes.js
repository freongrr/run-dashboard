// @flow
"use strict";

import type {AttributeType} from "../types/Types";

// TODO : load from server?

export const ACTIVITY_ATTRIBUTES: AttributeType[] = [
    {
        id: "city",
        label: "City",
        type: "string"
    },
    {
        id: "temperature",
        label: "Temperature (Celsius)",
        type: "number"
    }
];
