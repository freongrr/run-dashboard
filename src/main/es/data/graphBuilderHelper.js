// @flow

import type {Attribute, GraphAxisBuilder, GraphBuilder, GraphSeriesBuilder} from "../types/Types";
import * as DistanceUtils from "../utils/DistanceUtils";
import * as TimeUtils from "../utils/TimeUtils";

// TODO : do we really need to go through these intermediate objects? 

const DEFAULT_BUILDER: GraphBuilder = {
    type: "bar",
    time: false,
    x: {
        name: "x",
        format: (value: mixed) => "" + (value: any)
    },
    series: []
};

// TODO : pass attributes directly
export function createBuilder(attributes: Attribute[], measure: string, grouping: string): GraphBuilder {
    let graphBuilder = DEFAULT_BUILDER;
    try {
        const measureAttribute = attributes.find(p => p.id === measure);
        const groupingAttribute = attributes.find(p => p.id === grouping);
        if (!measureAttribute) {
            console.warn("Can't create graph without measure");
        } else if (measureAttribute === "extra") {
            console.warn("Can't create graph for " + measureAttribute.id);
        } else if (!groupingAttribute) {
            console.warn("Can't create graph without grouping");
        } else {
            graphBuilder = doCreateBuilder(measureAttribute, groupingAttribute);
        }
    } catch (e) {
        console.warn("Error reducing graph builder", e);
    }
    return graphBuilder;
}

function doCreateBuilder(measureAttribute: Attribute, groupingAttribute: Attribute): GraphBuilder {
    const axis = createHorizontalAxis(groupingAttribute);
    const series = createSeries(measureAttribute);
    return {
        type: "bar",
        time: false,
        x: axis,
        series: [series]
    };
}

function createHorizontalAxis(groupingAttribute: Attribute): GraphAxisBuilder {
    const numValueFormatter = getValueFormatter(groupingAttribute);
    return {
        name: groupingAttribute.label,
        format: (value: mixed) => {
            if (typeof value === "string") {
                return value;
            } else {
                return numValueFormatter((value: any));
            }
        }
    };
}

function createSeries(attribute: Attribute): GraphSeriesBuilder {
    return {
        name: attribute.label,
        format: getValueFormatter(attribute),
        secondY: false
    };
}

function getValueFormatter(attribute: Attribute): (value: number) => string {
    switch (attribute.id) {
    case "distance":
        return (value: number) => DistanceUtils.formatKm(value);
    case "duration":
        return (value: number) => TimeUtils.formatHourMinutes(value);
    case "time1km":
        return (value: number) => TimeUtils.formatMinuteSeconds(value);
    case "speed":
        return (value: number) => DistanceUtils.formatKm(value * 1000) + "/h";
    case "temperature":
        return (value: number) => Math.round(value * 10)/10 + " °C";
    default:
        return (value: number) => "" + value;
    }
}
