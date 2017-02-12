// @flow
import {describe, it} from "mocha";
import {expect} from "chai";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";

describe("DataStore", () => {

    it("TODO", () => {
        const rpc = new DummyRPC();

        const dataStore = new DataStore(rpc);
        expect(dataStore).not.to.equal(null);
    });
});
