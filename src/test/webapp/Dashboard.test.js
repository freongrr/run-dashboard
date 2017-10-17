// @flow
import TestUtils from "./TestUtils";
import React from "react";
import {shallow} from "enzyme";
import expect from "expect";
import Dashboard from "../../main/webapp/Dashboard";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";

TestUtils.defineConsole();

describe("Dashboard", () => {

    // TODO : mock DataStore instead
    const dataStore = new DataStore(new DummyRPC());

    test("TODO", () => {
        const wrapper = shallow(<Dashboard route={{dataStore: dataStore}} chart={ChartTest}/>);
        expect(wrapper).not.toBeNull();
    });
});

function ChartTest() {
    return <div></div>;
}
