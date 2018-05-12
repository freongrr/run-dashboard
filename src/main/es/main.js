// @flow

import "./stylesheets/main.scss";

import React from "react";
import ReactDOM from "react-dom";
import Root from "./containers/Root";

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    if (content) {
        ReactDOM.render((
            <Root/>
        ), content);
    }
});
