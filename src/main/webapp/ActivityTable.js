// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity} from "./Types";
import React from "react";
import {Table, DropdownButton, MenuItem, Glyphicon} from "react-bootstrap";
import {formatHourMinutes, formatMinuteSeconds} from "./TimeUtils";
import {formatKm} from "./DistanceUtils";

type ActivityTableProps = {
    activities: Array<Activity>
};

export default class ActivityTable extends React.Component {
    props: ActivityTableProps;

    constructor(props: ActivityTableProps) {
        super(props);
    }

    render() {
        // TODO
        const actionMenu =
            <DropdownButton bsSize="xsmall" title={<Glyphicon glyph="cog"/>} id="foo">
                <MenuItem eventKey="1">Edit</MenuItem>
                <MenuItem eventKey="2">Delete</MenuItem>
            </DropdownButton>;

        // TODO : add elevation, max heart beat, temperature, etc
        // TODO : fix the dropdown when the table is 'responsive'
        return (
            <Table hover>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Distance</th>
                    <th>Split time (1 km)</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.activities.map(a => {
                        return <tr key={a.id}>
                            <td>{a.date}</td>
                            <td>{formatHourMinutes(a.duration)}</td>
                            <td>{formatKm(a.distance)}</td>
                            <td>{formatMinuteSeconds(1000 * a.duration / a.distance)}</td>
                            <td>{actionMenu}</td>
                        </tr>;
                    })
                }
                </tbody>
            </Table>
        );
    }
}
