/* eslint-env mocha */
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ErrorDialog from "../../main/webapp/ErrorDialog";

describe("ErrorDialog", () => {

    it("shows the error message", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")} onDismiss={() => {}}/>);

        expect(wrapper.find("ModalTitle").childAt(0).text()).to.equal("Error");
        expect(wrapper.find("ModalBody").childAt(0).text()).to.equal("This is broken");
    });

    it("is visible by default", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")} onDismiss={() => {}}/>);

        expect(wrapper.find("Modal").prop("show")).to.equal(true);
    });

    it("invokes the callback when clicking the close button", () => {
        let dismissed = false;
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")} onDismiss={() => dismissed = true}/>);
        wrapper.find("Button").simulate("click");

        expect(dismissed).to.equal(true);
    });
});
