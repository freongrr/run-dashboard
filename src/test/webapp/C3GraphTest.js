/* eslint-env mocha */
/* eslint no-undef: ["off"] */
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import C3Graph from "../../main/webapp/C3Graph";

describe("C3Graph", () => {

    it("renders an empty placeholder for the graph", () => {
        const builder = {};

        const wrapper = shallow(<C3Graph id="testGraph" builder={builder} data={[]}/>);
        expect(wrapper.find("#testGraph")).to.have.length(1);
    });

    it("generates a C3.js graph", () => {
        // TODO : we need to test categories, time series, etc

        const builder = {
            type: "bar",
            time: false,
            x: {
                id: "n",
                name: "N",
                provider: n => n,
                format: n => n
            },
            series: [{
                id: "n2",
                name: "N * 2",
                provider: n => n * 2,
                format: n => n,
                secondY: false
            }, {
                id: "n3",
                name: "N * 3",
                provider: n => n * 3,
                format: n => n,
                secondY: true
            }]
        };

        const data = [1, 2, 3];

        global.window = {
            c3: {
                generate: function (g) {
                    expect(g.bindto).to.equal("#testGraph");

                    expect(g.data.type).to.equal("bar");
                    expect(g.data.x).to.equal("n");

                    expect(g.data.rows).to.have.length(4);
                    expect(g.data.rows[0]).to.eql(["n", "n2", "n3"]);
                    expect(g.data.rows[1]).to.eql([1, 2, 3]);
                    expect(g.data.rows[2]).to.eql([2, 4, 6]);
                    expect(g.data.rows[3]).to.eql([3, 6, 9]);
                    expect(g.data.keys.x).to.equal("n");
                    expect(g.data.keys.value).to.eql(["n2", "n3"]);
                    expect(g.data.axes).to.eql({"n2": "y", "n3": "y2"});
                    expect(g.data.names).to.eql({"n2": "N * 2", "n3": "N * 3"});

                    expect(g.axis.x.type).to.equal("category");
                    expect(g.axis.y.type).not.to.equal(null);
                    expect(g.axis.y2.type).not.to.equal(null);

                    expect(g.tooltip.format.value).not.to.equal(null);
                    expect(g.tooltip.format.value(5, null, "n2").toString()).to.equal("5");

                    expect(g.line.connectNull).to.equal(true);
                }
            }
        };

        const wrapper = shallow(<C3Graph id="testGraph" builder={builder} data={data}/>);
        wrapper.instance().componentDidUpdate();
    });

    afterEach(() => {
        global.window = undefined;
    });
});
