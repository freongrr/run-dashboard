// @flow

import * as TestUtils from "./MockXMLHttpRequest";
import RPC from "../../../main/es/utils/RPC";

describe("RPC", () => {

    const rpc = new RPC();

    describe("#get()", () => {

        test("returns a plain text as a string", (done) => {
            TestUtils.mockGET("/endpoint", 200, "Plain Text");

            rpc.get("/endpoint")
                .then((result) => {
                    expect(result).toEqual("Plain Text");
                    done();
                });
        });

        test("returns JSON as an object", (done) => {
            TestUtils.mockGET("/endpoint", 200, "{\"foo\":\"bar\"}");

            rpc.get("/endpoint")
                .then((result) => {
                    if (typeof result === "object" && result["foo"] === "bar") {
                        done();
                    }
                });
        });

        test("returns an error when the server fails", (done) => {
            TestUtils.mockGET("/endpoint", 500, "Boom");

            rpc.get("/endpoint")
                .then((result) => {
                    throw new Error("Unexpected result: " + result);
                })
                .catch((e) => {
                    if (e.message.indexOf("Internal Server Error") >= 0) {
                        done();
                    } else {
                        throw new Error("Unexpected error: " + e);
                    }
                });
        });

        test("returns an error when the server returns bad JSON", (done) => {
            TestUtils.mockGET("/endpoint", 200, "{xxx}");

            rpc.get("/endpoint")
                .then((result) => {
                    throw new Error("Unexpected result: " + result);
                })
                .catch((e) => {
                    expect(e.message).toContain("Unexpected token x in JSON at position 1");
                    done();
                });
        });
    });

    describe("#post()", () => {

        test("serializes data to JSON", (done) => {
            TestUtils.mockPOST("/endpoint", "{\"foo\":\"bar\"}", 200, "");

            rpc.post("/endpoint", {foo: "bar"})
                .then(() => {
                    done();
                });
        });

        test("returns a plain text as a string", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 200, "Plain Text");

            rpc.post("/endpoint", {})
                .then((result) => {
                    expect(result).toEqual("Plain Text");
                    done();
                });
        });

        test("returns JSON as an object", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 200, "{\"foo\":\"bar\"}");

            rpc.post("/endpoint", {})
                .then((result) => {
                    if (typeof result === "object" && result["foo"] === "bar") {
                        done();
                    } else {
                        throw new Error("Unexpected result: " + result);
                    }
                });
        });

        test("returns an error when the server fails (custom code)", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 403, "Unauthorized");

            rpc.post("/endpoint", {})
                .then((result) => {
                    throw new Error("Unexpected result: " + result);
                })
                .catch((e) => {
                    expect(e.message).toContain("Unauthorized");
                    done();
                });
        });

        test("returns an error when the server returns bad JSON", (done) => {
            TestUtils.mockPOST("/endpoint", "{}", 200, "{xxx}");

            rpc.post("/endpoint", {})
                .then((result) => {
                    throw new Error("Unexpected result: " + result);
                })
                .catch((e) => {
                    expect(e.message).toContain("Unexpected token x in JSON at position 1");
                    done();
                });
        });
    });

    describe("#_delete()", () => {

        test("works", (done) => {
            TestUtils.mockDELETE("/endpoint", "{\"foo\":\"bar\"}", 200, "");

            rpc._delete("/endpoint", {foo: "bar"})
                .then(() => {
                    done();
                });
        });

        test("fails (e.g. if it can't connect to the server)", (done) => {
            TestUtils.mockDELETE("/endpoint", "{\"foo\":\"bar\"}", 0, "");

            rpc._delete("/endpoint", {foo: "bar"})
                .then((result) => {
                    throw new Error("Unexpected result: " + result);
                })
                .catch((e) => {
                    expect(e.message).toContain("Could not connect to the server");
                    done();
                });
        });
    });

    afterEach(() => {
        TestUtils.resetXMLHttpRequest();
    });
});
