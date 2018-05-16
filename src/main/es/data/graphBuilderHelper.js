// @flow

import type {AttributeType, GraphAxisBuilder, GraphBuilder, GraphSeriesBuilder} from "../types/Types";
import * as DistanceUtils from "../utils/DistanceUtils";
import * as TimeUtils from "../utils/TimeUtils";
import {ACTIVITY_ATTRIBUTES} from "./AttributeTypes";

const DEFAULT_BUILDER: GraphBuilder = {
    type: "bar",
    time: false,
    x: {
        name: "x",
        format: (value: number) => "" + value
    },
    series: []
};

export function createBuilder(interval: string, measure: string, grouping: ?string): GraphBuilder {
    let graphBuilder = DEFAULT_BUILDER;
    try {
        const measureAttribute = ACTIVITY_ATTRIBUTES.find(p => p.id === measure);
        const groupingAttribute = grouping ? ACTIVITY_ATTRIBUTES.find(p => p.id === grouping) : null;
        if (!measureAttribute) {
            console.warn("Can't create graph without measure");
        } else if (!measureAttribute.output) {
            console.warn("Can't create graph for " + measureAttribute.id);
        } else {
            graphBuilder = doCreateBuilder(interval, measureAttribute, groupingAttribute);
        }
    } catch (e) {
        console.warn("Error reducing graph builder", e);
    }
    return graphBuilder;
}

function doCreateBuilder(interval: string, measureAttribute: AttributeType, groupingAttribute: ?AttributeType): GraphBuilder {
    console.log(`Create graph builder for interval=${interval}, measure=${measureAttribute.id}, grouping=${groupingAttribute ? groupingAttribute.id : ""}`);

    const axis = createHorizontalAxis(interval);
    const series = createSeries(measureAttribute);

    // example of day (XY) graph:
    // return {
    //     type: "bar",
    //     time: true,
    //     x: {
    //         name: "Day",
    //         format: (value: number) => "" + value
    //     },
    //     series: [distanceSeries]
    // };

    return {
        type: "bar",
        time: false,
        x: axis,
        series: [series]
    };
}

function createHorizontalAxis(interval: string): GraphAxisBuilder {
    switch (interval) {
    case "all":
    case "last12Months":
    default:
        return {
            name: "Month",
            format: (value: number) => "" + value
        };
    }
}

function createSeries(attributeType: AttributeType): GraphSeriesBuilder {
    // TODO : aggregates!

    const attributeId = attributeType.id;
    switch (attributeId) {
    case "distance":
        return {
            name: attributeType.label,
            format: (value: number) => DistanceUtils.formatKm(value),
            secondY: false
        };
    case "duration":
        return {
            name: attributeType.label,
            format: (value: number) => TimeUtils.formatHourMinutes(value),
            secondY: false
        };
    case "time1km":
        return {
            name: attributeType.label,
            format: (value: number) => TimeUtils.formatMinuteSeconds(value),
            secondY: false
        };
    case "runs":
    case "speed":
    default:
        throw new Error("Unexpected attribute: " + attributeType.id);
    }
}

