// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import React from "react";
import ActivityDialog from "./ActivityDialog";
import {
    PageHeader,
    Grid,
    Row,
    Col,
    Table,
    ButtonToolbar,
    Button,
    Glyphicon,
    DropdownButton,
    MenuItem
} from "react-bootstrap";

type DashboardState = {
    activities: Array<Activity>,
    editedActivity: ?ActivityBuilder
};

export default class Dashboard extends React.Component {
    state: DashboardState;

    constructor(props: {}) {
        super(props);

        this.state = {
            activities: [{
                id: "1",
                date: "2016-12-17",
                duration: 2544,
                distance: 8500
            }, {
                id: "2",
                date: "2016-12-11",
                duration: 2145,
                distance: 7000
            }, {
                id: "3",
                date: "2016-10-22",
                duration: 3391,
                distance: 11500
            }, {
                id: "4",
                date: "2016-10-06",
                duration: 1547,
                distance: 5500
            }],
            editedActivity: null
        };
    }

    render() {
        const actionMenu =
            <DropdownButton bsSize="xsmall" title={<Glyphicon glyph="cog"/>} id="foo">
                <MenuItem eventKey="1">Edit</MenuItem>
                <MenuItem eventKey="2">Delete</MenuItem>
            </DropdownButton>;

        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="stats"/> Stats
                </PageHeader>

                <Grid>
                    <Row className="show-grid">
                        <Col xs={12} md={5}>
                            <div style={{minHeight: "200px"}}>Month Graph</div>
                        </Col>
                        <Col xs={12} md={5}>
                            <div style={{minHeight: "200px"}}>Year Graph</div>
                        </Col>
                    </Row>
                </Grid>

                <PageHeader>
                    {/* TODO : the browser complains about having a h3 in a h1... */}
                    <h3><Glyphicon glyph="list"/> Activities</h3>
                </PageHeader>

                {/*TODO : add elevation, max heart beat, temperature, etc */}
                {/*TODO : fix the dropdown when the table is 'responsive' */}
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
                        this.state.activities.map(a => {
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

                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={() => this.refresh()}>
                        <Glyphicon glyph="refresh"/> Refresh
                    </Button>
                    <Button bsStyle="primary" onClick={() => this.addActivity()}>
                        <Glyphicon glyph="plus"/> Add
                    </Button>
                </ButtonToolbar>

                {this.state.editedActivity !== null
                && <ActivityDialog initialActivity={this.state.editedActivity}
                                   saveHandler={(activity) => this.saveActivity(activity)}/> }
            </div>
        );
    }

    refresh() {
        // TODO
    }

    addActivity() {
        this.setState({
            editedActivity: {
                id: null,
                date: "",
                duration: "",
                distance: ""
            }
        });
    }

    saveActivity(activity: ActivityBuilder) {
        // TODO 
        console.info("Save", activity);
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
