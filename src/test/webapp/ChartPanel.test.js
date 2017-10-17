// @flow
import React from "react";
import {shallow} from "enzyme";
import expect from "expect";
import ChartPanel from "../../main/webapp/ChartPanel";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";
import TestUtils from "./TestUtils";

TestUtils.defineConsole();

describe("ChartPanel", () => {

    test("TODO", () => {
        // TODO : mock DataStore instead
        const dataStore = new DataStore(new DummyRPC());

        const route = {
            dataStore: dataStore,
            zoom: "last12Months"
        };

        const wrapper = shallow(<ChartPanel route={route}/>);
        expect(wrapper).not.toBeNull();
    });
});
