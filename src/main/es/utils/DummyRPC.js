// @flow
"use strict";

import when from "when";
import type {Activity} from "../types/Types";

export default class DummyRPC {

    activitiesById: { [string]: Activity } = {
        "1": {
            id: "1",
            date: "2016-12-17",
            duration: 2544,
            distance: 8500,
            metadata: {
                "temperature": 12,
                "city": "Setagaya"
            }
        },
        "2": {
            id: "2",
            date: "2016-12-11",
            duration: 2145,
            distance: 7000,
            metadata: {
                "temperature": 8,
                "city": "Setagaya"
            }
        },
        "3": {
            id: "3",
            date: "2016-10-22",
            duration: 3391,
            distance: 11500,
            metadata: {
                "temperature": 16,
                "city": "Setagaya"
            }
        }, "4": {
            id: "4",
            date: "2016-10-06",
            duration: 1547,
            distance: 5500,
            metadata: {
                "temperature": 18,
                "city": "Paris"
            }
        }
    };

    get(path: string): Promise<any> {
        if (path === "/activities") {
            const activities: Activity[] = (Object.values(this.activitiesById): any);
            activities.sort((a, b) => b.date.localeCompare(a.date));
            return when.resolve(activities);
        } else {
            return when.reject(new Error("404"));
        }
    }

    post(path: string, data: { [key: string]: any }): Promise<any> {
        if (path === "/activities" && data !== null && data !== undefined) {
            this.activitiesById[data.id] = (data: any);
            return when.resolve(data);
        } else {
            return when.reject(new Error("404"));
        }
    }

    _delete(path: string, data: { [key: string]: any }): Promise<any> {
        if (path === "/activities" && data !== null && data !== undefined) {
            delete this.activitiesById[data.id];
            return when.resolve(data);
        } else {
            return when.reject(new Error("404"));
        }
    }
}
