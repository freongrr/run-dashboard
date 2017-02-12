// @flow
import TestUtils from "./TestUtils";
import {describe, it} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import Dashboard from "../../main/webapp/Dashboard";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";

TestUtils.defineConsole();

describe("Dashboard", () => {

    // TODO : mock DataStore instead
    const dataStore = new DataStore(new DummyRPC());

    it("TODO", () => {
        const wrapper = shallow(<Dashboard route={{dataStore: dataStore}} chart={ChartTest}/>);
        expect(wrapper).not.to.equal(null);
    });
});

function ChartTest() {
    return <div></div>;
}
