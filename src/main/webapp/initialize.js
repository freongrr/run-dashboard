// @flow
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
// import RPCImpl from "./DummyRPC";s
import RPCImpl from "./AJAX";
import DataStore from "./DataStore";
import ChartPanel from "./ChartPanel";
import Dashboard from "./Dashboard";

document.addEventListener("DOMContentLoaded", () => {
    const rpc = new RPCImpl();
    const dataStore = new DataStore(rpc);

    const content = document.getElementById("content");
    if (content) {
        ReactDOM.render((
            <Router>
                <Switch>
                    <Route extact path="/Last12Months" render={() => RoutedDashboard(dataStore, "last12Months")}/>
                    <Route extact path="/Last30Days" render={() => RoutedDashboard(dataStore, "last30Days")}/>
                    <Route render={() => RoutedDashboard(dataStore, "last12Months")}/>
                </Switch>
            </Router>
        ), content);
    }
});

function RoutedDashboard(dataStore, zoom: string) {
    // TODO : If the graph component does not change, should I hard code it in Dashboard?
    const chartPanel = <ChartPanel dataStore={dataStore} zoom={zoom}/>;
    return <Dashboard dataStore={dataStore} chart={chartPanel}/>;
}
