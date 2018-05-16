// @flow

import React from "react";
import {shallow} from "enzyme";
import ActivityForm from "../../../main/es/components/ActivityForm";
import type {ActivityBuilder, AttributeType} from "../../../main/es/types/Types";
import * as ActivityBuilderValidator from "../../../main/es/data/ActivityBuilderValidator";

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
        temperature: "12"
    }
};

const attributeTypes: AttributeType[] = [{
    id: "city",
    label: "City",
    type: "string",
    output: false
}, {
    id: "temperature",
    label: "Temperature",
    type: "number",
    output: false
}];


test("has has date field", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    const dateField = findField(wrapper, "DateField", "activity_date");
    expect(dateField.prop("label")).toEqual("Date");
    expect(dateField.prop("onChange")).toBeTruthy();
    expect(dateField.prop("validator")).toEqual(ActivityBuilderValidator.hasValidDate);
});

test("has a duration field", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    const durationField = findField(wrapper, "TextField", "activity_duration");
    expect(durationField.prop("label")).toEqual("Duration");
    expect(durationField.prop("onChange")).toBeTruthy();
    expect(durationField.prop("validator")).toEqual(ActivityBuilderValidator.hasValidDuration);
});

test("has a distance field", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    const distanceField = findField(wrapper, "TextField", "activity_distance");
    expect(distanceField.prop("label")).toEqual("Distance");
    expect(distanceField.prop("onChange")).toBeTruthy();
    expect(distanceField.prop("validator")).toEqual(ActivityBuilderValidator.hasValidDistance);
});

test("has empty fields for a new activity", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    const dateField = findField(wrapper, "DateField", "activity_date");
    expect(dateField.prop("value")).toEqual("");

    const durationField = findField(wrapper, "TextField", "activity_duration");
    expect(durationField.prop("value")).toEqual("");

    const distanceField = findField(wrapper, "TextField", "activity_distance");
    expect(distanceField.prop("value")).toEqual("");
});

test("has populated fields for an existing activity", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={editBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    const dateField = findField(wrapper, "DateField", "activity_date");
    expect(dateField.prop("value")).toEqual("2016-12-31");

    const durationField = findField(wrapper, "TextField", "activity_duration");
    expect(durationField.prop("value")).toEqual("1 hour");

    const distanceField = findField(wrapper, "TextField", "activity_distance");
    expect(distanceField.prop("value")).toEqual("12 km");
});

test("has fields for extra properties", () => {
    const wrapper = shallow(<ActivityForm attributeTypes={attributeTypes} activityBuilder={editBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={jest.fn()}/>);

    const cityField = findField(wrapper, "TextField", "activity_city");
    expect(cityField.prop("value")).toEqual("Tokyo");

    const temperatureField = findField(wrapper, "NumberField", "activity_temperature");
    expect(temperatureField.prop("value")).toEqual("12");
});

test("fires an update when the date field changes", () => {
    const onMainFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={onMainFieldChange} onAttributeFieldChange={jest.fn()}/>);

    const dateField = findField(wrapper, "DateField", "activity_date");
    dateField.simulate("change", {target: {value: "2018-07-01"}});

    expect(onMainFieldChange).toHaveBeenCalledWith("date", "2018-07-01");
});

test("fires an update when the duration field changes", () => {
    const onMainFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={onMainFieldChange} onAttributeFieldChange={jest.fn()}/>);

    const durationField = findField(wrapper, "TextField", "activity_duration");
    durationField.simulate("change", {target: {value: "45 min"}});

    expect(onMainFieldChange).toHaveBeenCalledWith("duration", "45 min");
});

test("fires an update when the distance field changes", () => {
    const onMainFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={[]} activityBuilder={newBuilder}
        onMainFieldChange={onMainFieldChange} onAttributeFieldChange={jest.fn()}/>);

    const distanceField = findField(wrapper, "TextField", "activity_distance");
    distanceField.simulate("change", {target: {value: "20 km"}});

    expect(onMainFieldChange).toHaveBeenCalledWith("distance", "20 km");
});

test("fires an update when one of the extra attribute field changes", () => {
    const onAttributeFieldChange = jest.fn();
    const wrapper = shallow(<ActivityForm attributeTypes={attributeTypes} activityBuilder={newBuilder}
        onMainFieldChange={jest.fn()} onAttributeFieldChange={onAttributeFieldChange}/>);

    const cityField = findField(wrapper, "TextField", "activity_city");
    cityField.simulate("change", {target: {value: "London"}});

    expect(onAttributeFieldChange).toHaveBeenCalledWith(attributeTypes[0], "London");
});

function findField(wrapper, component: string, id: string) {
    return wrapper.find(component + "[id=\"" + id + "\"]");
}
