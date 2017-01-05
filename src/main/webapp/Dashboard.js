// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {Activity, ActivityBuilder} from "./Types";
import React from "react";
import update from "react-addons-update";
import {PageHeader, Grid, Row, Col, Nav, NavItem, ButtonToolbar, Button, Glyphicon} from "react-bootstrap";
import {Link} from "react-router";
import RPC from "./RPC";
import ActivityTable from "./ActivityTable";
import ActivityDialog from "./ActivityDialog";
import ErrorDialog from "./ErrorDialog";
import DeleteDialog from "./DeleteDialog";
import {parseDuration, formatHourMinutes} from "./TimeUtils";
import {parseDistance, formatKm} from "./DistanceUtils";

type DashboardProps = {
    rpc: RPC,
    // graph: React.Component<*>
};

type DashboardState = {
    activities: Array<Activity>,
    editedActivity: ?ActivityBuilder,
    deletedActivity: ?Activity,
    error: ?Error
};

export default class Dashboard extends React.Component {
    props: DashboardProps;
    state: DashboardState;

    constructor(props: DashboardProps) {
        super(props);

        this.state = {
            activities: [],
            editedActivity: null,
            deletedActivity: null,
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
                    <Row>
                        <Col md={12}>
                            <Nav bsStyle="tabs" activeKey="m" onSelect={() => {/* TODO */}}>
                                <NavItem eventKey="y"><Link to={"/Year"}>Year</Link></NavItem>
                                <NavItem eventKey="m"><Link to={"/Month"}>Month</Link></NavItem>
                                <NavItem eventKey="w"><Link to={"/Week"}>Week</Link></NavItem>
                            </Nav>
                        </Col>
                    </Row>
                    {/*{this.props.graph}*/}
                </Grid>

                <PageHeader>
                    {/* TODO : the browser complains about having a h3 in a h1... */}
                    <h3><Glyphicon glyph="list"/> Activities</h3>
                </PageHeader>

                <ActivityTable activities={this.state.activities}
                               editHandler={(a) => this.editActivity(a)}
                               deleteHandler={(a) => this.deleteActivity(a)}/>

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
                                   onDismiss={() => this.setState({editedActivity: null})}
                                   onSave={(a) => this.saveActivity(a)}/> }

                {this.state.error
                && <ErrorDialog error={this.state.error}
                                onDismiss={() => this.setState({error: null})}/>}

                {this.state.deletedActivity
                && <DeleteDialog activity={this.state.deletedActivity}
                                 onDismiss={() => this.cancelDeleteActivity()}
                                 onConfirm={() => this.doDeleteActivity()}/>}
            </div>
        );
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        this.props.rpc.get("/activities")
            .then((activities) => {
                this.setState({
                    activities: activities,
                    error: null
                });
            })
            .catch((e) => {
                // TODO : this should be cleared when the dialog is dismissed (just like the delete dialog)
                this.setState({error: e});
            });
    }

    addActivity() {
        // TODO : this should be cleared when the dialog is dismissed (just like the delete dialog)
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
        // TODO : this should be cleared when the dialog is dismissed (just like the delete dialog)
        this.setState({
            editedActivity: {
                id: activity.id,
                date: activity.date,
                duration: formatHourMinutes(activity.duration),
                distance: formatKm(activity.distance)
            }
        });
    }

    deleteActivity(activity: Activity) {
        // TODO : it would be better to do it anyway and let the user undo it
        this.setState({deletedActivity: activity});
    }

    cancelDeleteActivity() {
        this.setState({deletedActivity: null});
    }

    doDeleteActivity() {
        if (this.state.deletedActivity) {
            const index = this.findIndexOfActivity(this.state.deletedActivity);
            if (index > -1) {
                console.debug(`Deleting activity at index ${index}`);
                this.setState(update(this.state, {activities: {$splice: [[index, 1]]}}));
                this.setState({deletedActivity: null});
            }
        }
    }

    saveActivity(builder: ActivityBuilder) {
        console.info("Saving", builder);

        // TODO : it would be better to generate the id on the server!
        const activity = {
            id: builder.id ? builder.id : ("" + Math.round(1000 * Math.random())),
            date: builder.date,
            duration: parseDuration(builder.duration),
            distance: parseDistance(builder.distance)
        };

        this.props.rpc.post("/activities", {activity: activity})
            .then(() => this.updateState(activity))
            .then(() => this.setState({editedActivity: null}))
            .catch((e) => this.setState({error: e, editedActivity: null}));
    }

    updateState(activity: Activity) {
        const index = this.findIndexOfActivity(activity);
        if (index > -1) {
            console.debug(`Replacing activity at index ${index}`);
            this.setState(update(this.state, {activities: {$splice: [[index, 1, activity]]}}));
        } else {
            console.debug("Adding new activity");
            this.setState(update(this.state, {activities: {$push: [activity]}}));
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
