// @flow

import * as redux from "redux";
import reduxThunk from "redux-thunk";
import * as reduxLogger from "redux-logger";
import type {AppState} from "../types/AppState";
import rootReducer from "./reducers";

const INITIAL_STATE: AppState = {
    loadingAttributes: false,
    loadingActivities: false,
    loadingGraph: false,
    attributes: [],
    activities: [],
    editedActivity: null,
    deletedActivity: null,
    chartInterval: "last12Months",
    chartMeasure: "distance",
    chartGrouping: "yearAndMonth",
    chartData: {rows: []},
    error: null
};

export default function (preLoadedState: ?AppState = INITIAL_STATE) {
    return redux.createStore(
        rootReducer,
        preLoadedState,
        redux.applyMiddleware(
            reduxThunk,
            reduxLogger.createLogger())
    );
}
