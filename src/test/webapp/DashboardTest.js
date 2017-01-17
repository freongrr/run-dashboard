/* eslint-env mocha */
/* eslint no-console: ["off"] */
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import Dashboard from "../../main/webapp/Dashboard";

// The Console class in NodeJS does not have a console.debug(...) method
console.debug = function () {
};

describe("Dashboard", () => {

    // TODO
    const rpc = {};

    it("TODO", () => {
        const wrapper = shallow(<Dashboard route={{rpc: rpc}} chart={ChartTest}/>);
        expect(wrapper).not.to.equal(null);
    });
});

function ChartTest() {
    return <div></div>;
}
