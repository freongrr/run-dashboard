// @flow
"use strict";

import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "./Dashboard";
import RPCImpl from "./DummyRPC";

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    ReactDOM.render((<Dashboard rpc={new RPCImpl()}/>), content);
});
