// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import React from "react";
import update from "react-addons-update";
import {PageHeader, Grid, Row, Col, ButtonToolbar, Button, Glyphicon} from "react-bootstrap";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import {parseDuration, formatHourMinutes} from "./TimeUtils";
import {parseDistance, formatKm} from "./DistanceUtils";

type DashboardState = {
    activities: Array<Activity>,
    editedActivity: ?ActivityBuilder,
    error: ?Error
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
            editedActivity: null,
            error: null
        };
    }

    render() {
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

                <ActivityTable activities={this.state.activities} editHandler={(a) => this.editActivity(a)}/>

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
                                   saveHandler={(a) => this.saveActivity(a)}/> }

                {this.state.error && <ErrorDialog error={this.state.error}/>}
            </div>
        );
    }

    refresh() {
        // TODO : query the server
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

    editActivity(activity: Activity) {
        this.setState({
            editedActivity: {
                id: activity.id,
                date: activity.date,
                duration: formatHourMinutes(activity.duration),
                distance: formatKm(activity.distance)
            }
        });
    }

    saveActivity(builder: ActivityBuilder) {
        // TODO : send it to the server
        console.info("Saving", builder);

        try {
            const index = this.findIndexOfActivity(builder);

            const activity: Activity = {
                id: builder.id ? builder.id : ("" + Math.random()),
                date: builder.date,
                duration: parseDuration(builder.duration),
                distance: parseDistance(builder.distance)
            };

            if (index > -1) {
                console.debug(`Replacing activity at index ${index}`);
                this.setState(update(this.state, {activities: {$splice: [[index, 1, activity]]}}));
            } else {
                console.debug("Adding new activity");
                this.setState(update(this.state, {activities: {$push: [activity]}}));
            }
        } catch (e) {
            this.setState({error: e});
        } finally {
            this.setState({editedActivity: null});
        }
    }

    findIndexOfActivity(activity: Activity | ActivityBuilder) {
        let index = -1;
        if (activity.id !== null) {
            this.state.activities.forEach((a, i) => {
                if (a.id === activity.id) {
                    index = i;
                }
            });
        }
        return index;
    }
}
