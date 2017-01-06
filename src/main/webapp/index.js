import React from "react";
import Dashboard from "./Dashboard";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute, hashHistory} from "react-router";
import RPCImpl from "./DummyRPC";
// import RPCImpl from "./AJAX";

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    ReactDOM.render((
        <Router history={hashHistory}>
            <Route path="/" component={RoutedDashboard}>
                {/*TODO : can I use a redirect instead of copy/pasting?*/}
                <IndexRoute components={{graph: YearGraph}} eventKey="y"/>
                <Route path="Year" components={{graph: YearGraph}} eventKey="y"/>
                <Route path="Month" components={{graph: MonthGraph}} eventKey="m"/>
                <Route path="Week" components={{graph: WeekDashboard}} eventKey="w"/>
            </Route>
        </Router>
    ), content);
});

function RoutedDashboard(props : any) {
    return <Dashboard rpc={new RPCImpl()}
                      graph={props.graph}
                      graphEventKey={props.graph.props.route.eventKey}/>;
}

function YearGraph() {
    return <div>Year Graph</div>;
}

function MonthGraph() {
    return <div>Month Graph</div>;
}

function WeekDashboard() {
    return <div>Week Graph</div>;
}
