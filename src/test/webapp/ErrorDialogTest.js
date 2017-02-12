// @flow
import {describe, it} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ErrorDialog from "../../main/webapp/ErrorDialog";

describe("ErrorDialog", () => {

    it("shows the error message", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")}
                                             onDismiss={() => {}}/>);

        expect(wrapper.find("ModalTitle").childAt(0).text()).to.equal("Error");
        expect(wrapper.find("ModalBody").childAt(0).text()).to.equal("This is broken");
    });

    it("is visible by default", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")}
                                             onDismiss={() => {}}/>);

        expect(wrapper.find("Modal").prop("show")).to.equal(true);
    });

    it("invokes the callback when clicking the close button", (done) => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")}
                                             onDismiss={() => done()}/>);

        wrapper.find("Button").simulate("click");
    });
});
