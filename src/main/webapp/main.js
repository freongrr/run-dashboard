// @flow
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {Router, IndexRoute, Route, hashHistory} from "react-router";
// import RPCImpl from "./DummyRPC";
import RPCImpl from "./AJAX";
import DataStore from "./DataStore";
import ChartPanel from "./ChartPanel";
import Dashboard from "./Dashboard";

document.addEventListener("DOMContentLoaded", () => {
    const rpc = new RPCImpl();
    const dataStore = new DataStore(rpc);

    const content = document.getElementById("content");
    ReactDOM.render((
        <Router history={hashHistory}>
            {/* TODO : If the graph component does not change, should I hard code it in Dashboard? */}
            <Route path="/" component={Dashboard} dataStore={dataStore}>
                <IndexRoute components={{chart: ChartPanel}} dataStore={dataStore} zoom="year"/>
                <Route path="/Year" components={{chart: ChartPanel}} dataStore={dataStore} zoom="year"/>
                <Route path="/Month" components={{chart: ChartPanel}} dataStore={dataStore} zoom="month"/>
                <Route path="/Week" components={{chart: ChartPanel}} dataStore={dataStore} zoom="week"/>
            </Route>
        </Router>
    ), content);
});
