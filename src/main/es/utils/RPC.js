// @flow
"use strict";

// TODO : also, replace with standard framework (fetch?)
export default class RPC {

    get(path: string): Promise<any> {
        return this._open("GET", path)
            .then((data) => deserializeData(data));
    }

    post(path: string, data: any): Promise<any> {
        return serializeData(data)
            .then((json) => this._open("POST", path, json, "application/json"))
            .then((data) => deserializeData(data));
    }

    _delete(path: string, data: any): Promise<any> {
        return serializeData(data)
            .then((json) => this._open("DELETE", path, json, "application/json"))
            .then((data) => deserializeData(data));
    }

    _open(method: string, path: string, data?: any, contentType?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                const xhr = getXMLHttpRequest();
                console.debug(`Sending ${method} to ${path}`);
                xhr.withCredentials = true;
                xhr.open(method, path, true);
                if (contentType) {
                    xhr.setRequestHeader("Content-type", contentType);
                }
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        console.debug(`Handling response from ${method}: ${xhr.status}`);
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        } else if (xhr.status === 204) {
                            resolve("");
                        } else {
                            let error = extractError(xhr);
                            if (isDevelopmentProxyError(error)) {
                                reject(new Error("Can't proxy request"));
                            } else {
                                reject(error);
                            }
                        }
                    }
                };
                xhr.send(data);
            } catch (e) {
                if (isDevelopmentProxyError(e)) {
                    reject(new Error("Can't proxy request"));
                } else {
                    reject(e);
                }
            }
        });
    }
}

function getXMLHttpRequest(): XMLHttpRequest {
    try {
        if (typeof XMLHttpRequest !== "undefined") {
            return new XMLHttpRequest();
        } else {
            return window.createRequest();
        }
    } catch (e) {
        throw new Error("Can't create XMLHttpRequest");
    }
}

function serializeData(data: any): Promise<string> {
    try {
        const json = JSON.stringify(data);
        return Promise.resolve(json);
    } catch (e) {
        return Promise.reject(e);
    }
}

function deserializeData(data: any): Promise<string> {
    try {
        if (isJSON(data)) {
            return Promise.resolve(JSON.parse(data));
        } else {
            return Promise.resolve(data);
        }
    } catch (e) {
        return Promise.reject(e);
    }
}

function isJSON(string) {
    return string.length > 0 && (string.charAt(0) === "{" || string.charAt(0) === "[");
}

function extractError(xhr: XMLHttpRequest): Error {
    return extractStatusError(xhr.status, xhr.response);
}

function extractStatusError(statusCode: number, responseContent: string): Error {
    if (statusCode === 0) {
        return new Error("Could not connect to the server!");
    } else if (statusCode === 500) {
        return new Error("Internal Server Error");
    } else {
        return new Error(statusCode + ": " + responseContent);
    }
}

export function isDevelopmentProxyError(error: Error): boolean {
    try {
        const isProxyError = error.toString().indexOf("504") >= 0;
        const host = location.host;
        const isDevHost = host.startsWith("localhost") || host.startsWith("127") || host.startsWith("0");
        return isProxyError && isDevHost;
    } catch (e) {
        return false;
    }
}
