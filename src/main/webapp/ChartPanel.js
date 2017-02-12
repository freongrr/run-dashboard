// @flow
/* eslint no-console: ["off"] */
"use strict";
import type {GraphBuilder} from "./Types";
import React from "react";
import {Nav, NavItem, Form, FormGroup, ControlLabel, FormControl, Alert} from "react-bootstrap";
import type {Subscription} from "./DataStore";
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
    // TODO : move out of the state, we can generate in in render()
    builder: GraphBuilder,
    rows: number[][],
    error: ?Error
};

// TODO : fetch these fron the server too!

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
    {
        id: "last12MonthsVsPrevious12Months",
        label: "Comparison with previous 12 months",
        category: "vsPreviousPeriod"
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
        category: "vsPreviousPeriod"
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

    subscription: Subscription;

    constructor(props: ChartPanelProps) {
        super(props);

        const initialZoom = props.route.zoom;
        const initialTypes = GRAPH_TYPES[initialZoom];
        const initialGraphType = initialTypes[0];
        const initialBuilder = ChartPanel.createBuilder(initialGraphType);

        // TODO : store/read the chart type in the route
        this.state = {
            zoom: initialZoom,
            graphTypes: initialTypes,
            graphType: initialGraphType,
            builder: initialBuilder,
            rows: [],
            error: null
        };
    }

    render() {
        return (
            <div>
                <div className="dashboard-graph">

                    {/*TODO : loop on all types*/}
                    <Nav bsStyle="tabs" activeKey={this.state.zoom}>
                        {/*HACK - I can't use Link here because it put a <a> inside a <a> ...*/}
                        <NavItem eventKey={LAST_12_MONTHS} href="/#/Last12Months">Past 12 Months</NavItem>
                        <NavItem eventKey={LAST_30_DAYS} href="/#/Last30Days">Past 30 Days</NavItem>
                    </Nav>

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

                    { /* TODO : overlay? */
                        this.state.error
                            ? <Alert bsStyle="danger"><h4>Error</h4>{this.state.error.toString()}</Alert>
                            : <C3Graph id="chartGoesHere" builder={this.state.builder} rows={this.state.rows}/> }
                </div>
            </div>
        );
    }

    componentDidMount() {
        // Subscribe once to activity updates
        // HACK - I would not need to do that if the server could push updates to the graph
        this.props.route.dataStore.subscribe("activities", (activities, e) => {
            if (!e) {
                this.refreshData();
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
                builder: ChartPanel.createBuilder(newGraphType)
            }, () => this.subscribe());
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
                builder: ChartPanel.createBuilder(graphType)
            }, () => this.subscribe());
        }
    }

    refreshData() {
        if (this.subscription) {
            this.subscription.refresh();
        } else {
            this.subscribe();
        }
    }

    subscribe() {
        // TODO : subscribe once refresh using different parameters
        // e.g.: subscription = store.subscribe("foo", {...});
        //       subscription.refresh({...});
        //       subscription.cancel();

        if (this.subscription) {
            this.subscription.cancel();
        }

        // TODO : it may work better to pass 2 axises instead of a graph type:
        // e.g. duration, time, avg. split time, temperature, heart bpm
        // It would lead to interesting combos:
        // - avg. split time over distance
        // - time over temperature
        //
        // The problems are:
        // - we still need to limit the data (e.g. last 12 months / forever) 
        // - comparison graphs don't work (or would have to be handled differently) 

        const graphTypeId = this.state.graphType.id;
        this.subscription = this.props.route.dataStore.subscribe("graph/" + graphTypeId, (rows, e) => {
            if (rows) {
                this.setState({
                    rows: rows,
                    error: null
                });
            } else if (e) {
                this.setState({
                    error: e
                });
            }
        });
    }

    static createBuilder(graphType: GraphType): GraphBuilder {
        console.info("Rebuilding graph: " + graphType.id);

        const monthAxis = {
            name: "Month",
            format: (value: number) => "" + value
        };

        const dayAxis = {
            name: "Day",
            format: (value: number) => "" + value
        };

        const distanceSeries = {
            name: "Distance",
            format: (value: number) => formatKm(value),
            secondY: false
        };

        const durationSeries = {
            name: "Duration",
            format: (value: number) => formatHourMinutes(value),
            secondY: false
        };

        const splitTimeSeries = {
            name: "Avg. Split Time",
            format: (value: number) => formatMinuteSeconds(value),
            secondY: false
        };

        if (graphType.id === "last12MonthsDistance") {
            return {
                type: "bar",
                time: false,
                x: monthAxis,
                series: [distanceSeries]
            };
        } else if (graphType.id === "last30DaysDistance") {
            return {
                type: "bar",
                time: true,
                x: dayAxis,
                series: [distanceSeries]
            };
        } else if (graphType.id === "last12MonthsDuration") {
            return {
                type: "bar",
                time: false,
                x: monthAxis,
                series: [durationSeries]
            };
        } else if (graphType.id === "last30DaysDuration") {
            return {
                type: "bar",
                time: true,
                x: dayAxis,
                series: [durationSeries]
            };
        } else if (graphType.id === "last12MonthsSplitTime") {
            return {
                type: "line",
                time: false,
                x: monthAxis,
                series: [splitTimeSeries]
            };
        } else if (graphType.id === "last30DaysSplitTime") {
            return {
                type: "line",
                time: true,
                x: dayAxis,
                series: [splitTimeSeries]
            };
        } else if (graphType.id === "last12MonthsVsPrevious12Months") {
            return {
                type: "bar",
                time: false,
                x: {
                    id: "cat",
                    name: "Categories",
                    format: (value: number) => "" + value
                },
                series: [{
                    name: "Diff",
                    format: (value: number) => "" + value,
                    secondY: false
                }]
            };
        } else {
            throw new Error("Illegal graph type: " + graphType.id);
        }
    }
}
