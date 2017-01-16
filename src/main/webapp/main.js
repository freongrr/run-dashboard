// @flow
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, hashHistory} from "react-router";
// import RPCImpl from "./DummyRPC";
import RPCImpl from "./AJAX";
import Dashboard from "./Dashboard";

document.addEventListener("DOMContentLoaded", () => {
    const rpc = new RPCImpl();

    const content = document.getElementById("content");
    ReactDOM.render((
        <Router history={hashHistory}>
            {/* TODO : If the graph component does not change, should I hard code it in Dashboard? */}
            <Route path="/" components={Dashboard} rpc={rpc} zoom="year"/>
            <Route path="/Year" components={Dashboard} rpc={rpc} zoom="year"/>
            <Route path="/Month" components={Dashboard} rpc={rpc} zoom="month"/>
            <Route path="/Week" components={Dashboard} rpc={rpc} zoom="week"/>
        </Router>
    ), content);
});
