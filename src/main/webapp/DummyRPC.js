// @flow
"use strict";

import when from "when";

export default class DummyRPC {

    get(path: string): Promise<any> {
        if (path === "/activities") {
            return when.resolve([
                {
                    id: "1",
                    date: "2016-12-17",
                    duration: 2544,
                    distance: 8500
                }, {
                    id: "2",
                    date: "2016-12-11",
                    duration: 2145,
                    distance: 7000
                }, {
                    id: "3",
                    date: "2016-10-22",
                    duration: 3391,
                    distance: 11500
                }, {
                    id: "4",
                    date: "2016-10-06",
                    duration: 1547,
                    distance: 5500
                }
            ]);
        } else {
            return when.reject(new Error("404"));
        }
    }

    post(path: string, data: {[key: string]: any}): Promise<any> {
        if (path === "/activities" && data !== null && data !== undefined) {
            return when.resolve(data);
        } else {
            return when.reject(new Error("404"));
        }
    }

    _delete(path: string, data: {[key: string]: any}): Promise<any> {
        if (path === "/activities" && data !== null && data !== undefined) {
            return when.resolve(data);
        } else {
            return when.reject(new Error("404"));
        }
    }
}
