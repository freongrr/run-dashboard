// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {RPC, Activity} from "./Types";

export type Callback = (result: ?any[], error: ?Error) => void;
export type Subscription = {
    refresh: () => void,
    cancel: () => void
};

// TODO : define an interface/abstract class
// TODO : use Redux?
export default class DataStore {
    rpc: RPC;
    callbacks: {[key: string]: Callback[]};
    cachedValues: {[key: string]: any[]};

    constructor(rpc: RPC) {
        this.rpc = rpc;
        this.callbacks = {};
        this.cachedValues = {};
    }

    subscribe(resource: string, callback: Callback): Subscription {
        if (!this.callbacks[resource]) {
            this.callbacks[resource] = [];
        }
        this.callbacks[resource].push(callback);

        if (this.cachedValues[resource] !== undefined) {
            callback(this.cachedValues[resource], null);
        } else if (this.callbacks[resource].length === 1) {
            this._fetch(resource);
        }

        return {
            refresh: () => {
                this._fetch(resource);
            },

            cancel: () => {
                this.callbacks[resource] = this.callbacks[resource].filter(c => c !== callback);
                if (this.callbacks[resource].length === 0) {
                    delete this.callbacks[resource];
                    delete this.cachedValues[resource];
                }
            }
        };
    }

    _fetch(resource: string) {
        console.info("Querying " + resource + "...");
        this.rpc.get("/" + resource)
            .then((values: any[]) => this._updateCache(resource, values))
            .catch((e) => this._notifyError(resource, e));
    }

    _updateCache(resource: string, values: any[]) {
        console.debug(`Cached ${values.length} value(s) for resource ${resource}`);
        this.cachedValues[resource] = values;
        this._notifySubscriptions(resource);
    }

    _notifySubscriptions(resource: string) {
        const callbacks = this.callbacks[resource];
        const values = this.cachedValues[resource];
        console.debug(`Notifying ${callbacks.length} subscriber(s) that ${resource} has changed`);
        callbacks.forEach((c) => c(values, null));
    }

    _notifyError(resource: string, e: Error) {
        const callbacks = this.callbacks[resource];
        console.debug(`Notifying ${callbacks.length} subscriber(s) that ${resource} had an error`);
        callbacks.forEach((c) => c(null, e));
    }

    put(resource: string, activity: Activity) {
        console.info("Putting into " + resource + ": ", activity);
        this.rpc.post("/" + resource, activity)
            .then((values: any[]) => this._updateCache(resource, values))
            .catch((e) => this._notifyError(resource, e));
    }

    remove(resource: string, value: any) {
        console.info("Removing from: " + resource, value);
        this.rpc._delete("/" + resource, value)
            .then((values: any[]) => this._updateCache(resource, values))
            .catch((e) => this._notifyError(resource, e));
    }
}
