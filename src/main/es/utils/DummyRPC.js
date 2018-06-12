// @flow
"use strict";

import type {Activity} from "../types/Types";
import * as TestData from "../data/TestData";

const ATTRIBUTE_API = "/api/attributes";
const ACTIVITY_API = "/api/activities";

export default class DummyRPC {

    activitiesById: { [string]: Activity } = {};

    constructor() {
        TestData.ACTIVITIES.forEach(a => {
            this.activitiesById[a.id] = a;
        });
    }

    get(path: string): Promise<any> {
        if (path === ATTRIBUTE_API) {
            return Promise.resolve(TestData.ATTRIBUTES);
        } else if (path === ACTIVITY_API) {
            const activities: Activity[] = (Object.values(this.activitiesById): any);
            activities.sort((a, b) => b.date.localeCompare(a.date));
            return Promise.resolve(activities);
        } else {
            return Promise.reject(new Error("404"));
        }
    }

    post(path: string, data: { [key: string]: any }): Promise<any> {
        if (path === ACTIVITY_API && data !== null && data !== undefined) {
            this.activitiesById[data.id] = (data: any);
            return Promise.resolve(data);
        } else {
            return Promise.reject(new Error("404"));
        }
    }

    _delete(path: string, data: { [key: string]: any }): Promise<any> {
        if (path === ACTIVITY_API && data !== null && data !== undefined) {
            delete this.activitiesById[data.id];
            return Promise.resolve(data);
        } else {
            return Promise.reject(new Error("404"));
        }
    }
}
