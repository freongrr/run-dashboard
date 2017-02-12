// @flow
import {describe, it} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import DeleteDialog from "../../main/webapp/DeleteDialog";

describe("ErrorDialog", () => {

    const activity = {
        id: "123",
        date: "2016-12-31",
        duration: 2700,
        distance: 10500
    };

    it("shows the activity that is about to be deleted", () => {
        const wrapper = shallow(<DeleteDialog activity={activity} onDismiss={() => {}} onConfirm={() => {}}/>);

        expect(wrapper.find("ModalTitle").childAt(0).text()).to.equal("Delete");
        expect(wrapper.find("ModalBody").childAt(0).text()).to.equal("You are about to delete this activity:");

        const listWrapper = wrapper.find("ModalBody").find("ul");
        expect(listWrapper.text()).to.include("Date: 2016-12-31");
        expect(listWrapper.text()).to.include("Duration: 45 min");
        expect(listWrapper.text()).to.include("Distance: 10.5 km");
    });

    it("invokes the callback when clicking the Close button", (done) => {
        const wrapper = shallow(<DeleteDialog activity={activity}
                                              onDismiss={() => done()}
                                              onConfirm={() => done(new Error("This should not be called"))}/>);

        findByKey(wrapper, "dismiss").simulate("click");
    });

    it("invokes the callback when clicking the Delete button", (done) => {
        const wrapper = shallow(<DeleteDialog activity={activity}
                                              onDismiss={() => done(new Error("This should not be called"))}
                                              onConfirm={() => done()}/>);

        findByKey(wrapper, "delete").simulate("click");
    });
});

function findByKey(wrapper, key) {
    return wrapper.findWhere((w) => w.key() === key);
}
