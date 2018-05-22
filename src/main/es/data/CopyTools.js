// @flow

import type {Activity, ActivityBuilder, AttributeValue} from "../types/Types";
import * as TimeUtils from "../utils/TimeUtils";
import * as DistanceUtils from "../utils/DistanceUtils";

export function toBuilder(activity: Activity): ActivityBuilder {
    return {
        id: activity.id,
        date: activity.date,
        duration: TimeUtils.formatHourMinutes(activity.duration),
        distance: DistanceUtils.formatKm(activity.distance),
        attributes: cloneAttributeValues(activity.attributes)
    };
}

export function fromBuilder(builder: ActivityBuilder): Activity {
    return {
        id: builder.id ? builder.id : "" /* canHACK - 't be null */,
        date: builder.date,
        duration: TimeUtils.parseDuration(builder.duration),
        distance: DistanceUtils.parseDistance(builder.distance),
        attributes: cloneAttributeValues(builder.attributes)
    };
}

export function cloneActivityBuilder(builder: ActivityBuilder): ActivityBuilder {
    const clone: ActivityBuilder = (Object.assign({}, builder): any);
    clone.attributes = cloneAttributeValues(builder.attributes);
    return clone;
}

export function cloneAttributeValues(values: { [string]: AttributeValue }): { [string]: AttributeValue } {
    const copy = {};
    Object.keys(values).forEach(k => copy[k] = values[k]);
    return copy;
}
