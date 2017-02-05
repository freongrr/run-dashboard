// @flow
/* eslint no-console: ["off"] */
/* eslint no-unused-vars: ["off"] */
"use strict";

import when from "when";

export default class AJAX {

    get(path: string): Promise<string> {
        const deferred = when.defer();
        this.open("GET", path)
            .then(resolveResponse.bind(null, deferred))
            .catch((e) => deferred.reject(e));
        return deferred.promise;
    }

    post(path: string, data: {[key: string]: any}): Promise<any> {
        const deferred = when.defer();
        const json = JSON.stringify(data);
        this.open("POST", path, json)
            .then(resolveResponse.bind(null, deferred))
            .catch((e) => deferred.reject(e));
        return deferred.promise;
    }

    _delete(path: string, data: {[key: string]: any}): Promise<any> {
        const deferred = when.defer();
        const json = JSON.stringify(data);
        this.open("DELETE", path, json)
            .then(resolveResponse.bind(null, deferred))
            .catch((e) => deferred.reject(e));
        return deferred.promise;
    }

    open(method: string, path: string, data?: any): Promise<any> {
        const deferred = when.defer();
        try {
            const xhr = getXMLHttpRequest();
            console.debug(`Sending ${method} to ${path}`);
            xhr.open(method, path, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    console.debug(`Handling response from ${method}: ${xhr.status}`);
                    if (xhr.status == 200) {
                        deferred.resolve(xhr.response);
                    } else {
                        const errorMessage = extractErrorMessage(xhr.status, xhr.response);
                        deferred.reject(new Error(errorMessage));
                    }
                }
            };
            xhr.send(data);
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }
}

function getXMLHttpRequest(): XMLHttpRequest {
    try {
        if (typeof XMLHttpRequest != "undefined") {
            return new XMLHttpRequest();
        } else {
            return window.createRequest();
        }
    } catch (e) {
        throw new Error("Can't create XMLHttpRequest");
    }
}

function isJSON(string) {
    return string.length > 0 && (string.charAt(0) === "{" || string.charAt(0) === "[");
}

function extractErrorMessage(statusCode: number, responseContent: string): string {
    if (statusCode == 0) {
        return "Could not connect to the server!";
    } else if (statusCode == 500) {
        return "Internal Server Error";
    } else {
        return statusCode + ": " + responseContent;
    }
}

function resolveResponse(deferred: {resolve: (any) => {}}, response: any) {
    if (isJSON(response)) {
        deferred.resolve(JSON.parse(response));
    } else {
        deferred.resolve(response);
    }
}
