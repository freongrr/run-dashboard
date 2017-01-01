// @flow
"use strict";

const MM_SS_REG_EXP = new RegExp(/^(\d+):([0-5]\d)$/i);
const HH_MM_SS_REG_EXP = new RegExp(/^(\d+):([0-5]\d):([0-5]\d)$/i);
const NUMBER_REG_EXP = new RegExp(/^(\d+)$/);
const HOUR_REG_EXP = new RegExp(/(\d+)\s*(?:hours|hour|h)(?=\b|\d)/i);
const MINUTES_REG_EXP = new RegExp(/(\d+)\s*(?:minutes|minute|min|m)(?=\b|\d)/i);
const SECOND_REG_EXP = new RegExp(/(\d+)\s*(?:seconds|second|sec|s)(?=\b|\d)/i);

/**
 * Parses a duration string (e.g. "1 hour 5 minutes and 36 seconds") and returns the duration in seconds. If the input
 * string only contains numbers it is assumed to be minutes.
 *
 * @param durationString
 * @returns {string}
 */
export function parseDuration(durationString: string): number {
    if (durationString === undefined || durationString === null) {
        throw new Error("Parameter is null");
    } else if (typeof durationString !== "string") {
        throw new Error(`Parameter is not a string: ${typeof durationString}`);
    }

    let str = durationString
        .replace(/\band\b/ig, "")
        .replace(/,/ig, "")
        .replace(/\bzero\b/ig, "0")
        .replace(/\bone\b/ig, "1");

    let matches;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if ((matches = MM_SS_REG_EXP.exec(str)) != null) {
        minutes = parseInt(matches[1]);
        seconds = parseInt(matches[2]);
    } else if ((matches = HH_MM_SS_REG_EXP.exec(str)) != null) {
        hours = parseInt(matches[1]);
        minutes = parseInt(matches[2]);
        seconds = parseInt(matches[3]);
    } else if ((matches = NUMBER_REG_EXP.exec(str)) != null) {
        minutes = parseInt(matches[1]);
    } else {
        if ((matches = HOUR_REG_EXP.exec(str)) != null) {
            hours = parseInt(matches[1]);
            str = str.replace(HOUR_REG_EXP, "").trim();
        }

        if ((matches = MINUTES_REG_EXP.exec(str)) != null) {
            minutes = parseInt(matches[1]);
            str = str.replace(MINUTES_REG_EXP, "").trim();
        }

        if ((matches = SECOND_REG_EXP.exec(str)) != null) {
            seconds = parseInt(matches[1]);
            str = str.replace(SECOND_REG_EXP, "").trim();
        }

        if (str.length > 0) {
            throw new Error(`Unexpected: '${str}'`);
        }
    }

    return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formats a duration in seconds as hours and/or minutes (e.g. "1 hour 15 min" or "59 min")
 * @param durationInSeconds
 * @returns {string}
 */
export function formatHourMinutes(durationInSeconds: number): string {
    if (durationInSeconds === 0) {
        return "0 min";
    } else if (durationInSeconds < 60) {
        return "< 1 min";
    } else {
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor(durationInSeconds % 3600 / 60);

        let interval = "";

        if (hours == 1) {
            interval += hours + " hour ";
        } else if (hours > 0) {
            interval += hours + " hours ";
        }

        if (hours == 0 || minutes > 0) {
            interval += minutes + " min";
        }

        return interval.trim();
    }
}


/**
 * Formats a duration in seconds as minutes and/or seconds (e.g. "5 min 30 sec" or "15 sec")
 * @param durationInSeconds
 * @returns {string}
 */
export function formatMinuteSeconds(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);

    let interval = "";

    if (minutes > 0) {
        interval += minutes + " min ";
    }

    if (minutes === 0 || seconds > 0) {
        interval += seconds + " sec";
    }

    return interval.trim();
}
