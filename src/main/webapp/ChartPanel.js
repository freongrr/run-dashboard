// @flow
/* eslint no-console: ["off"] */
"use strict";
import type {Activity, GraphBuilder, GraphSeriesBuilder, GraphAxisBuilder} from "./Types";
import React from "react";
import {Nav, NavItem, Form, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import DataStore from "./DataStore";
import C3Graph from "./C3Graph";
import {formatHourMinutes, formatMinuteSeconds} from "./TimeUtils";
import {formatKm} from "./DistanceUtils";

type GraphType = {
    id: string,
    label: string,
    category: ?string
};

type ChartPanelProps = {
    route: {
        dataStore: DataStore,
        zoom: string
    }
};

type ChartPanelState = {
    zoom: string,
    graphTypes: GraphType[],
    graphType: GraphType,
    builder: GraphBuilder,
    activities: Activity[]
};

// TODO : graph types

const LAST_12_MONTHS = "last12Months";
const LAST_30_DAYS = "last30Days";

const GRAPH_TYPES = {};
GRAPH_TYPES[LAST_12_MONTHS] = [
    {
        id: "last12MonthsDuration",
        label: "Duration",
        category: "duration"
    },
    {
        id: "last12MonthsDistance",
        label: "Distance",
        category: "distance"
    },
    {
        id: "last12MonthsSplitTime",
        label: "Average split time",
        category: "averageSplitTime"
    },
];
GRAPH_TYPES[LAST_30_DAYS] = [
    {
        id: "last30DaysDuration",
        label: "Duration",
        category: "duration"
    },
    {
        id: "last30DaysDistance",
        label: "Distance",
        category: "distance"
    },
    {
        id: "last30DaysSplitTime",
        label: "Average split time",
        category: "averageSplitTime"
    },
    {
        id: "last30DaysVsPrevious30Days",
        label: "Comparison with previous 30 days",
        category: null
    },
    {
        id: "last30DaysVsAYearAgo",
        label: "Comparison with a year ago",
        category: null
    },
];

// TODO : other graph types
// - (pie chart) distance objective (but then, what if it goes above 100%?)

export default class ChartPanel extends React.Component {
    props: ChartPanelProps;
    state: ChartPanelState;

    constructor(props: ChartPanelProps) {
        super(props);

        const initialZoom = props.route.zoom;
        const initialTypes = GRAPH_TYPES[initialZoom];
        const initialGraphType = initialTypes[0];
        const initialBuilder = ChartPanel.createBuilder(initialZoom, initialGraphType);

        // TODO : store/read the chart type in the route
        this.state = {
            zoom: initialZoom,
            graphTypes: initialTypes,
            graphType: initialGraphType,
            builder: initialBuilder,
            activities: []
        };
    }

    render() {
        return (
            <div>
                {/* TODO : rename the routes to match */}
                <Nav bsStyle="tabs" activeKey={this.state.zoom}>
                    {/*HACK - I can't use Link here because it put a <a> inside a <a> ...*/}
                    {/*TODO : loop on all types*/}
                    <NavItem eventKey={LAST_12_MONTHS} href="/#/Last12Months">Past 12 Months</NavItem>
                    <NavItem eventKey={LAST_30_DAYS} href="/#/Last30Days">Past 30 Days</NavItem>
                </Nav>

                <div className="dashboard-graph">
                    <Form inline>
                        {/* TODO : use 2 combos to show 2 graph types */}
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Graph type:{" "}</ControlLabel>
                            <FormControl componentClass="select" placeholder="select"
                                         value={this.state.graphType.id}
                                         onChange={(e) => this.changeType(e.target.value)}>
                                {this.state.graphTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </FormControl>
                        </FormGroup>
                    </Form>
                    <C3Graph id="chartGoesHere" builder={this.state.builder} data={this.state.activities}/>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.props.route.dataStore.subscribe((activities, e) => {
            if (activities) {
                this.setState({
                    activities: activities
                });
            } else if (e) {
                // TODO
            }
        });
    }

    componentWillReceiveProps(nextProps: ChartPanelProps) {
        const newZoom = nextProps.route.zoom;
        if (newZoom !== this.props.route.zoom) {
            const newTypes: GraphType[] = GRAPH_TYPES[newZoom];

            let newGraphType = newTypes.find(t => t.category === this.state.graphType.category);
            if (newGraphType === null || newGraphType === undefined) {
                newGraphType = newTypes[0];
            }

            // Change the list of types, the selected (or default) type, and rebuild the graph
            this.setState({
                zoom: newZoom,
                graphTypes: newTypes,
                graphType: newGraphType,
                builder: ChartPanel.createBuilder(newZoom, newGraphType),
            });
        }
    }

    changeType(graphTypeId: string) {
        const graphType = this.state.graphTypes.find(t => t.id === graphTypeId);
        if (graphType === null || graphType === undefined) {
            console.error("Could not find graph for type: " + graphTypeId);
        } else {
            // Changes the selected type and rebuild the graph
            this.setState({
                graphType: graphType,
                builder: ChartPanel.createBuilder(this.state.zoom, graphType)
            });
        }
    }

    // TODO : move all that to the server
    static createBuilder(zoom: string, graphType: GraphType): GraphBuilder {
        console.info(`Rebuilding graph: ${graphType.id}`);
        if (graphType.id === "last12MonthsDistance" || graphType.id === "last30DaysDistance") {
            return ChartPanel.buildBarGraph(zoom, [{
                id: "distance",
                name: "Distance",
                provider: (a: Activity) => a.distance,
                format: (value: number) => formatKm(value),
                secondY: false
            }]);
        } else if (graphType.id === "last12MonthsDuration" || graphType.id === "last30DaysDuration") {
            return ChartPanel.buildBarGraph(zoom, [{
                id: "duration",
                name: "Duration",
                provider: (a: Activity) => a.duration,
                format: (value: number) => formatHourMinutes(value),
                secondY: false
            }]);
        } else if (graphType.id === "last12MonthsSplitTime" || graphType.id === "last30DaysSplitTime") {
            return ChartPanel.buildLineGraph(zoom, [{
                id: "splitTime",
                name: "Avg. Split Time",
                provider: (a: Activity) => 1000 * a.duration / a.distance,
                aggregator: "AVG",
                format: (value: number) => formatMinuteSeconds(value),
                secondY: false
            }]);
        } else {
            throw new Error("Illegal graph type: " + graphType.id);
        }
    }

    static buildBarGraph(zoom: string, series: Array<GraphSeriesBuilder>): GraphBuilder {
        // TODO : this should be done elsewhere...
        return {
            type: "bar",
            time: zoom === LAST_30_DAYS,
            x: ChartPanel.buildAxis(zoom),
            series: series
        };
    }

    static buildLineGraph(zoom: string, series: Array<GraphSeriesBuilder>): GraphBuilder {
        // TODO : this should be done elsewhere...
        return {
            type: "line",
            time: zoom === LAST_30_DAYS,
            x: ChartPanel.buildAxis(zoom),
            series: series
        };
    }

    static buildAxis(zoom: string): GraphAxisBuilder {
        if (zoom === LAST_12_MONTHS) {
            return {
                id: "month",
                name: "Month",
                provider: (a: Activity) => a.date.substr(0, 7),
                format: (value: number) => "" + value,
                values: getPreviousMonths(12)
            };
        } else if (zoom === LAST_30_DAYS) {
            return {
                id: "day",
                name: "Day",
                provider: (a: Activity) => a.date,
                format: (value: number) => "" + value,
                values: getPreviousDays(30)
            };
        } else {
            throw new Error("Illegal zoom: " + zoom);
        }
    }
}

function getPreviousMonths(n): string[] {
    const months = [];
    const d = new Date();
    for (let x = 0; x < n; x++) {
        months.push(d.getFullYear() + "-" + pad(d.getMonth() + 1));
        d.setMonth(d.getMonth() - 1);
    }
    return months;
}

function getPreviousDays(n): string[] {
    const days = [];
    const d = new Date();
    for (let x = 0; x < n; x++) {
        const s = dateToString(d);
        // console.debug(`Date ${d.toDateString()} -> ${s}`);
        days.push(s);
        d.setDate(d.getDate() - 1);
    }
    return days;
}

function pad(x: number): string {
    return (x < 10 ? "0" : "") + x;
}

function dateToString(d: Date): string {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}
