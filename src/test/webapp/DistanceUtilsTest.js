// @flow
import {describe, it} from "mocha";
import {expect} from "chai";
import {parseDistance, formatKm, formatMeters} from "../../main/webapp/DistanceUtils";

describe("DistanceUtils", () => {
    describe("#parseDistance()", () => {

        it("throws an error if the parameter is not a duration", () => {
            expect(() => parseDistance("abc")).to.throw(/Unexpected: 'abc'/);
        });

        it("can parses 'zero'", () => {
            expect(parseDistance("zero km")).to.equal(0);
            expect(parseDistance("zero meter")).to.equal(0);
        });

        it("can parses 'one'", () => {
            expect(parseDistance("one km")).to.equal(1000);
            expect(parseDistance("one meter")).to.equal(1);
        });

        it("can parses all variations 'kilometer'", () => {
            expect(parseDistance("1 k")).to.equal(1000);
            expect(parseDistance("1 km")).to.equal(1000);
            expect(parseDistance("1 kms")).to.equal(1000);
            expect(parseDistance("1 kilo")).to.equal(1000);
            expect(parseDistance("1 kilos")).to.equal(1000);
            expect(parseDistance("1 kilometer")).to.equal(1000);
            expect(parseDistance("1 kilo meters")).to.equal(1000);
            expect(parseDistance("1 kilo meters")).to.equal(1000);
        });

        it("can parses all variations 'meter'", () => {
            expect(parseDistance("1 m")).to.equal(1);
            expect(parseDistance("1 meter")).to.equal(1);
            expect(parseDistance("1 meters")).to.equal(1);
        });

        it("can parses decimal distances", () => {
            expect(parseDistance("0.5 km")).to.equal(500);
            expect(parseDistance("6.66 km")).to.equal(6660);
        });

        it("can parses distances without a space", () => {
            expect(parseDistance("1km")).to.equal(1000);
            expect(parseDistance("1m")).to.equal(1);
            expect(parseDistance("1km1m")).to.equal(1001);
        });

        it("sums up the distances", () => {
            expect(parseDistance("1 kilometer and 500 meters")).to.equal(1500);
        });

        it("assumes a string of digits is a number of kilometers", () => {
            expect(parseDistance("0")).to.equal(0);
            expect(parseDistance("1")).to.equal(1000);
            expect(parseDistance("35")).to.equal(35000);
        });

        it("assumes a string of digits after a number of km is a number of meters", () => {
            expect(parseDistance("1 km 500")).to.equal(1500);
        });

        it("throws an error if there are unexpected characters", () => {
            expect(() => parseDistance("2 something")).to.throw(/Unexpected: '2 something'/);
            expect(() => parseDistance("1 km and whatever")).to.throw(/Unexpected: 'whatever'/);
            expect(() => parseDistance("500 m 10")).to.throw(/Unexpected: '10'/);
        });
    });

    describe("#formatKm()", () => {

        it("returns '0 km' for a zero distance", () => {
            expect(formatKm(0)).to.equal("0 km");
        });

        it("returns '< 0.1 km' for a very short distance", () => {
            expect(formatKm(1)).to.equal("< 0.1 km");
            expect(formatKm(99)).to.equal("< 0.1 km");
            expect(formatKm(100)).to.equal("0.1 km");
        });

        it("rounds to the nearest tenth of km", () => {
            expect(formatKm(501)).to.equal("0.5 km");
        });

        it("appends a decimal even for round distances", () => {
            expect(formatKm(1000)).to.equal("1.0 km");
            expect(formatKm(1001)).to.equal("1.0 km");
        });
    });

    describe("#formatMeters()", () => {

        it("returns '0 m' for a zero distance", () => {
            expect(formatMeters(0)).to.equal("0 m");
        });

        it("formats short distances in meters", () => {
            expect(formatMeters(8)).to.equal("8 m");
            expect(formatMeters(950)).to.equal("950 m");
        });

        it("formats long distances in kilometers", () => {
            expect(formatMeters(1000)).to.equal("1.0 km");
            expect(formatMeters(5500)).to.equal("5.5 km");
        });
    });
});
