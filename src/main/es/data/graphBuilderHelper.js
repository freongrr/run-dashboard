// @flow

import type {Attribute, GraphAxisBuilder, GraphBuilder, GraphSeriesBuilder} from "../types/Types";
import * as DistanceUtils from "../utils/DistanceUtils";
import * as TimeUtils from "../utils/TimeUtils";
import {ACTIVITY_ATTRIBUTES} from "./StaticAttributes";

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
        } else if (measureAttribute === "extra") {
            console.warn("Can't create graph for " + measureAttribute.id);
        } else {
            graphBuilder = doCreateBuilder(interval, measureAttribute, groupingAttribute);
        }
    } catch (e) {
        console.warn("Error reducing graph builder", e);
    }
    return graphBuilder;
}

function doCreateBuilder(interval: string, measureAttribute: Attribute, groupingAttribute: ?Attribute): GraphBuilder {
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

// TODO : generate the labels from metadata
function createSeries(attribute: Attribute): GraphSeriesBuilder {
    const attributeId = attribute.id;
    switch (attributeId) {
    case "distance":
        return {
            name: attribute.label,
            format: (value: number) => DistanceUtils.formatKm(value),
            secondY: false
        };
    case "duration":
        return {
            name: attribute.label,
            format: (value: number) => TimeUtils.formatHourMinutes(value),
            secondY: false
        };
    case "time1km":
        return {
            name: attribute.label,
            format: (value: number) => TimeUtils.formatMinuteSeconds(value),
            secondY: false
        };
    // TODO
    case "speed":
        return {
            name: attribute.label,
            format: (value: number) => "" + value,
            secondY: false
        };
    default:
        throw new Error("Unexpected attribute: " + attribute.id);
    }
}

