// @flow

import React from "react";
import {shallow} from "enzyme";
import {Dashboard} from "../../../main/es/containers/Dashboard";

test("invokes fetchActivities when mounted", () => {
    const fetchActivities = jest.fn();
    shallow(<Dashboard activities={[]} fetchActivities={fetchActivities}/>);

    expect(fetchActivities).toHaveBeenCalled();
});

test("contains a ActivityTable", () => {
    const wrapper = shallow(<Dashboard activities={[]} fetchActivities={jest.fn()}/>);

    const activityTable = wrapper.find("ActivityTable");
    expect(activityTable).toHaveLength(1);
    expect(activityTable.prop("activities")).toEqual([]);
});
