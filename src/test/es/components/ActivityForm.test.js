// @flow

import React from "react";
import {shallow} from "enzyme";
import ActivityForm from "../../../main/es/components/ActivityForm";
import type {ActivityBuilder, AttributeType} from "../../../main/es/types/Types";

const newBuilder: ActivityBuilder = {
    id: null,
    date: "",
    duration: "",
    distance: "",
    attributes: {}
};

const editBuilder: ActivityBuilder = {
    id: "1234",
    date: "2016-12-31",
    duration: "1 hour",
    distance: "12 km",
    attributes: {
        city: "Tokyo",
        whether: "Sunny"
    }
};

const attributeTypes: AttributeType[] = [{
    id: "city",
    label: "City"
}, {
    id: "whether",
    label: "Whether"
}];

test("has empty fields for a new activity", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    expect(wrapper.find("FormGroup")).toHaveLength(3);

    expectField(wrapper, "activity_date", "date", "", "error");
    expectField(wrapper, "activity_duration", "text", "", "error");
    expectField(wrapper, "activity_distance", "text", "", "error");
});

test("has populated fields for an existing activity", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={editBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    expect(wrapper.find("FormGroup")).toHaveLength(3);

    expectField(wrapper, "activity_date", "date", "2016-12-31", "success");
    expectField(wrapper, "activity_duration", "text", "1 hour", "success");
    expectField(wrapper, "activity_distance", "text", "12 km", "success");
});

test("has fields for extra properties", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={attributeTypes} activityBuilder={editBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    expectField(wrapper, "activity_city", "text", "Tokyo", "success");
    expectField(wrapper, "activity_whether", "text", "Sunny", "success");
});

test("fires an update when the date field changes", () => {
    const onMainFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={onMainFieldChange} onAttributeFieldChange={jest.fn()}/>);

    const fieldWrapper = getFormControl(wrapper, "activity_date");
    fieldWrapper.simulate("change", {target: {value: "2018-07-01"}});

    expect(onMainFieldChange).toHaveBeenCalledWith("date", "2018-07-01");
});

test("fires an update when the duration field changes", () => {
    const onMainFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={onMainFieldChange} onAttributeFieldChange={jest.fn()}/>);

    const fieldWrapper = getFormControl(wrapper, "activity_duration");
    fieldWrapper.simulate("change", {target: {value: "45 min"}});

    expect(onMainFieldChange).toHaveBeenCalledWith("duration", "45 min");
});

test("fires an update when the distance field changes", () => {
    const onMainFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={onMainFieldChange} onAttributeFieldChange={jest.fn()}/>);

    const fieldWrapper = getFormControl(wrapper, "activity_duration");
    fieldWrapper.simulate("change", {target: {value: "45 min"}});

    expect(onMainFieldChange).toHaveBeenCalledWith("duration", "45 min");
});

test("fires an update when one of the extra property field changes", () => {
    const onAttributeFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={attributeTypes} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={onAttributeFieldChange}/>);

    const fieldWrapper = getFormControl(wrapper, "activity_city");
    fieldWrapper.simulate("change", {target: {value: "London"}});

    expect(onAttributeFieldChange).toHaveBeenCalledWith(attributeTypes[0], "London");
});

function expectField(wrapper, id: string, expectedType: string, expectedValue: string, expectedState: string) {
    const groupWrapper = getFormGroup(wrapper, id);
    expect(groupWrapper.prop("validationState")).toEqual(expectedState);
    expect(groupWrapper.find("FormControlFeedback")).toHaveLength(1);

    const controlWrapper = groupWrapper.find("FormControl");
    expect(controlWrapper.prop("type")).toEqual(expectedType);
    expect(controlWrapper.prop("value")).toEqual(expectedValue);
}

function getFormControl(wrapper, id: string) {
    return getFormGroup(wrapper, id).find("FormControl");
}

function getFormGroup(wrapper, id: string) {
    return wrapper.find("FormGroup[controlId=\"" + id + "\"]");
}
