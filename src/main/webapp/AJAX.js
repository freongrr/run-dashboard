// @flow
/* eslint no-console: ["off"] */
/* eslint no-unused-vars: ["off"] */
"use strict";

import when from "when";
import RPC from "./RPC";

export default class AJAX extends RPC {
    get(path: string): Promise<string> {
        const deferred = when.defer();
        this.rawGet(path)
            .then((response) => {
                let result;
                if (isJSON(response)) {
                    result = JSON.parse(response);
                } else {
                    result = response;
                }
                deferred.resolve(result);
            })
            .catch((e) => deferred.reject(e));
        return deferred.promise;
    }

    rawGet(path: string): Promise<string> {
        const deferred = when.defer();
        try {
            const xhr = getXMLHttpRequest();
            console.debug(`GET-ing from ${path}`);
            xhr.open("GET", path, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    console.debug(`Handling response from GET: ${xhr.status}`);
                    if (xhr.status == 200) {
                        deferred.resolve(xhr.response);
                    } else {
                        const errorMessage = extractErrorMessage(xhr.status, xhr.response);
                        deferred.reject(new Error(errorMessage));
                    }
                }
            };
            xhr.send();
        } catch (e) {
            deferred.reject(e);
        }
        return deferred.promise;
    }

    post(path: string, data: {[key: string]: any}): Promise<any> {
        const deferred = when.defer();
        const json = JSON.stringify(data);
        this.rawPost(path, json)
            .then((response) => {
                let result;
                if (isJSON(response)) {
                    result = JSON.parse(response);
                } else {
                    result = response;
                }
                deferred.resolve(result);
            })
            .catch((e) => deferred.reject(e));
        return deferred.promise;
    }

    rawPost(path: string, data: string): Promise<any> {
        const deferred = when.defer();
        try {
            const xhr = getXMLHttpRequest();
            xhr.open("POST", path, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    console.debug(`Handling response from POST: ${xhr.status}`);
                    if (xhr.status == 200) {
                        deferred.resolve(xhr.response);
                    } else {
                        const errorMessage = extractErrorMessage(xhr.status, xhr.response);
                        deferred.reject(new Error(errorMessage));
                    }
                }
            };
            console.debug(`POST-ing ${data.length} bytes of data to ${path}`);
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
