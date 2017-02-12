// Can't use flow here because I override real types...
/* eslint no-console: ["off"] */
/* eslint no-undef: ["off"] */
/* eslint no-unused-vars: ["off"] */
import {expect} from "chai";

export default {
    defineConsole: function () {
        // The Console class in NodeJS does not have a console.debug(...) method
        console.debug = function (message) {
            // no-op
        };
    },

    mockGET: function (expectedUrl, responseStatus, responseContent) {
        this.mockRequest("GET", expectedUrl, undefined, responseStatus, responseContent);
    },

    mockPOST: function (expectedUrl, expectedData, responseStatus, responseContent) {
        this.mockRequest("POST", expectedUrl, expectedData, responseStatus, responseContent);
    },

    mockRequest: function (expectedMethod, expectedUrl, expectedData, responseStatus, responseContent) {
        global.XMLHttpRequest = class {
            hasCalledOpen: boolean;

            open(method, url, async, user, password) {
                this.hasCalledOpen = true;
                expect(method).to.equal(expectedMethod);
                expect(url).to.equal(expectedUrl);
            }

            send(data) {
                expect(data).to.equal(expectedData);
                expect(this.hasCalledOpen).to.equal(true);
                this.status = responseStatus;
                this.response = responseContent;
                this.readyState = 2;
                this.onreadystatechange({});
                this.readyState = 4;
                this.onreadystatechange({});
            }
        };
    }
};
