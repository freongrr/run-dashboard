// @flow
"use strict";
// TODO : import c3 here?
import type {GraphBuilder} from "./Types";
import React from "react";

type C3GraphProps = {
    id: string,
    builder: GraphBuilder,
    rows: any[][]
};

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
        return nextProps.builder !== this.props.builder || nextProps.rows !== this.props.rows;
    }

    componentDidUpdate() {
        const builder = this.props.builder;

        const series_ids = [];
        const series_axes = {};
        const series_names = {};
        const series_formats = {};
        const headers = ["x"];

        builder.series.forEach((s, i) => {
            const id = "series_" + (i + 1);
            series_ids.push(id);
            series_axes[id] = s.secondY ? "y2" : "y";
            series_names[id] = s.name;
            series_formats[id] = s.format;
            headers.push(id);
        });

        const rows = [headers].concat(this.props.rows);

        // TODO : only if the data has really changed...
        window.c3.generate({
            bindto: "#" + this.props.id,
            data: {
                type: builder.type,
                x: "x",
                rows: rows,
                keys: {
                    x: "x",
                    value: series_ids,
                },
                axes: series_axes,
                names: series_names
            },
            axis: {
                x: this.buildXAxis(),
                y: this.buildYAxis(s => !s.secondY),
                y2: this.buildYAxis(s => s.secondY)
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        if (series_formats[id]) {
                            return series_formats[id](value);
                        } else {
                            return value;
                        }
                    }
                }
            },
            // line: {
            //     connectNull: true
            // },
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

    buildXAxis() {
        const xAxis = {};

        // TODO : this does not use the name or formatter of this.props.builder.x

        if (this.props.builder.time) {
            xAxis.type = "timeseries";
            xAxis.tick = {
                format: "%Y-%m-%d"
            };
        } else {
            xAxis.type = "category";
            // Tick count/culling does not work well with categories
            // (because the ticks fall in between...)
            xAxis.tick = {
                culling: {
                    max: 13
                }
            };
        }

        return xAxis;
    }

    buildYAxis(seriesFilter: (any) => boolean) {
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
}
