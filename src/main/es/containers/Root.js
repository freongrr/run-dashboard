// @flow
"use strict";

import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";

import configureStore from "../redux/Store";
import {Provider} from "react-redux";
import Dashboard from "./Dashboard";
import ActivityPage from "./ActivityPage";

const store = configureStore();

export default class Root extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <HashRouter>
                    {/* TODO : render a common header with navigation */}
                    <Switch>
                        <Route exact path="/" component={Dashboard}/>
                        <Route exact path="/activities/" component={ActivityPage}/>
                    </Switch>
                    {/* TODO : add a global error dialog here? */}
                </HashRouter>
            </Provider>
        );
    }
}
