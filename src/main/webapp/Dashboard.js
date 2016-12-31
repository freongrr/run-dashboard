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
import {parseDuration} from "./TimeUtils";
import {parseDistance} from "./DistanceUtils";

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

                <ActivityTable activities={this.state.activities}/>

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

                {this.state.error && <ErrorDialog error={this.state.error}/>}
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

    saveActivity(builder: ActivityBuilder) {
        // TODO : send it to the server
        console.info("Saving", builder);

        try {
            const activity: Activity = {
                id: builder.id ? builder.id : ("" + Math.random()),
                date: builder.date,
                duration: parseDuration(builder.duration),
                distance: parseDistance(builder.distance)
            };
            this.setState(update(this.state, {activities: {$push: [activity]}}));
        } catch (e) {
            this.setState({error: e});
        } finally {
            this.setState({editedActivity: null});
        }
    }
}
