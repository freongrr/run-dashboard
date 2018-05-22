// @flow

import {combineReducers} from "redux";
import update from "immutability-helper";

import type {Activity, ActivityBuilder, AttributeType} from "../types/Types";
import type {Action} from "./actionBuilders";
import * as AttributeTypes from "../data/AttributeTypes";

export function attributeTypes(state: AttributeType[]): AttributeType[] {
    if (state === undefined || state.length === 0) {
        return AttributeTypes.ACTIVITY_ATTRIBUTES;
    } else {
        return state;
    }
}

export function isFetching(state: boolean = false, action: Action): boolean {
    if (action.type === "REQUEST_ACTIVITIES") {
        return true;
    } else if (action.type === "RECEIVED_ACTIVITIES") {
        return false;
    } else {
        return state;
    }
}

export function activities(state: Activity[] = [], action: Action): Activity[] {
    if (action.type === "RECEIVED_ACTIVITIES") {
        return action.activities;
    } else if (action.type === "ACTIVITY_SAVED") {
        const updatedActivity = action.activity;
        const index = state.findIndex(a => a.id === updatedActivity.id);
        // TODO : sort? or refresh?
        if (index >= 0) {
            return update(state, {[index]: {$set: updatedActivity}});
        } else {
            return update(state, {$unshift: [updatedActivity]});
        }
    } else if (action.type === "ACTIVITY_DELETED") {
        const updatedActivity = action.activity;
        const index = state.findIndex(a => a.id === updatedActivity.id);
        if (index >= 0) {
            return update(state, {$splice: [[index, 1]]});
        } else {
            console.warn("Could not remove element");
            return state;
        }
    } else {
        return state;
    }
}

export function editedActivity(state: ?ActivityBuilder = null, action: Action): ?ActivityBuilder {
    if (action.type === "SET_EDITED_ACTIVITY") {
        return action.builder;
    } else if (action.type === "ACTIVITY_SAVED") {
        return null;
    } else {
        return state;
    }
}

export function deletedActivity(state: ?Activity = null, action: Action): ?Activity {
    if (action.type === "SET_DELETED_ACTIVITY") {
        return action.activity;
    } else if (action.type === "ACTIVITY_DELETED") {
        return null;
    } else {
        return state;
    }
}

export function error(state: ?Error = null, action: Action): ?Error {
    if (action.type === "SET_ERROR") {
        return action.error;
    } else {
        return state;
    }
}

// TODO : add a bunch of stuff

export default combineReducers({
    attributeTypes,
    isFetching,
    activities,
    editedActivity,
    deletedActivity,
    error
});
