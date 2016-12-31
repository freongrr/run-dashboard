/* eslint-env mocha */
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ErrorDialog from "../../main/webapp/ErrorDialog";

describe("ErrorDialog", () => {

    it("shows the error message", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")}/>);

        expect(wrapper.find("ModalTitle").childAt(0).text()).to.equal("Error");
        expect(wrapper.find("ModalBody").childAt(0).text()).to.equal("This is broken");
    });

    it("is visible by default", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")}/>);

        expect(wrapper.state("visible")).to.equal(true);
        expect(wrapper.find("Modal").prop("show")).to.equal(true);
    });

    it("is not visible after clicking the close button", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")}/>);
        wrapper.find("Button").simulate("click");

        expect(wrapper.state("visible")).to.equal(false);
        expect(wrapper.find("Modal").prop("show")).to.equal(false);
    });
});
