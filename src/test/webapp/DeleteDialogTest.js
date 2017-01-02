/* eslint-env mocha */
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

    it("invokes the callback when clicking the Close button", () => {
        let dismissed = false;
        let confirmed = false;
        const wrapper = shallow(<DeleteDialog activity={activity}
                                              onDismiss={() => {dismissed = true;}}
                                              onConfirm={() => {confirmed = true;}}/>);

        findByKey(wrapper, "dismiss").simulate("click");

        expect(dismissed).to.equal(true);
        expect(confirmed).to.equal(false);
    });

    it("invokes the callback when clicking the Delete button", () => {
        let dismissed = false;
        let confirmed = false;
        const wrapper = shallow(<DeleteDialog activity={activity}
                                              onDismiss={() => {dismissed = true;}}
                                              onConfirm={() => {confirmed = true;}}/>);

        findByKey(wrapper, "delete").simulate("click");

        expect(dismissed).to.equal(false);
        expect(confirmed).to.equal(true);
    });
});

function findByKey(wrapper, key) {
    return wrapper.findWhere((w) => w.key() === key);
}