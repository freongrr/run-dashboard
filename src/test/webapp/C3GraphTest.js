// @flow
/* eslint no-undef: ["off"] */
import {describe, it, afterEach} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import type {GraphBuilder} from "../../main/webapp/Types";
import C3Graph from "../../main/webapp/C3Graph";

describe("C3Graph", () => {

    it("renders an empty placeholder for the graph", () => {
        const builder: GraphBuilder = {
            type: "line",
            time: true,
            x: {
                name: "date",
                format: (n: number) => n.toString(),
            },
            series: []
        };

        const wrapper = shallow(<C3Graph id="testGraph" builder={builder} rows={[]}/>);
        expect(wrapper.find("#testGraph")).to.have.length(1);
    });

    it("generates a C3.js graph", () => {
        // TODO : we need to test categories, time series, etc

        const builder = {
            type: "bar",
            time: false,
            x: {
                name: "N",
                format: (n: number) => n.toString(),
            },
            series: [{
                name: "N * 2",
                format: (n: number) => `N * 2 = ${n}`,
                secondY: false
            }, {
                name: "N * 3",
                format: (n: number) => `N * 3 = ${n}`,
                secondY: true
            }]
        };

        const rows = [
            ["1", 2, 3],
            ["2", 4, 6],
            ["3", 6, 9]
        ];

        global.window = {
            c3: {
                generate: function (g) {
                    expect(g.bindto).to.equal("#testGraph");

                    expect(g.data.type).to.equal("bar");
                    expect(g.data.x).to.equal("x"); // auto generated

                    expect(g.data.rows).to.have.length(4);
                    expect(g.data.rows[0]).to.eql(["x", "series_1", "series_2"]); // auto generated
                    expect(g.data.rows[1]).to.eql(["1", 2, 3]);
                    expect(g.data.rows[2]).to.eql(["2", 4, 6]);
                    expect(g.data.rows[3]).to.eql(["3", 6, 9]);
                    expect(g.data.keys.x).to.equal("x");
                    expect(g.data.keys.value).to.eql(["series_1", "series_2"]);
                    expect(g.data.axes).to.eql({"series_1": "y", "series_2": "y2"});
                    expect(g.data.names).to.eql({"series_1": "N * 2", "series_2": "N * 3"});

                    expect(g.axis.x.type).to.equal("category");
                    expect(g.axis.y.type).not.to.equal(null);
                    expect(g.axis.y2.type).not.to.equal(null);

                    expect(g.tooltip.format.value).not.to.equal(null);
                    expect(g.tooltip.format.value(9, null, "series_2").toString()).to.equal("N * 3 = 9");

                    // expect(g.line.connectNull).to.equal(true);
                }
            }
        };

        const wrapper = shallow(<C3Graph id="testGraph" builder={builder} rows={rows}/>);
        wrapper.instance().componentDidUpdate();
    });

    afterEach(() => {
        global.window = undefined;
    });
});
