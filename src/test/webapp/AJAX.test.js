// @flow
/* global describe, test */
/* eslint no-undef: ["off"] */
import TestUtils from "./TestUtils";
import AJAX from "../../main/webapp/AJAX";

TestUtils.defineConsole();

describe("AJAX", () => {

    const ajax = new AJAX();

    describe("#get()", () => {

        test("returns a plain text as a string", (done) => {
            TestUtils.mockGET("/endpoint", 200, "Plain Text");

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

        test("returns JSON as an object", (done) => {
            TestUtils.mockGET("/endpoint", 200, "{\"foo\":\"bar\"}");

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

        test("returns an error when the server fails", (done) => {
            TestUtils.mockGET("/endpoint", 500, "Boom");

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

        test("returns an error when the server returns bad JSON", (done) => {
            TestUtils.mockGET("/endpoint", 200, "{xxx}");

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

        test("serializes data to JSON", (done) => {
            TestUtils.mockPOST("/endpoint", "{\"foo\":\"bar\"}", 200, "");

            ajax.post("/endpoint", {foo: "bar"})
                .then(() => {
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });

        test("returns a plain text as a string", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 200, "Plain Text");

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

        test("returns JSON as an object", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 200, "{\"foo\":\"bar\"}");

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

        test("returns an error when the server fails (custom code)", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 403, "Unauthorized");

            ajax.post("/endpoint", {})
                .then((result) => {
                    done(new Error("Unexpected result: " + result));
                })
                .catch((e) => {
                    if (e.message.indexOf("Unauthorized") >= 0) {
                        done();
                    } else {
                        done(new Error("Unexpected error: " + e));
                    }
                });
        });

        test("returns an error when the server returns bad JSON", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 200, "{xxx}");

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

    describe("#_delete()", () => {

        test("works", (done) => {
            TestUtils.mockRequest("DELETE", "/endpoint", "{\"foo\":\"bar\"}", 200, "");

            ajax._delete("/endpoint", {foo: "bar"})
                .then(() => {
                    done();
                })
                .catch((e) => {
                    done(e);
                });
        });

        test("fails (e.g. if it can't connect to the server)", (done) => {
            TestUtils.mockRequest("DELETE", "/endpoint", "{\"foo\":\"bar\"}", 0, "");

            ajax._delete("/endpoint", {foo: "bar"})
                .then((result) => {
                    done(new Error("Unexpected result: " + result));
                })
                .catch((e) => {
                    if (e.message.indexOf("Could not connect to the server") >= 0) {
                        done();
                    } else {
                        done(new Error("Unexpected error: " + e));
                    }
                });
        });
    });

    afterEach(() => {
        TestUtils.resetXMLHttpRequest();
    });
});
