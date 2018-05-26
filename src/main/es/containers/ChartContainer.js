// @flow
"use strict";

import React from "react";
import {Alert, ControlLabel, Form, FormControl, FormGroup} from "react-bootstrap";
import * as redux from "react-redux";
import type {GraphBuilder} from "../types/Types";
import type {AppState} from "../types/AppState";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import C3Graph from "../components/C3Graph";
import * as graphBuilderHelper from "../data/graphBuilderHelper";

type ChartContainerProps = {
    selectedInterval: string,
    selectedMeasure: string,
    selectedGrouping: string,
    chartData: mixed[][],
    error: ?Error,
    fetchChartData: () => void,
    updateChartInterval: (interval: string) => void,
    updateChartMeasure: (measure: string) => void,
    updateChartGrouping: (grouping: string) => void
};

type ChangeEvent = { target: { value: string } };

export class ChartContainer extends React.Component<ChartContainerProps> {

    render() {
        // TODO :
        // - time range (last year, last month, etc)
        // - precision (year, month, week, day)
        // - metrics
        // - grouping
        // (time range and precision can be handle together)

        // Examples:
        // - average duration per month over the last 12 months
        // - cumulative distance since the start of the data
        // - average speed by temperature over the last 5 years

        // Fields:
        // - Interval (drop down)
        // - Measure (drop down)
        // - Group by (drop down)

        const INTERVALS = [
            {id: "last12Months", label: "Last 12 months"},
            {id: "all", label: "Since beginning"},
        ];

        // TODO : aggregate?
        const MEASURES = [
            {id: "distance", label: "Distance"},
            {id: "duration", label: "Duration"},
            {id: "time1km", label: "Time for 1km"},
            {id: "speed", label: "Speed (km/h)"}
        ];

        // TODO : this is not grouping, this is what we put on the X axis...
        const GROUPINGS = [
            {id: "", label: "Time"},
            {id: "temperature", label: "Temperature"},
            {id: "city", label: "City"}
        ];

        // TODO : this forces the C3 graph to be generated, which is inefficient
        // but I can't easily use a reducer because it depends on multiple parts of the state.
        // We should optimize either this component or C3Graph to handle that case 
        const graphBuilder: GraphBuilder = graphBuilderHelper.createBuilder(
            this.props.selectedInterval, this.props.selectedMeasure, this.props.selectedGrouping
        );

        return (
            <div className="ChartContainer">
                <Form inline>
                    {ChartContainer.createSelectField(
                        "ChartContainerInterval",
                        "Interval",
                        this.props.selectedInterval,
                        INTERVALS,
                        this.onIntervalChange
                    )}
                    {ChartContainer.createSelectField(
                        "ChartContainerMeasure",
                        "Measure",
                        this.props.selectedMeasure,
                        MEASURES,
                        this.onMeasureChange
                    )}
                    {ChartContainer.createSelectField(
                        "ChartContainerGrouping",
                        "Group By",
                        this.props.selectedGrouping,
                        GROUPINGS,
                        this.onGroupingChange
                    )}
                </Form>

                {this.props.error
                    ? <Alert bsStyle="danger"><h4>Error</h4>{this.props.error.toString()}</Alert>
                    : <C3Graph id="chartGoesHere" builder={graphBuilder} rows={this.props.chartData}/>}

            </div>
        );
    }

    componentDidMount() {
        this.props.fetchChartData();
    }

    onIntervalChange = (event: ChangeEvent) => {
        const value = event.target.value;
        console.log("Interval -> " + value);
        this.props.updateChartInterval(value);
    };

    onMeasureChange = (event: ChangeEvent) => {
        const value = event.target.value;
        console.log("Measure -> " + value);
        this.props.updateChartMeasure(value);
    };

    onGroupingChange = (event: ChangeEvent) => {
        const value = event.target.value;
        console.log("Grouping -> " + value);
        this.props.updateChartGrouping(value);
    };

    static createSelectField(id: string, label: string, value: string, options: { id: string, label: string }[], onChange: (any) => void) {
        return (
            <FormGroup key={id} controlId={id}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl id={id} componentClass="select" value={value} onChange={onChange}>
                    {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </FormControl>
            </FormGroup>
        );
    }
}

function mapStateToProps(state: AppState): $Shape<ChartContainerProps> {
    return {
        selectedInterval: state.chartInterval,
        selectedMeasure: state.chartMeasure,
        selectedGrouping: state.chartGrouping,
        chartData: state.chartData,
        error: state.error,
    };
}

function mapDispatchToProps(dispatch: Dispatch): $Shape<ChartContainerProps> {
    return {
        fetchChartData: () => dispatch(actions.fetchChartData()),
        updateChartInterval: x => dispatch(actions.updateChartInterval(x)),
        updateChartMeasure: x => dispatch(actions.updateChartMeasure(x)),
        updateChartGrouping: x => dispatch(actions.updateChartGrouping(x))
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(ChartContainer);
