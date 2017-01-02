/* eslint-env mocha */
/* eslint no-console: ["off"] */
/* eslint no-undef: ["off"] */
import {expect} from "chai";
import AJAX from "../../main/webapp/AJAX";

// The Console class in NodeJS does not have a console.debug(...) method
console.debug = function () {
};

describe("AJAX", () => {

    const ajax = new AJAX();

    describe("#get()", () => {

        it("returns a plain text as a string", (done) => {
            mockGET("/endpoint", 200, "Plain Text");

            ajax.get("/endpoint")
                .then((result) => {
                    if (result === "Plain Text") {
                        done();
                    } else {
                        done(new Error("Unexpected result: " + result));
                    }
                })
                .catch((e) => {
                    done(e);
                });
        });

        it("returns JSON as an object", (done) => {
            mockGET("/endpoint", 200, "{\"foo\":\"bar\"}");

            ajax.get("/endpoint")
                .then((result) => {
                    if (typeof result === "object" && result["foo"] === "bar") {
                        done();
                    } else {
                        done(new Error("Unexpected result: " + result));
                    }
                })
                .catch((e) => {
                    done(e);
                });
        });

        it("returns an error when the server fails", (done) => {
            mockGET("/endpoint", 500, "Boom");

            ajax.get("/endpoint")
                .then((result) => {
                    done(new Error("Unexpected result: " + result));
                })
                .catch((e) => {
                    if (e.message.indexOf("Internal Server Error") >= 0) {
                        done();
                    } else {
                        done(new Error("Unexpected error: " + e));
                    }
                });
        });

        it("returns an error when the server returns bad JSON", (done) => {
            mockGET("/endpoint", 200, "{xxx}");

            ajax.get("/endpoint")
                .then((result) => {
                    done(new Error("Unexpected result: " + result));
                })
                .catch((e) => {
                    if (e.message.indexOf("Unexpected token x in JSON at position 1") >= 0) {
                        done();
                    } else {
                        done(new Error("Unexpected error: " + e));
                    }
                });
        });
    });

    describe("#post()", () => {

        it("serializes data to JSON", (done) => {
            mockPOST("/endpoint", "{\"foo\":\"bar\"}", 200, "");

            ajax.post("/endpoint", {foo: "bar"})
                .then(() => {
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });

        it("returns a plain text as a string", (done) => {
            mockPOST("/endpoint", "{}", 200, "Plain Text");

            ajax.post("/endpoint", {})
                .then((result) => {
                    if (result === "Plain Text") {
                        done();
                    } else {
                        done(new Error("Unexpected result: " + result));
                    }
                })
                .catch((e) => {
                    done(e);
                });
        });

        it("returns JSON as an object", (done) => {
            mockPOST("/endpoint", "{}", 200, "{\"foo\":\"bar\"}");

            ajax.post("/endpoint", {})
                .then((result) => {
                    if (typeof result === "object" && result["foo"] === "bar") {
                        done();
                    } else {
                        done(new Error("Unexpected result: " + result));
                    }
                })
                .catch((e) => {
                    done(e);
                });
        });

        it("returns an error when the server fails", (done) => {
            mockPOST("/endpoint", "{}", 500, "Boom");

            ajax.post("/endpoint", {})
                .then((result) => {
                    done(new Error("Unexpected result: " + result));
                })
                .catch((e) => {
                    if (e.message.indexOf("Internal Server Error") >= 0) {
                        done();
                    } else {
                        done(new Error("Unexpected error: " + e));
                    }
                });
        });

        it("returns an error when the server returns bad JSON", (done) => {
            mockPOST("/endpoint", "{}", 200, "{xxx}");

            ajax.post("/endpoint", {})
                .then((result) => {
                    done(new Error("Unexpected result: " + result));
                })
                .catch((e) => {
                    if (e.message.indexOf("Unexpected token x in JSON at position 1") >= 0) {
                        done();
                    } else {
                        done(new Error("Unexpected error: " + e));
                    }
                });
        });
    });

    afterEach(() => {
        global.XMLHttpRequest = undefined;
    });
});

function mockGET(expectedUrl, responseStatus, responseContent) {
    global.XMLHttpRequest = class {

        open(method, url) {
            this.hasCalledOpen = true;
            expect(method).to.equal("GET");
            expect(url).to.equal(expectedUrl);
        }

        send(data) {
            expect(data).to.equal(undefined);
            expect(this.hasCalledOpen).to.equal(true);
            this.status = responseStatus;
            this.response = responseContent;
            this.readyState = 2;
            this.onreadystatechange();
            this.readyState = 4;
            this.onreadystatechange();
        }
    };
}

function mockPOST(expectedUrl, expectedData, responseStatus, responseContent) {
    global.XMLHttpRequest = class {

        open(method, url) {
            this.hasCalledOpen = true;
            expect(method).to.equal("POST");
            expect(url).to.equal(expectedUrl);
        }

        send(data) {
            expect(data).to.equal(expectedData);
            expect(this.hasCalledOpen).to.equal(true);
            this.status = responseStatus;
            this.response = responseContent;
            this.readyState = 2;
            this.onreadystatechange();
            this.readyState = 4;
            this.onreadystatechange();
        }
    };
}
