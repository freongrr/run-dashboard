// @flow
"use strict";
// TODO : import c3 here?
import type {GraphBuilder, GraphSeriesBuilder} from "./Types";
import React from "react";

type C3GraphProps = {
    id: string,
    builder: GraphBuilder,
    data: any[]
};

const SUM = (values: number[]) => values.reduce((a, b) => a + b, 0);
const AVG = (values: number[]) => SUM(values) / values.length;

export default class C3Graph extends React.Component {
    props: C3GraphProps;

    constructor(props: C3GraphProps) {
        super(props);
    }

    render() {
        return (
            <div id={this.props.id}/>
        );
    }

    shouldComponentUpdate(nextProps: C3GraphProps) {
        return nextProps.builder !== this.props.builder || nextProps.data !== this.props.data;
    }

    componentDidUpdate() {
        const builder = this.props.builder;

        const categories = this.extractCategories();

        const axes = {};
        builder.series.forEach(s => {
            axes[s.id] = s.secondY ? "y2" : "y";
        });

        const names = {};
        builder.series.forEach(s => {
            names[s.id] = s.name;
        });

        // TODO : only if the data has really changed...
        window.c3.generate({
            bindto: "#" + this.props.id,
            data: {
                type: builder.type,
                x: builder.x.id,
                rows: this.buildRows(categories),
                keys: {
                    x: builder.x.id,
                    value: builder.series.map(s => s.id),
                },
                axes: axes,
                names: names
            },
            axis: {
                x: this.buildXAxis(),
                y: this.buildYAxis(s => !s.secondY),
                y2: this.buildYAxis(s => s.secondY)
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        let formatted = value;
                        builder.series.forEach(s => {
                            if (s.id === id) {
                                formatted = s.format(value);
                            }
                        });
                        return formatted;
                    }
                }
            },
            line: {
                connectNull: true
            },
            // grid: {
            //     y: {
            //         lines: [
            //             {value: 240, text: '4 min / km'},
            //             {value: 300, text: '5 min / km'},
            //             {value: 360, text: '6 min / km'},
            //         ]
            //     }
            // }
        });
    }

    extractCategories() {
        const categories = new Set();
        if (this.props.builder.x.values) {
            this.props.builder.x.values.forEach(x => categories.add(x));
        } else {
            this.props.data.forEach((d) => {
                categories.add(this.props.builder.x.provider(d));
            });
        }
        return categories;
    }

    buildRows(categories: Set<string>) {
        const headers = [this.props.builder.x.id].concat(this.props.builder.series.map(s => s.id));
        const rows = [headers];

        categories.forEach((category) => {
            const groupedActivities = this.props.data.filter((d) => category === this.props.builder.x.provider(d));
            const row = [category];
            this.props.builder.series.forEach(s => {
                const groupedValues = groupedActivities.map((a) => s.provider(a));
                const aggregatedValue = C3Graph.aggregatorFunction(s)(groupedValues);
                row.push(aggregatedValue);
            });
            rows.push(row);
        });
        return rows;
    }

    buildXAxis() {
        const xAxis = {};

        if (this.props.builder.time) {
            xAxis.type = "timeseries";
            // TODO : customize
            xAxis.tick = {
                format: "%Y-%m-%d",
                culling: {
                    max: 8
                }
            };
        } else {
            xAxis.type = "category";
        }

        return xAxis;
    }

    buildYAxis(seriesFilter: (GraphSeriesBuilder) => boolean) {
        const series = this.props.builder.series.filter(seriesFilter);

        const yAxis = {};

        if (series.length > 0) {
            yAxis.show = true;
        }

        if (series.length === 1) {
            yAxis.tick = {
                format: series[0].format
            };
        }

        return yAxis;
    }

    static aggregatorFunction(series: GraphSeriesBuilder): (values: number[]) => number {
        if (series.aggregator === "SUM") {
            return SUM;
        } else if (series.aggregator === "AVG") {
            return AVG;
        } else if (typeof series.aggregator === "function") {
            return series.aggregator;
        } else {
            return SUM;
        }
    }
}
