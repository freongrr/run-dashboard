// @flow
"use strict";

import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";

import configureStore from "../redux/Store";
import {Provider} from "react-redux";
import TopBar from "../components/TopBar";
import Dashboard from "./Dashboard";
import ActivityPage from "./ActivityPage";

const store = configureStore();

export default class Root extends React.Component<{}> {
    render() {
        return (
            <Provider store={store}>
                <HashRouter>
                    <div>
                        <TopBar/>
                        <div className="container">
                            <Switch>
                                <Route exact path="/" component={Dashboard}/>
                                <Route exact path="/activities/" component={ActivityPage}/>
                            </Switch>
                        </div>
                        {/* TODO : add a global error dialog here? */}
                    </div>
                </HashRouter>
            </Provider>
        );
    }
}
