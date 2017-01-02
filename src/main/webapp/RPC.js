// @flow
/* eslint no-unused-vars: ["off"] */
"use strict";

import when from "when";

// TODO : is there a way to declare an interface or an abstract class?
export default class RPC {

    get(path: string): Promise<any> {
        return when.reject(new Error("Not implemented"));
    }

    post(path: string, data: {[key: string]: any}): Promise<any> {
        return when.reject(new Error("Not implemented"));
    }
}
