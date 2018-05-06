// @flow

import React from "react";
import {shallow} from "enzyme";
import ChartPanel from "../../main/webapp/ChartPanel";
import DataStore from "../../main/webapp/DataStore";
import DummyRPC from "../../main/webapp/DummyRPC";

describe("ChartPanel", () => {

    test("TODO", () => {
        // TODO : mock DataStore instead
        const dataStore = new DataStore(new DummyRPC());

        const wrapper = shallow(<ChartPanel dataStore={dataStore} zoom={"last12Months"}/>);
        expect(wrapper).not.toBeNull();
    });
});
