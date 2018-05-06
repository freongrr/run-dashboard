// @flow

import React from "react";
import {shallow} from "enzyme";
import {Dashboard} from "../../../main/webapp/components/Dashboard";

describe("Dashboard", () => {

    test("TODO", () => {
        const wrapper = shallow(<Dashboard
            activities={[]}
            isFetching={false}
            fetchActivities={jest.fn()}
            saveActivity={jest.fn()}
            deleteActivity={jest.fn()}
        />);
        expect(wrapper).not.toBeNull();
    });
});

