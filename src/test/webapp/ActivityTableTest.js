// @flow
import {describe, it} from "mocha";
import React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import ActivityTable from "../../main/webapp/ActivityTable";

describe("ActivityTable", () => {

    const noop = () => {
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

    it("adds a dummy row when there are no activities", () => {
        const wrapper = shallow(<ActivityTable activities={[]} editHandler={noop} deleteHandler={noop}/>);
        expect(getRows(wrapper).text()).to.equal("Found nothing. Go out and run!");
    });

    it("renders one row per activity", () => {
        const wrapper = shallow(<ActivityTable activities={activities} editHandler={noop} deleteHandler={noop}/>);

        const rows = getRows(wrapper);
        expect(rows).to.have.length(2);
        expect(rows.at(0).key()).to.equal("1");
        expect(rows.at(1).key()).to.equal("2");
    });

    it("formats the numbers", () => {
        const wrapper = shallow(<ActivityTable activities={activities} editHandler={noop} deleteHandler={noop}/>);

        const cells = getCells(wrapper, 0);
        expect(cells.at(0).text()).to.equal("2016-12-17"); // date
        expect(cells.at(1).text()).to.equal("42 min"); // duration
        expect(cells.at(2).text()).to.equal("8.5 km"); // distance
        expect(cells.at(3).text()).to.equal("4 min 59 sec"); // split
        expect(cells.at(4).find("DropdownButton")).to.have.length(1); // actions
    });

    it("invokes the edit callback", (done) => {
        const wrapper = shallow(<ActivityTable activities={activities}
                                               editHandler={(a) => {
                                                   expect(a).to.deep.equal(activities[0]);
                                                   done();
                                               }}
                                               deleteHandler={() => done(new Error())}/>);

        getMenuItem(wrapper, 0, "edit").simulate("select");
    });

    it("invokes the delete callback", (done) => {
        const wrapper = shallow(<ActivityTable activities={activities}
                                               editHandler={() => done(new Error())}
                                               deleteHandler={(a) => {
                                                   expect(a).to.deep.equal(activities[0]);
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
