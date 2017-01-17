// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import update from "react-addons-update";
import RPC from "./RPC";

type Callback = (activities: ?Activity[], error: ?Error) => void;

export default class DataStore {
    rpc: RPC;
    callbacks: Callback[];
    activities: Activity[];

    constructor(rpc: RPC) {
        this.rpc = rpc;
        this.callbacks = [];
        this.activities = [];
    }

    // TODO : there will be multiple calls and/or parameters
    subscribe(callback: Callback) {
        this.callbacks.push(callback);
    }

    _fetchActivities() {
        this.rpc.get("/activities")
            .then((activities) => {
                this.activities = activities;
                this._notifySubscriptions();
            })
            .catch((e) => {
                this._notifyError(e);
            });
    }

    _notifySubscriptions() {
        console.debug(`Notifying ${this.callbacks.length} subscribers that the data has changed`);
        this.callbacks.forEach((c) => c(this.activities, null));
    }

    _notifyError(e: Error) {
        console.debug(`Notifying ${this.callbacks.length} subscribers of an error`);
        this.callbacks.forEach((c) => c(null, e));
    }

    refresh() {
        this._fetchActivities();
    }

    put(activity: Activity) {
        console.info("Putting", activity);
        this.rpc.post("/activities", {activity: activity})
            .then((result) => this._updateCache(result))
            .catch((e) => this._notifyError(e));
    }

    _updateCache(activity: Activity) {
        const index = this._findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Replacing activity at index ${index}`);
            this.activities = update(this.activities, {$splice: [[index, 1, activity]]});
        } else {
            // TODO : insert at the correct position or refresh from the server!
            console.debug("Adding new activity");
            this.activities = update(this.activities, {$splice: [[0, 0, activity]]});
        }
        this._notifySubscriptions();
    }

    _findIndexOfActivity(activity: Activity | ActivityBuilder) {
        let index = -1;
        if (activity.id !== null) {
            this.activities.forEach((a, i) => {
                if (a.id === activity.id) {
                    index = i;
                }
            });
        }
        return index;
    }

    remove(activity: Activity) {
        console.info("Removing", activity);
        this.rpc._delete("/activities", {activity: activity})
            .then(() => this._deleteFromCache(activity))
            .catch((e) => this._notifyError(e));
    }

    _deleteFromCache(activity: Activity) {
        const index = this._findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Deleting activity at index ${index}`);
            this.activities = update(this.activities, {$splice: [[index, 1]]});
            this._notifySubscriptions();
        }
    }
}
