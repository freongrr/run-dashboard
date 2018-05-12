// @flow
/* global global */

import React from "react";
import {shallow} from "enzyme";
import type {GraphBuilder} from "../../../main/es/types/Types";
import C3Graph from "../../../main/es/components/C3Graph";

describe("C3Graph", () => {

    test("renders an empty placeholder for the graph", () => {
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
        expect(wrapper.find("#testGraph")).toHaveLength(1);
    });

    test("generates a C3.js graph", () => {
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

        global.c3 = {
            generate: function (g) {
                expect(g.bindto).toEqual("#testGraph");

                expect(g.data.type).toEqual("bar");
                expect(g.data.x).toEqual("x"); // auto generated

                expect(g.data.rows).toHaveLength(4);
                expect(g.data.rows[0]).toEqual(["x", "series_1", "series_2"]); // auto generated
                expect(g.data.rows[1]).toEqual(["1", 2, 3]);
                expect(g.data.rows[2]).toEqual(["2", 4, 6]);
                expect(g.data.rows[3]).toEqual(["3", 6, 9]);
                expect(g.data.keys.x).toEqual("x");
                expect(g.data.keys.value).toEqual(["series_1", "series_2"]);
                expect(g.data.axes).toEqual({"series_1": "y", "series_2": "y2"});
                expect(g.data.names).toEqual({"series_1": "N * 2", "series_2": "N * 3"});

                expect(g.axis.x.type).toEqual("category");
                expect(g.axis.y.type).not.toBeNull();
                expect(g.axis.y2.type).not.toBeNull();

                expect(g.tooltip.format.value).not.toBeNull();
                expect(g.tooltip.format.value(9, null, "series_2").toString()).toEqual("N * 3 = 9");

                // expect(g.line.connectNull).toEqual(true);
            }
        };

        const wrapper = shallow(<C3Graph id="testGraph" builder={builder} rows={rows}/>);
        wrapper.instance().componentDidUpdate();
    });

    afterEach(() => {
        delete global.c3;
    });
});
