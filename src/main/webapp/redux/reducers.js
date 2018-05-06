// @flow

import {combineReducers} from "redux";

import {ReceivedActivitiesAction, RequestActivitiesAction} from "./actions";

function isFetching(state = false, action) {
    const payload = action && action.payload;
    if (payload instanceof RequestActivitiesAction) {
        return true;
    } else {
        return state;
    }
}

function activities(state = [], action) {
    const payload = action && action.payload;
    if (payload instanceof ReceivedActivitiesAction) {
        return payload.activities;
    } else {
        return state;
    }
}

export default combineReducers({
    isFetching,
    activities
});
