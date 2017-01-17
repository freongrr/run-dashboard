// @flow
/* eslint no-console: ["off"] */
"use strict";
import type {Activity, GraphBuilder} from "./Types";
import React from "react";
import {Nav, NavItem} from "react-bootstrap";
import DataStore from "./DataStore";
import C3Graph from "./C3Graph";
import {formatHourMinutes} from "./TimeUtils";
import {formatKm} from "./DistanceUtils";

type ChartPanelProps = {
    route: {
        dataStore: DataStore,
        zoom: string
    }
};

type ChartPanelState = {
    builder: GraphBuilder,
    activities: Activity[]
};

export default class ChartPanel extends React.Component {
    props: ChartPanelProps;
    state: ChartPanelState;

    constructor(props: ChartPanelProps) {
        super(props);

        const hardCodedBuilder = {
            type: "bar",
            time: false,
            x: {
                id: "month",
                name: "Month",
                provider: (a: Activity) => a.date.substr(0, 7),
                format: (value: number) => "" + value,
                values: getPreviousMonths(12)
            },
            series: [{
                id: "duration",
                name: "Duration",
                provider: (a: Activity) => a.duration,
                format: (value: number) => formatHourMinutes(value),
                secondY: false
            }, {
                id: "distance",
                name: "Distance",
                provider: (a: Activity) => a.distance,
                format: (value: number) => formatKm(value),
                secondY: true
            }]
        };


        // TODO : use the route location to update the zoom, builder, etc?
        this.state = {
            builder: hardCodedBuilder,
            activities: []
        };
    }

    render() {
        return (
            <div>
                <Nav bsStyle="tabs" activeKey={this.props.route.zoom}>
                    {/*HACK - I can't use Link here because it put a <a> inside a <a> ...*/}
                    <NavItem eventKey="year" href="/#/Year">Year</NavItem>
                    <NavItem eventKey="month" href="/#/Month">Month</NavItem>
                    <NavItem eventKey="week" href="/#/Week">Week</NavItem>
                </Nav>

                <div className="dashboard-graph">
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

    // Graph samples

    // monthGraphBuilder(): GraphBuilder {
    //     return {
    //         type: "bar",
    //         time: false,
    //         x: {
    //             id: "month",
    //             name: "Month",
    //             provider: (a: Activity) => a.date.substr(0, 7),
    //             format: (value: number) => "" + value,
    //             values: getPreviousMonths(12)
    //         },
    //         series: [{
    //             id: "duration",
    //             name: "Duration",
    //             provider: (a: Activity) => a.duration,
    //             format: (value: number) => formatHourMinutes(value),
    //             secondY: false
    //         }, {
    //             id: "distance",
    //             name: "Distance",
    //             provider: (a: Activity) => a.distance,
    //             format: (value: number) => formatKm(value),
    //             secondY: true
    //         }]
    //     };
    // }
    //
    // lineGraphBuilder(): GraphBuilder {
    //     return {
    //         type: "line",
    //         time: true,
    //         x: {
    //             id: "date",
    //             name: "Date",
    //             provider: (a: Activity) => a.date,
    //             format: (value: number) => "" + value
    //         },
    //         series: [{
    //             id: "duration",
    //             name: "Duration",
    //             provider: (a: Activity) => a.duration,
    //             format: (value: number) => formatHourMinutes(value),
    //             secondY: false
    //         }, {
    //             id: "distance",
    //             name: "Distance",
    //             provider: (a: Activity) => a.distance,
    //             format: (value: number) => formatKm(value),
    //             secondY: true
    //         }]
    //       };
    // }
    //
    // averageSplitTimePerMonthGraphBuilder(): GraphBuilder {
    //     return {
    //         type: "line",
    //         time: false,
    //         x: {
    //             id: "month",
    //             name: "Month",
    //             provider: (a: Activity) => a.date.substr(0, 7),
    //             format: (value: number) => "" + value,
    //             values: getPreviousMonths(24)
    //         },
    //         series: [{
    //             id: "splitTime",
    //             name: "Avg. Split Time",
    //             provider: (a: Activity) => 1000 * a.duration / a.distance,
    //             aggregator: "AVG",
    //             format: (value: number) => formatMinuteSeconds(value),
    //             secondY: false
    //         }]
    //     };
    // }
}

function getPreviousMonths(n) {
    const months = [];
    const d = new Date();
    for (let x = 0; x < n; x++) {
        const realMonth = d.getMonth() + 1;
        months.push(d.getFullYear() + "-" + (realMonth < 10 ? "0" : "") + realMonth);
        d.setMonth(d.getMonth() - 1);
    }
    return months;
}
