// @flow
import TestUtils from "./TestUtils";
import {describe, it} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ActivityDialog from "../../main/webapp/ActivityDialog";

TestUtils.defineConsole();

describe("ActivityDialog", () => {

    const noop = () => {
    };

    const newBuilder = {
        id: null,
        date: "",
        duration: "",
        distance: ""
    };

    const editBuilder = {
        id: "1234",
        date: "2016-12-31",
        duration: "1 hour",
        distance: "12 km"
    };

    it("has a different title for a new activity or an existing one", () => {
        const wrapper1 = shallow(<ActivityDialog initialActivity={newBuilder} onDismiss={noop} onSave={noop}/>);
        expect(wrapper1.find("ModalTitle").childAt(0).text()).to.equal("Add a new activity");

        const wrapper2 = shallow(<ActivityDialog initialActivity={editBuilder} onDismiss={noop} onSave={noop}/>);
        expect(wrapper2.find("ModalTitle").childAt(0).text()).to.equal("Edit an activity");
    });

    it("has empty fields for a new activity", () => {
        const wrapper = shallow(<ActivityDialog initialActivity={newBuilder} onDismiss={noop} onSave={noop}/>);

        expect(wrapper.find("FormGroup").length).to.equal(3);

        expectField(wrapper, 0, "date", "", "error");
        expectField(wrapper, 1, "text", "", "error");
        expectField(wrapper, 2, "text", "", "error");
    });

    it("has populated fields for an existing activity", () => {
        const wrapper = shallow(<ActivityDialog initialActivity={editBuilder} onDismiss={noop} onSave={noop}/>);

        expect(wrapper.find("FormGroup").length).to.equal(3);

        expectField(wrapper, 0, "date", "2016-12-31", "success");
        expectField(wrapper, 1, "text", "1 hour", "success");
        expectField(wrapper, 2, "text", "12 km", "success");
    });

    it("updates the state when editing a field", () => {
        const wrapper = shallow(<ActivityDialog initialActivity={newBuilder} onDismiss={noop} onSave={noop}/>);

        const fieldWrapper = wrapper.find("FormGroup").at(2).find("FormControl");
        fieldWrapper.simulate("change", {target: {value: "5"}});

        expectField(wrapper, 2, "text", "5", "success");
    });

    it("invokes the callback when clicking the Cancel button", (done) => {
        const wrapper = shallow(<ActivityDialog initialActivity={editBuilder}
                                                onDismiss={() => done()}
                                                onSave={() => done(new Error())}/>);

        wrapper.findWhere((w) => w.key() === "dismiss").simulate("click");
    });

    it("does not invoke the callback when clicking the Save button with invalid values", () => {
        let dismissed = false;
        let saved = null;
        const wrapper = shallow(<ActivityDialog initialActivity={newBuilder}
                                                onDismiss={() => {dismissed = true;}}
                                                onSave={(b) => {saved = b;}}/>);

        wrapper.findWhere((w) => w.key() === "save").simulate("click");

        expect(dismissed).to.equal(false);
        expect(saved).to.equal(null);
    });

    it("invokes the callback when clicking the Save button", (done) => {
        const wrapper = shallow(<ActivityDialog initialActivity={editBuilder}
                                                onDismiss={() => done(new Error())}
                                                onSave={(b) => {
                                                    expect(b).to.deep.equal(editBuilder);
                                                    done();
                                                }}/>);

        wrapper.findWhere((w) => w.key() === "save").simulate("click");
    });
});

function expectField(wrapper, fieldIndex, expectedType, expectedValue, expectedState) {
    const groupWrapper = wrapper.find("FormGroup").at(fieldIndex);
    expect(groupWrapper.prop("validationState")).to.equal(expectedState);
    expect(groupWrapper.find("FormControlFeedback").length).to.equal(1);

    const controlWrapper = groupWrapper.find("FormControl");
    expect(controlWrapper.prop("type")).to.equal(expectedType);
    expect(controlWrapper.prop("value")).to.equal(expectedValue);
}
