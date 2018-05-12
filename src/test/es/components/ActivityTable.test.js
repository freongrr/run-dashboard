// @flow

import React from "react";
import {shallow} from "enzyme";
import ActivityTable from "../../../main/es/components/ActivityTable";

describe("ActivityTable", () => {

    const noop = () => {
    };

    const throwingCallback = () => {
        throw new Error();
    };

    const activities = [
        {
            id: "1",
            date: "2016-12-17",
            duration: 2544,
            distance: 8500
        }, {
            id: "2",
            date: "2016-12-11",
            duration: 2145,
            distance: 7000
        }
    ];

    test("adds a dummy row when there are no activities", () => {
        const wrapper = shallow(<ActivityTable activities={[]} editHandler={noop} deleteHandler={noop}/>);
        expect(getRows(wrapper).text()).toEqual("Found nothing. Go out and run!");
    });

    test("renders one row per activity", () => {
        const wrapper = shallow(<ActivityTable activities={activities} editHandler={noop} deleteHandler={noop}/>);

        const rows = getRows(wrapper);
        expect(rows).toHaveLength(2);
        expect(rows.at(0).key()).toEqual("1");
        expect(rows.at(1).key()).toEqual("2");
    });

    test("formats the numbers", () => {
        const wrapper = shallow(<ActivityTable activities={activities} editHandler={noop} deleteHandler={noop}/>);

        const cells = getCells(wrapper, 0);
        expect(cells.at(0).text()).toEqual("2016-12-17"); // date
        expect(cells.at(1).text()).toEqual("42 min"); // duration
        expect(cells.at(2).text()).toEqual("8.5 km"); // distance
        expect(cells.at(3).text()).toEqual("4 min 59 sec"); // split
        expect(cells.at(4).find("DropdownButton")).toHaveLength(1); // actions
    });

    test("invokes the edit callback", (done) => {
        const wrapper = shallow(<ActivityTable
            activities={activities}
            editHandler={(a) => {
                expect(a).toEqual(activities[0]);
                done();
            }}
            deleteHandler={throwingCallback}/>);

        getMenuItem(wrapper, 0, "edit").simulate("select");
    });

    test("invokes the delete callback", (done) => {
        const wrapper = shallow(<ActivityTable
            activities={activities}
            editHandler={throwingCallback}
            deleteHandler={(a) => {
                expect(a).toEqual(activities[0]);
                done();
            }}/>);

        getMenuItem(wrapper, 0, "delete").simulate("select");
    });
});

function getRows(wrapper) {
    return wrapper.find("tbody").find("tr");
}

function getCells(wrapper, rowIndex) {
    const rows = getRows(wrapper);
    return rows.at(rowIndex).find("td");
}

function getMenuItem(wrapper, rowIndex, eventKey) {
    const cells = getCells(wrapper, rowIndex);
    return cells.at(4).find("MenuItem").findWhere((w) => w.prop("eventKey") === eventKey);
}
