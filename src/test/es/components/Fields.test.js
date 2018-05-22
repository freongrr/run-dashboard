//@flow

import React from "react";
import {shallow} from "enzyme";
import {DateField, NumberField, TextField} from "../../../main/es/components/Fields";

describe("DateField", () => {

    test("has a label", () => {
        const wrapper = shallow(<DateField id="test" label="The date" value="" onChange={jest.fn()}
            validator={() => false}/>);
        expect(wrapper.find("ControlLabel").dive().text()).toEqual("The date");
    });

    test("is flagged as valid by default", () => {
        const wrapper = shallow(<DateField id="test" label="The date" value="" onChange={jest.fn()}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("success");
    });

    // TODO
    // test("is flagged as invalid when value is not a date", () => {
    //     const wrapper = shallow(<DateField id="test" label="The date" value="foo" onChange={jest.fn()}/>);
    //     expect(wrapper.find("FormGroup").prop("validationState")).toEqual("error");
    // });

    test("is flagged as invalid when validator returns false", () => {
        const wrapper = shallow(<DateField id="test" label="The date" value="" onChange={jest.fn()}
            validator={() => false}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("error");
    });

    test("invokes onChange handler when control value changes", () => {
        const event = {target: {value: "new value"}};
        const onChange = jest.fn();
        const wrapper = shallow(<DateField id="test" label="Date" value="" onChange={onChange}/>);
        wrapper.find("FormControl").simulate("change", event);
        expect(onChange).toHaveBeenCalledWith(event);
    });
});

describe("NumberField", () => {

    test("has a label", () => {
        const wrapper = shallow(<NumberField id="test" label="The number" value="" onChange={jest.fn()}
            validator={() => false}/>);
        expect(wrapper.find("ControlLabel").dive().text()).toEqual("The number");
    });

    test("is flagged as valid by default", () => {
        const wrapper = shallow(<NumberField id="test" label="The number" value="" onChange={jest.fn()}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("success");
    });

    test("is flagged as invalid when value is not a number", () => {
        const wrapper = shallow(<NumberField id="test" label="The number" value="foo" onChange={jest.fn()}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("error");
    });

    test("is flagged as invalid when validator returns false", () => {
        const wrapper = shallow(<NumberField id="test" label="The number" value="" onChange={jest.fn()}
            validator={() => false}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("error");
    });

    test("invokes onChange handler when control value changes", () => {
        const event = {target: {value: "new value"}};
        const onChange = jest.fn();
        const wrapper = shallow(<NumberField id="test" label="The number" value="" onChange={onChange}/>);
        wrapper.find("FormControl").simulate("change", event);
        expect(onChange).toHaveBeenCalledWith(event);
    });
});

describe("TextField", () => {

    test("has a label", () => {
        const wrapper = shallow(<TextField id="test" label="The text" value="" onChange={jest.fn()}
            validator={() => false}/>);
        expect(wrapper.find("ControlLabel").dive().text()).toEqual("The text");
    });

    test("is flagged as valid by default", () => {
        const wrapper = shallow(<TextField id="test" label="The text" value="" onChange={jest.fn()}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("success");
    });

    test("is flagged as invalid when validator returns false", () => {
        const wrapper = shallow(<TextField id="test" label="The text" value="" onChange={jest.fn()}
            validator={() => false}/>);
        expect(wrapper.find("FormGroup").prop("validationState")).toEqual("error");
    });

    test("invokes onChange handler when control value changes", () => {
        const event = {target: {value: "new value"}};
        const onChange = jest.fn();
        const wrapper = shallow(<TextField id="test" label="The text" value="" onChange={onChange}/>);
        wrapper.find("FormControl").simulate("change", event);
        expect(onChange).toHaveBeenCalledWith(event);
    });
});
