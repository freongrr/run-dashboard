// @flow

import React from "react";
import {shallow} from "enzyme";
import {Dashboard} from "../../../main/webapp/components/Dashboard";

describe("Dashboard", () => {

    test("TODO", () => {
        const wrapper = shallow(<Dashboard activities={[]} isFetching={false} dispatch={jest.fn()}/>);
        expect(wrapper).not.toBeNull();
    });
});

