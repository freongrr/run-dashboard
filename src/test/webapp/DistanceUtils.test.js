// @flow
/* global describe, test */
import React from "react";
import expect from "expect";
import {formatKm, formatMeters, parseDistance} from "../../main/webapp/DistanceUtils";

describe("DistanceUtils", () => {

    describe("#parseDistance()", () => {

        test("throws an error if the parameter is not a duration", () => {
            expect(() => parseDistance("abc")).toThrow(/Unexpected: 'abc'/);
        });

        test("can parses 'zero'", () => {
            expect(parseDistance("zero km")).toEqual(0);
            expect(parseDistance("zero meter")).toEqual(0);
        });

        test("can parses 'one'", () => {
            expect(parseDistance("one km")).toEqual(1000);
            expect(parseDistance("one meter")).toEqual(1);
        });

        test("can parses all variations 'kilometer'", () => {
            expect(parseDistance("1 k")).toEqual(1000);
            expect(parseDistance("1 km")).toEqual(1000);
            expect(parseDistance("1 kms")).toEqual(1000);
            expect(parseDistance("1 kilo")).toEqual(1000);
            expect(parseDistance("1 kilos")).toEqual(1000);
            expect(parseDistance("1 kilometer")).toEqual(1000);
            expect(parseDistance("1 kilo meters")).toEqual(1000);
            expect(parseDistance("1 kilo meters")).toEqual(1000);
        });

        test("can parses all variations 'meter'", () => {
            expect(parseDistance("1 m")).toEqual(1);
            expect(parseDistance("1 meter")).toEqual(1);
            expect(parseDistance("1 meters")).toEqual(1);
        });

        test("can parses decimal distances", () => {
            expect(parseDistance("0.5 km")).toEqual(500);
            expect(parseDistance("6.66 km")).toEqual(6660);
        });

        test("can parses distances without a space", () => {
            expect(parseDistance("1km")).toEqual(1000);
            expect(parseDistance("1m")).toEqual(1);
            expect(parseDistance("1km1m")).toEqual(1001);
        });

        test("sums up the distances", () => {
            expect(parseDistance("1 kilometer and 500 meters")).toEqual(1500);
        });

        test("assumes a string of digits is a number of kilometers", () => {
            expect(parseDistance("0")).toEqual(0);
            expect(parseDistance("1")).toEqual(1000);
            expect(parseDistance("35")).toEqual(35000);
        });

        test("assumes a string of digits after a number of km is a number of meters", () => {
            expect(parseDistance("1 km 500")).toEqual(1500);
        });

        test("throws an error if there are unexpected characters", () => {
            expect(() => parseDistance("2 something")).toThrow(/Unexpected: '2 something'/);
            expect(() => parseDistance("1 km and whatever")).toThrow(/Unexpected: 'whatever'/);
            expect(() => parseDistance("500 m 10")).toThrow(/Unexpected: '10'/);
        });
    });

    describe("#formatKm()", () => {

        test("returns '0 km' for a zero distance", () => {
            expect(formatKm(0)).toEqual("0 km");
        });

        test("returns '< 0.1 km' for a very short distance", () => {
            expect(formatKm(1)).toEqual("< 0.1 km");
            expect(formatKm(99)).toEqual("< 0.1 km");
            expect(formatKm(100)).toEqual("0.1 km");
        });

        test("rounds to the nearest tenth of km", () => {
            expect(formatKm(501)).toEqual("0.5 km");
        });

        test("appends a decimal even for round distances", () => {
            expect(formatKm(1000)).toEqual("1.0 km");
            expect(formatKm(1001)).toEqual("1.0 km");
        });
    });

    describe("#formatMeters()", () => {

        test("returns '0 m' for a zero distance", () => {
            expect(formatMeters(0)).toEqual("0 m");
        });

        test("formats short distances in meters", () => {
            expect(formatMeters(8)).toEqual("8 m");
            expect(formatMeters(950)).toEqual("950 m");
        });

        test("formats long distances in kilometers", () => {
            expect(formatMeters(1000)).toEqual("1.0 km");
            expect(formatMeters(5500)).toEqual("5.5 km");
        });
    });
});
