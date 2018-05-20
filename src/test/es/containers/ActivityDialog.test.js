// @flow

import React from "react";
import {shallow} from "enzyme";
import {ActivityDialog} from "../../../main/es/containers/ActivityDialog";
import type {ActivityBuilder} from "../../../main/es/types/Types";

const throwingCallback = () => {
    throw new Error();
};

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

test("has a different title for a new activity or an existing one", () => {
    const wrapper1 = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={newBuilder}
        onDismiss={jest.fn()} onSave={jest.fn()}/>);
    expect(wrapper1.find("ModalTitle").childAt(0).text()).toEqual("Add a new activity");

    const wrapper2 = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={editBuilder}
        onDismiss={jest.fn()} onSave={jest.fn()}/>);
    expect(wrapper2.find("ModalTitle").childAt(0).text()).toEqual("Edit an activity");
});

test("updates the state when the value of a field changes", () => {
    const wrapper = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={newBuilder}
        onDismiss={jest.fn()} onSave={jest.fn()}/>);

    const fieldChangeHandler = wrapper.find("ActivityForm").prop("onMainFieldChange");
    fieldChangeHandler("distance", "12km");

    wrapper.update();
    const builder: ActivityBuilder = wrapper.state("builder");
    expect(builder.distance).toEqual("12km");
});

test("updates the state when the value of an extra attribute field changes", () => {
    const wrapper = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={newBuilder}
        onDismiss={jest.fn()} onSave={jest.fn()}/>);

    const fieldChangeHandler = wrapper.find("ActivityForm").prop("onAttributeFieldChange");
    const attributeType = {id: "city", label: "City"};
    fieldChangeHandler(attributeType, "Tokyo");

    wrapper.update();
    const builder: ActivityBuilder = wrapper.state("builder");
    expect(builder.attributes["city"]).toEqual("Tokyo");
});

test("invokes the callback when clicking the Cancel button", (done) => {
    const wrapper = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={editBuilder}
        onDismiss={() => done()}
        onSave={throwingCallback}/>);

    wrapper.findWhere((w) => w.key() === "dismiss").simulate("click");
});

test("does not invoke the callback when clicking the Save button with invalid values", () => {
    let dismissed = false;
    let saved = null;
    const wrapper = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={newBuilder}
        onDismiss={() => {
            dismissed = true;
        }}
        onSave={(b) => {
            saved = b;
        }}/>);

    wrapper.findWhere((w) => w.key() === "save").simulate("click");

    expect(dismissed).toEqual(false);
    expect(saved).toBeNull();
});

test("invokes the callback when clicking the Save button", (done) => {
    const wrapper = shallow(<ActivityDialog attributeTypes={[]} activityBuilder={editBuilder}
        onDismiss={throwingCallback}
        onSave={(b) => {
            expect(b).toEqual(editBuilder);
            done();
        }}/>);

    wrapper.findWhere((w) => w.key() === "save").simulate("click");
});
