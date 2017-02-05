/* eslint-env mocha */
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ChartPanel from "../../main/webapp/ChartPanel";

describe("ChartPanel", () => {

    it("TODO", () => {
        const route = {
            dataStore: {},
            zoom: "last12Months"
        };

        const wrapper = shallow(<ChartPanel route={route}/>);
        expect(wrapper).not.to.equal(null);
    });
});
