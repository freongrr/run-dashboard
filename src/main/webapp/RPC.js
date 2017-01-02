// @flow
/* eslint no-unused-vars: ["off"] */
"use strict";

// TODO : is there a way to declare an interface or an abstract class?
export default class RPC {

    get(path: string): Promise<any> {
        throw new Error("Not implemented");
    }

    post(path: string, data: {[key: string]: any}): Promise<any> {
        throw new Error("Not implemented");
    }
}
