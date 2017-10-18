// @flow
/* global describe, test */
import React from "react";
import expect from "expect";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";

describe("DataStore", () => {

    test("TODO", () => {
        const rpc = new DummyRPC();

        const dataStore = new DataStore(rpc);
        expect(dataStore).not.toBeNull();
    });
});
