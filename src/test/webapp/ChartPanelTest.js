// @flow
import {describe, it} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ChartPanel from "../../main/webapp/ChartPanel";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";

describe("ChartPanel", () => {

    it("TODO", () => {
        // TODO : mock DataStore instead
        const dataStore = new DataStore(new DummyRPC());

        const route = {
            dataStore: dataStore,
            zoom: "last12Months"
        };

        const wrapper = shallow(<ChartPanel route={route}/>);
        expect(wrapper).not.to.equal(null);
    });
});
