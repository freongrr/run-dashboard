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

type ChartPanelProps = {
    route: {
        dataStore: DataStore,
        zoom: string
    }
};

type ChartPanelState = {
    zoom: string,
    graphType: string,
    builder: GraphBuilder,
    activities: Activity[]
};

const DURATION = "duration";
const DISTANCE = "distance";
const AVERAGE_SPLIT_TIME = "averageSplitTime";

const DEFAULT_GRAPH_TYPE = DISTANCE;

export default class ChartPanel extends React.Component {
    props: ChartPanelProps;
    state: ChartPanelState;

    constructor(props: ChartPanelProps) {
        super(props);

        const initialZoom = props.route.zoom;
        const initialGraphType = DEFAULT_GRAPH_TYPE;
        const initialBuilder = ChartPanel.createBuilder(initialZoom, initialGraphType);

        // TODO : store/read the chart type in the route
        this.state = {
            zoom: initialZoom,
            graphType: initialGraphType,
            builder: initialBuilder,
            activities: []
        };
    }

    render() {
        return (
            <div>
                <Nav bsStyle="tabs" activeKey={this.state.zoom}>
                    {/*HACK - I can't use Link here because it put a <a> inside a <a> ...*/}
                    <NavItem eventKey="year" href="/#/Year">Year</NavItem>
                    <NavItem eventKey="month" href="/#/Month">Month</NavItem>
                    <NavItem eventKey="week" href="/#/Week">Week</NavItem>
                </Nav>

                <div className="dashboard-graph">
                    <Form inline>
                        {/* TODO : use 2 combos to show 2 graph types */}
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Graph type:{" "}</ControlLabel>
                            <FormControl componentClass="select" placeholder="select"
                                         value={this.state.graphType}
                                         onChange={(e) => this.changeType(e.target.value)}>
                                <option value={DISTANCE}>Distance</option>
                                <option value={DURATION}>Duration</option>
                                <option value={AVERAGE_SPLIT_TIME}>Average Split Time</option>
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
        if (nextProps.route.zoom !== this.props.route.zoom) {
            this.setState({
                zoom: nextProps.route.zoom,
                builder: ChartPanel.createBuilder(nextProps.route.zoom, this.state.graphType)
            });
        }
    }

    changeType(newType: string) {
        this.setState({
            graphType: newType,
            builder: ChartPanel.createBuilder(this.state.zoom, newType)
        });
    }

    static createBuilder(zoom: string, graphType: string): GraphBuilder {
        console.info(`Rebuilding graph for zoom level: ${zoom} and type: ${graphType}`);
        if (graphType === DISTANCE) {
            return ChartPanel.buildBarGraph(zoom, [{
                id: "distance",
                name: "Distance",
                provider: (a: Activity) => a.distance,
                format: (value: number) => formatKm(value),
                secondY: false
            }]);
        } else if (graphType === DURATION) {
            return ChartPanel.buildBarGraph(zoom, [{
                id: "duration",
                name: "Duration",
                provider: (a: Activity) => a.duration,
                format: (value: number) => formatHourMinutes(value),
                secondY: false
            }]);
        } else if (graphType === AVERAGE_SPLIT_TIME) {
            return ChartPanel.buildLineGraph(zoom, [{
                id: "splitTime",
                name: "Avg. Split Time",
                provider: (a: Activity) => 1000 * a.duration / a.distance,
                aggregator: "AVG",
                format: (value: number) => formatMinuteSeconds(value),
                secondY: false
            }]);
        } else {
            throw new Error("Illegal graph type: " + graphType);
        }
    }

    static buildBarGraph(zoom: string, series: Array<GraphSeriesBuilder>): GraphBuilder {
        return {
            type: "bar",
            time: false,
            x: ChartPanel.buildAxis(zoom),
            series: series
        };
    }

    static buildLineGraph(zoom: string, series: Array<GraphSeriesBuilder>): GraphBuilder {
        return {
            type: "line",
            time: false,
            x: ChartPanel.buildAxis(zoom),
            series: series
        };
    }

    static buildAxis(zoom: string): GraphAxisBuilder {
        if (zoom === "year") {
            return {
                id: "month",
                name: "Month",
                provider: (a: Activity) => a.date.substr(0, 7),
                format: (value: number) => "" + value,
                values: getPreviousMonths(12)
            };
        } else if (zoom === "month") {
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
        console.debug(`Date ${d.toDateString()} -> ${s}`);
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
