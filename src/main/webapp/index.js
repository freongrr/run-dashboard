import React from "react";
import Dashboard from "./Dashboard";
import ReactDOM from "react-dom";
import {Router, Route, hashHistory} from "react-router";
import RPCImpl from "./DummyRPC";
// import RPCImpl from "./AJAX";

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={createDefaultDashboard}/>
            <Route path="/Year" component={createYearDashboard}/>
            <Route path="/Month" component={createMonthDashboard}/>
            <Route path="/Week" component={createWeekDashboard}/>
        </Router>
    ), content);
});

function createDefaultDashboard(foo) {
    return createYearDashboard();
}

function createYearDashboard() {
    return <Dashboard rpc={new RPCImpl()} graph="year"/>;
}

function createMonthDashboard() {
    return <Dashboard rpc={new RPCImpl()} graph="month"/>;
}

function createWeekDashboard() {
    return <Dashboard rpc={new RPCImpl()} graph="week"/>;
}
