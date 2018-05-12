// @flow

import expect from "expect";

declare var global: { XMLHttpRequest: any };

let oldXMLHttpRequest;

export function resetXMLHttpRequest() {
    global.XMLHttpRequest = oldXMLHttpRequest;
}

export function mockGET(expectedUrl: string, responseStatus: number, responseContent: string) {
    mockRequest("GET", expectedUrl, undefined, responseStatus, responseContent);
}

export function mockPOST(expectedUrl: string, expectedData: any, responseStatus: number, responseContent: string) {
    mockRequest("POST", expectedUrl, expectedData, responseStatus, responseContent);
}

export function mockDELETE(expectedUrl: string, expectedData: any, responseStatus: number, responseContent: string) {
    mockRequest("DELETE", expectedUrl, expectedData, responseStatus, responseContent);
}

function mockRequest(expectedMethod: string, expectedUrl: string, expectedData: any, responseStatus: number, responseContent: string) {
    if (oldXMLHttpRequest === undefined) {
        oldXMLHttpRequest = global.XMLHttpRequest;
    }

    global.XMLHttpRequest = class {
        hasCalledOpen: boolean;
        status: number;
        response: string;
        readyState: number;
        onreadystatechange: (any) => void;

        open(method: string, url: string /*, async: boolean, user: string, password: string */) {
            this.hasCalledOpen = true;
            expect(method).toEqual(expectedMethod);
            expect(url).toEqual(expectedUrl);
        }

        setRequestHeader(/*header: string, value: string*/) {
            // Not tested
        }

        send(data: any) {
            expect(data).toEqual(expectedData);
            expect(this.hasCalledOpen).toEqual(true);
            this.status = responseStatus;
            this.response = responseContent;
            this.readyState = 2;
            this.onreadystatechange({});
            this.readyState = 4;
            this.onreadystatechange({});
        }
    };
}
