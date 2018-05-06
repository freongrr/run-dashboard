// Can't use flow here because I override real types...
/* global global */
/* eslint no-unused-vars: ["off"] */
import expect from "expect";

export default {

    mockGET: function (expectedUrl, responseStatus, responseContent) {
        this.mockRequest("GET", expectedUrl, undefined, responseStatus, responseContent);
    },

    mockPOST: function (expectedUrl, expectedData, responseStatus, responseContent) {
        this.mockRequest("POST", expectedUrl, expectedData, responseStatus, responseContent);
    },

    // TODO : use jsdom instead
    mockRequest: function (expectedMethod, expectedUrl, expectedData, responseStatus, responseContent) {
        if (!this.backupXMLHttpRequest) {
            this.backupXMLHttpRequest = global.XMLHttpRequest;
        }
        global.XMLHttpRequest = class {
            hasCalledOpen: boolean;

            open(method, url, async, user, password) {
                this.hasCalledOpen = true;
                expect(method).toEqual(expectedMethod);
                expect(url).toEqual(expectedUrl);
            }

            send(data) {
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
    },

    resetXMLHttpRequest: function () {
        global.XMLHttpRequest = this.backupXMLHttpRequest;
        this.backupXMLHttpRequest = undefined;
    }
};
