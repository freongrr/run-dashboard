// @flow
/* global describe, test */
import React from "react";
import {shallow} from "enzyme";
import expect from "expect";
import DeleteDialog from "../../main/webapp/DeleteDialog";

describe("ErrorDialog", () => {

    const activity = {
        id: "123",
        date: "2016-12-31",
        duration: 2700,
        distance: 10500
    };

    test("shows the activity that is about to be deleted", () => {
        const wrapper = shallow(<DeleteDialog activity={activity}
            onDismiss={() => {}}
            onConfirm={() => {}}/>);

        expect(wrapper.find("ModalTitle").childAt(0).text()).toEqual("Delete");
        expect(wrapper.find("ModalBody").childAt(0).text()).toEqual("You are about to delete this activity:");

        const listWrapper = wrapper.find("ModalBody").find("ul");
        expect(listWrapper.text()).toContain("Date: 2016-12-31");
        expect(listWrapper.text()).toContain("Duration: 45 min");
        expect(listWrapper.text()).toContain("Distance: 10.5 km");
    });

    test("invokes the callback when clicking the Close button", (done) => {
        const wrapper = shallow(<DeleteDialog activity={activity}
            onDismiss={() => done()}
            onConfirm={() => done(new Error("This should not be called"))}/>);

        findByKey(wrapper, "dismiss").simulate("click");
    });

    test("invokes the callback when clicking the Delete button", (done) => {
        const wrapper = shallow(<DeleteDialog activity={activity}
            onDismiss={() => done(new Error("This should not be called"))}
            onConfirm={() => done()}/>);

        findByKey(wrapper, "delete").simulate("click");
    });
});

function findByKey(wrapper, key) {
    return wrapper.findWhere((w) => w.key() === key);
}
