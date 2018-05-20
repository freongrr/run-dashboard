//@flow

import * as TimeUtils from "../utils/TimeUtils";
import * as DistanceUtils from "../utils/DistanceUtils";
import type {ActivityBuilder} from "../types/Types";

export function hasValidDate(builder: ActivityBuilder): boolean {
    return builder.date !== null && builder.date !== "";
}

export function hasValidDuration(builder: ActivityBuilder): boolean {
    if (builder.duration !== "") {
        try {
            TimeUtils.parseDuration(builder.duration);
            return true;
        } catch (e) {
            // 
        }
    }
    return false;
}

export function hasValidDistance(builder: ActivityBuilder): boolean {
    if (builder.distance !== "") {
        try {
            DistanceUtils.parseDistance(builder.distance);
            return true;
        } catch (e) {
            // 
        }
    }
    return false;
}
