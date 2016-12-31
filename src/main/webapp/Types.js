// @flow
"use strict";

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
