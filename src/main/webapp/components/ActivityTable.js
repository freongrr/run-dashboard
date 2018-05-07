// @flow
"use strict";

import type {Activity} from "../types/Types";
import React from "react";
import {DropdownButton, Glyphicon, MenuItem, Table} from "react-bootstrap";
import {formatHourMinutes, formatMinuteSeconds} from "../utils/TimeUtils";
import {formatKm} from "../utils/DistanceUtils";

type ActivityTableProps = {
    activities: Array<Activity>,
    editHandler?: (Activity) => void,
    deleteHandler?: (Activity) => void
};

export default class ActivityTable extends React.Component<ActivityTableProps> {
    props: ActivityTableProps;

    constructor(props: ActivityTableProps) {
        super(props);
    }

    render() {
        // TODO : add elevation, max heart beat, temperature, etc
        // TODO : fix the dropdown when the table is 'responsive' (with <Clearfix>?)
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Duration</th>
                        <th>Distance</th>
                        <th>Split time (1 km)</th>
                        {this.props.editHandler && this.props.deleteHandler && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {this.props.activities.length === 0
                        ? ActivityTable.makeEmptyRow()
                        : this.props.activities.map(a => this.makeRow(a))}
                </tbody>
            </Table>
        );
    }

    static makeEmptyRow() {
        return <tr key="empty">
            <td colSpan={5} className="text-center text-inactive">Found nothing. Go out and run!</td>
        </tr>;
    }

    makeRow(a: Activity) {
        return <tr key={a.id}>
            <td>{a.date}</td>
            <td>{formatHourMinutes(a.duration)}</td>
            <td>{formatKm(a.distance)}</td>
            <td>{formatMinuteSeconds(1000 * a.duration / a.distance)}</td>
            {this.props.editHandler && this.props.deleteHandler && this.renderActions(a)}
        </tr>;
    }

    renderActions(activity: Activity) {
        return (
            <td>
                <DropdownButton bsSize="xsmall" title={<Glyphicon glyph="cog"/>} id="foo">
                    <MenuItem eventKey="edit" onSelect={() => this.onEdit(activity)}>Edit</MenuItem>
                    <MenuItem eventKey="delete" onSelect={() => this.onDelete(activity)}>Delete</MenuItem>
                </DropdownButton>
            </td>
        );
    }

    onEdit(a: Activity) {
        this.props.editHandler && this.props.editHandler(a);
    }

    onDelete(a: Activity) {
        this.props.deleteHandler && this.props.deleteHandler(a);
    }
}
