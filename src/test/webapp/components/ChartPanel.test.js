// @flow

import React from "react";
import {shallow} from "enzyme";
import ChartPanel from "../../../main/webapp/components/ChartPanel";

describe("ChartPanel", () => {

    test("TODO", () => {
        const wrapper = shallow(<ChartPanel zoom={"last12Months"}/>);
        expect(wrapper).not.toBeNull();
    });
});
