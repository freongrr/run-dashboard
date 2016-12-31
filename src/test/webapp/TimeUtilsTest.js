/* eslint-env mocha */
import {expect} from "chai";
import {parseDuration, formatHourMinutes, formatMinuteSeconds} from "../../main/webapp/TimeUtils";

describe("TimeUtils", () => {
    describe("#parseDuration()", () => {

        it("throws an error if the parameter is null", () => {
            expect(() => parseDuration(null)).to.throw(/Parameter is null/);
        });

        it("throws an error if the parameter is not a string", () => {
            expect(() => parseDuration(123)).to.throw(/Parameter is not a string: number/);
        });

        it("throws an error if the parameter is not a duration", () => {
            expect(() => parseDuration("abc")).to.throw(/Malformed duration: abc/);
        });

        it("can parses 'zero'", () => {
            expect(parseDuration("zero hour")).to.equal(0);
            expect(parseDuration("zero minute")).to.equal(0);
            expect(parseDuration("zero second")).to.equal(0);
        });

        it("can parses 'one'", () => {
            expect(parseDuration("one hour")).to.equal(3600);
            expect(parseDuration("one minute")).to.equal(60);
            expect(parseDuration("one second")).to.equal(1);
        });

        it("can parses all variations 'hour'", () => {
            expect(parseDuration("1 h")).to.equal(3600);
            expect(parseDuration("1 hour")).to.equal(3600);
            expect(parseDuration("1 hours")).to.equal(3600);
        });

        it("can parses all variations 'minute'", () => {
            expect(parseDuration("1 m")).to.equal(60);
            expect(parseDuration("1 min")).to.equal(60);
            expect(parseDuration("1 minute")).to.equal(60);
            expect(parseDuration("1 minutes")).to.equal(60);
        });

        it("can parses all variations 'second'", () => {
            expect(parseDuration("1 s")).to.equal(1);
            expect(parseDuration("1 sec")).to.equal(1);
            expect(parseDuration("1 second")).to.equal(1);
            expect(parseDuration("1 seconds")).to.equal(1);
        });

        it("can parses durations without a space", () => {
            expect(parseDuration("1h")).to.equal(3600);
            expect(parseDuration("1m")).to.equal(60);
            expect(parseDuration("1s")).to.equal(1);
            expect(parseDuration("1h1m1s")).to.equal(3661);
        });

        it("sums up the durations", () => {
            expect(parseDuration("2 hours, 4 minutes and 8 seconds")).to.equal(7448);
        });

        it("assumes a string of digits is a number of minutes", () => {
            expect(parseDuration("0")).to.equal(0);
            expect(parseDuration("1")).to.equal(60);
            expect(parseDuration("35")).to.equal(2100);
        });
    });

    describe("#formatHourMinutes()", () => {

        it("returns '0 min' for a zero duration", () => {
            expect(formatHourMinutes(0)).to.equal("0 min");
        });

        it("returns '< 1 min' for very durations", () => {
            expect(formatHourMinutes(1)).to.equal("< 1 min");
            expect(formatHourMinutes(59)).to.equal("< 1 min");
        });

        it("formats short duration in minutes", () => {
            expect(formatHourMinutes(60)).to.equal("1 min");
            expect(formatHourMinutes(3599)).to.equal("59 min");
        });

        it("formats longer duration in hours and minutes", () => {
            expect(formatHourMinutes(3600)).to.equal("1 hour");
            expect(formatHourMinutes(5400)).to.equal("1 hour 30 min");
            expect(formatHourMinutes(7200)).to.equal("2 hours");
        });
    });

    describe("#formatMinuteSeconds()", () => {

        it("returns '0 sec' for a zero duration", () => {
            expect(formatMinuteSeconds(0)).to.equal("0 sec");
        });

        it("formats short durations in second", () => {
            expect(formatMinuteSeconds(35)).to.equal("35 sec");
        });

        it("formats longer durations in minutes and seconds", () => {
            expect(formatMinuteSeconds(265)).to.equal("4 min 25 sec");
        });

        it("formats round durations in minutes only", () => {
            expect(formatMinuteSeconds(180)).to.equal("3 min");
        });
    });
});
