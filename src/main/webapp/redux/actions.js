// @flow

import DummyRPC from "../utils/DummyRPC";
import type {Activity, AppState} from "../types/Types";

export class RequestActivitiesAction {
}

export class ReceivedActivitiesAction {
    activities: Activity[];

    constructor(activities: Activity[]) {
        this.activities = activities;
    }
}

type Action = {
    type: string,
    payload: RequestActivitiesAction | ReceivedActivitiesAction
};

export type Dispatch = (action: Action | ThunkAction) => void;
type GetState = () => AppState;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => void;

// TODO : inject service interface in store state?
const rpc = new DummyRPC();

export function fetchActivitiesIfNeeded(): ThunkAction {
    return (dispatch: Dispatch, getState: GetState) => {
        if (shouldFetchActivities(getState())) {
            dispatch(fetchActivities());
        }
    };
}

function shouldFetchActivities(state: AppState): boolean {
    return !state.isFetching;
}


function fetchActivities(): ThunkAction {
    return (dispatch) => {
        dispatch(createRequestActivitiesAction());

        rpc.get("/activities")
            .then(json => dispatch(createReceivedActivitiesAction(json)));
    };
}

export function saveActivity(activity: Activity): ThunkAction {
    return (/* dispatch */) => {
        rpc.post("/activities", activity)
            .then(() => {
                /* TODO */
            })
            .catch((error) => {
                /* TODO */
                console.error("TODO : handle error", error);
            });
    };
}

export function deleteActivity(activity: Activity): ThunkAction {
    return (/* dispatch */) => {
        rpc._delete("/activities", activity)
            .then(() => {
                /* TODO */
            })
            .catch((error) => {
                /* TODO */
                console.error("TODO : handle error", error);
            });
    };
}

function createRequestActivitiesAction() {
    return {
        type: "REQUEST_ACTIVITIES",
        payload: new RequestActivitiesAction()
    };
}

function createReceivedActivitiesAction(activities) {
    return {
        type: "REQUEST_ACTIVITIES",
        payload: new ReceivedActivitiesAction(activities)
    };
}
