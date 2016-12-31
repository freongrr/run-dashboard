// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity} from "./Types";
import React from "react";
import {Table, DropdownButton, MenuItem, Glyphicon} from "react-bootstrap";

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
                            <td>{formatDuration(a.duration)}</td>
                            <td>{formatDistance(a.distance)}</td>
                            <td>{formatSplit(1000 * a.duration / a.distance)}</td>
                            <td>{actionMenu}</td>
                        </tr>;
                    })
                }
                </tbody>
            </Table>
        );
    }
}

function formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor(durationInSeconds / 60);

    let interval = "";

    if (hours > 0) {
        interval += hours + " hour ";
    }

    interval += minutes + " min ";

    return interval;
}


function formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
        return distanceInMeters + " m";
    } else {
        const x = Math.round(distanceInMeters / 100) / 10;
        if (x === Math.round(x)) {
            return x + ".0 km";
        } else {
            return x + " km";
        }
    }
}

function formatSplit(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.round(durationInSeconds % 60);

    let interval = "";

    if (minutes > 0) {
        interval += minutes + " min ";
    }

    if (minutes === 0 || seconds > 0) {
        interval += seconds + " sec";
    }

    return interval;
}
