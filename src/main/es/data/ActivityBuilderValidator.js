//@flow

import * as TimeUtils from "../utils/TimeUtils";
import * as DistanceUtils from "../utils/DistanceUtils";

export function hasValidDate(date: string): boolean {
    return date !== null && date !== "";
}

export function hasValidDuration(duration: string): boolean {
    if (duration !== "") {
        try {
            TimeUtils.parseDuration(duration);
            return true;
        } catch (e) {
            // 
        }
    }
    return false;
}

export function hasValidDistance(distance: string): boolean {
    if (distance !== "") {
        try {
            DistanceUtils.parseDistance(distance);
            return true;
        } catch (e) {
            // 
        }
    }
    return false;
}
