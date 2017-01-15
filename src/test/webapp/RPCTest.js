/* eslint-env mocha */
import RPC from "../../main/webapp/RPC";

describe("RPC", () => {

    const makeSuccessCallback = (done) => {
        return (result) => {
            done(new Error("Unexpected result: " + result));
        };
    };

    const makeErrorCallback = (done) => {
        return (e) => {
            if (e.message.indexOf("Not implemented") >= 0) {
                done();
            } else {
                done(new Error("Unexpected error: " + e));
            }
        };
    };

    it("#get() fails because it's not implemented", (done) => {
        const rpc = new RPC();
        rpc.get("/foo")
            .then(makeSuccessCallback(done))
            .catch(makeErrorCallback(done));
    });

    it("#post() fails because it's not implemented", (done) => {
        const rpc = new RPC();
        rpc.post("/foo", {})
            .then(makeSuccessCallback(done))
            .catch(makeErrorCallback(done));
    });

    it("#_delete() fails because it's not implemented", (done) => {
        const rpc = new RPC();
        rpc._delete("/foo", {})
            .then(makeSuccessCallback(done))
            .catch(makeErrorCallback(done));
    });
});

