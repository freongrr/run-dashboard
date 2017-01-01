// @flow
"use strict";

const KM_REG_EXP = new RegExp(/(\d+(?:\.\d+)?)\s*(?:kilo meters|kilo meter|kilometers|kilometer|kilos|kilo|kms|km|k)(?=\b|\d)/i);
const METER_REG_EXP = new RegExp(/(\d+)\s*(?:meters|meter|m)(?=\b|\d)/i);
const NUMBER_REG_EXP = new RegExp(/^(\d+(?:\.\d+)?)$/);

/**
 * Parses a distance string (e.g. "1 km and 500 meters" or "2.5 km") and returns the distance in meters.
 * @param distanceString
 * @returns {string}
 */
export function parseDistance(distanceString: string): number {
    if (distanceString === undefined || distanceString === null) {
        throw new Error("Parameter is null");
    } else if (typeof distanceString !== "string") {
        throw new Error(`Parameter is not a string: ${typeof distanceString}`);
    }

    let str = distanceString
        .replace(/\band\b/ig, "")
        .replace(/,/ig, "")
        .replace(/\bzero\b/ig, "0")
        .replace(/\bone\b/ig, "1");

    let matches;
    let kilometers = 0;
    let meters = 0;

    if ((matches = NUMBER_REG_EXP.exec(str)) != null) {
        kilometers = parseFloat(matches[1]);
    } else {
        if ((matches = KM_REG_EXP.exec(str)) != null) {
            kilometers = parseFloat(matches[1]);
            str = str.replace(KM_REG_EXP, "").trim();
        }

        if ((matches = METER_REG_EXP.exec(str)) != null) {
            meters = parseInt(matches[1]);
            str = str.replace(METER_REG_EXP, "").trim();
        } else if ((matches = NUMBER_REG_EXP.exec(str)) != null) {
            meters = parseFloat(matches[1]);
            str = str.replace(NUMBER_REG_EXP, "").trim();
        }


        if (str.length > 0) {
            throw new Error(`Unexpected: '${str}'`);
        }
    }

    return kilometers * 1000 + meters;
}

/**
 * Formats the distance in meters as kilometers (e.g. "10.5 km").
 * @param distanceInMeters
 * @returns {string}
 */
export function formatKm(distanceInMeters: number): string {
    if (distanceInMeters === 0) {
        return "0 km";
    } else if (distanceInMeters < 100) {
        return "< 0.1 km";
    } else {
        const rounded = Math.round(distanceInMeters / 100) / 10;
        if (rounded === Math.round(rounded)) {
            return rounded + ".0 km";
        } else {
            return rounded + " km";
        }
    }
}

/**
 * Formats the distance in meters as meters (e.g. "3 m") or kilo meters for distances above 1000 meters (e.g. "1.5 km").
 * @param distanceInMeters
 * @returns {string}
 */
export function formatMeters(distanceInMeters: number): string {
    if (distanceInMeters >= 1000) {
        return formatKm(distanceInMeters);
    } else {
        return distanceInMeters + " m";
    }
}
