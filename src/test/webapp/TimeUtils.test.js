// @flow
/* global describe, test */
import React from "react";
import expect from "expect";
import {formatHourMinutes, formatMinuteSeconds, parseDuration} from "../../main/webapp/TimeUtils";

describe("TimeUtils", () => {

    describe("#parseDuration()", () => {

        test("throws an error if the parameter is not a duration", () => {
            expect(() => parseDuration("abc")).toThrow(/Unexpected: 'abc'/);
        });

        test("can parses 'zero'", () => {
            expect(parseDuration("zero hour")).toEqual(0);
            expect(parseDuration("zero minute")).toEqual(0);
            expect(parseDuration("zero second")).toEqual(0);
        });

        test("can parses 'one'", () => {
            expect(parseDuration("one hour")).toEqual(3600);
            expect(parseDuration("one minute")).toEqual(60);
            expect(parseDuration("one second")).toEqual(1);
        });

        test("can parses all variations 'hour'", () => {
            expect(parseDuration("1 h")).toEqual(3600);
            expect(parseDuration("1 hour")).toEqual(3600);
            expect(parseDuration("1 hours")).toEqual(3600);
        });

        test("can parses all variations 'minute'", () => {
            expect(parseDuration("1 m")).toEqual(60);
            expect(parseDuration("1 min")).toEqual(60);
            expect(parseDuration("1 minute")).toEqual(60);
            expect(parseDuration("1 minutes")).toEqual(60);
        });

        test("can parses all variations 'second'", () => {
            expect(parseDuration("1 s")).toEqual(1);
            expect(parseDuration("1 sec")).toEqual(1);
            expect(parseDuration("1 second")).toEqual(1);
            expect(parseDuration("1 seconds")).toEqual(1);
        });

        test("can parses durations without a space", () => {
            expect(parseDuration("1h")).toEqual(3600);
            expect(parseDuration("1m")).toEqual(60);
            expect(parseDuration("1s")).toEqual(1);
            expect(parseDuration("1h1m1s")).toEqual(3661);
        });

        test("sums up the durations", () => {
            expect(parseDuration("2 hours, 4 minutes and 8 seconds")).toEqual(7448);
            expect(parseDuration("2 h 4 min 8 sec")).toEqual(7448);
        });

        test("assumes a string of digits is a number of minutes", () => {
            expect(parseDuration("0")).toEqual(0);
            expect(parseDuration("1")).toEqual(60);
            expect(parseDuration("35")).toEqual(2100);
        });

        test("parses a duration expressed as 'MM:SS'", () => {
            expect(parseDuration("0:00")).toEqual(0);
            expect(parseDuration("01:01")).toEqual(61);
            expect(parseDuration("10:20")).toEqual(620);
        });

        test("parses a duration expressed as 'HH:MM:SS'", () => {
            expect(parseDuration("00:00:00")).toEqual(0);
            expect(parseDuration("01:01:01")).toEqual(3661);
            expect(parseDuration("2:10:30")).toEqual(7830);
        });

        test("throws an error if there are unexpected characters", () => {
            expect(() => parseDuration("1 min 30")).toThrow(/Unexpected: '30'/);
            expect(() => parseDuration("2 something")).toThrow(/Unexpected: '2 something'/);
            expect(() => parseDuration("1 hour and whatever")).toThrow(/Unexpected: 'whatever'/);
        });
    });

    describe("#formatHourMinutes()", () => {

        test("returns '0 min' for a zero duration", () => {
            expect(formatHourMinutes(0)).toEqual("0 min");
        });

        test("returns '< 1 min' for very durations", () => {
            expect(formatHourMinutes(1)).toEqual("< 1 min");
            expect(formatHourMinutes(59)).toEqual("< 1 min");
        });

        test("formats short duration in minutes", () => {
            expect(formatHourMinutes(60)).toEqual("1 min");
            expect(formatHourMinutes(3599)).toEqual("59 min");
        });

        test("formats longer duration in hours and minutes", () => {
            expect(formatHourMinutes(3600)).toEqual("1 hour");
            expect(formatHourMinutes(5400)).toEqual("1 hour 30 min");
            expect(formatHourMinutes(7200)).toEqual("2 hours");
        });
    });

    describe("#formatMinuteSeconds()", () => {

        test("returns '0 sec' for a zero duration", () => {
            expect(formatMinuteSeconds(0)).toEqual("0 sec");
        });

        test("formats short durations in second", () => {
            expect(formatMinuteSeconds(35)).toEqual("35 sec");
        });

        test("formats longer durations in minutes and seconds", () => {
            expect(formatMinuteSeconds(265)).toEqual("4 min 25 sec");
        });

        test("formats round durations in minutes only", () => {
            expect(formatMinuteSeconds(180)).toEqual("3 min");
        });
    });
});
