// @flow

import React from "react";
import {shallow} from "enzyme";
import ErrorDialog from "../../main/webapp/ErrorDialog";

describe("ErrorDialog", () => {

    test("shows the error message", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")} onDismiss={() => {}}/>);

        expect(wrapper.find("ModalTitle").childAt(0).text()).toEqual("Error");
        expect(wrapper.find("ModalBody").childAt(0).text()).toEqual("This is broken");
    });

    test("is visible by default", () => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")} onDismiss={() => {}}/>);

        expect(wrapper.find("Modal").prop("show")).toEqual(true);
    });

    test("invokes the callback when clicking the close button", (done) => {
        const wrapper = shallow(<ErrorDialog error={new Error("This is broken")} onDismiss={() => done()}/>);

        wrapper.find("Button").simulate("click");
    });
});
