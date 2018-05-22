// @flow
"use strict";

import React from "react";
import {Button, ButtonToolbar, Glyphicon, PageHeader} from "react-bootstrap";
import * as redux from "react-redux";
import ActivityTable from "../components/ActivityTable";
import type {Activity} from "../types/Types";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import type {AppState} from "../types/AppState";

type DashboardProps = {
    activities: Activity[],
    fetchActivities: () => void
};

export class Dashboard extends React.Component<DashboardProps> {

    render() {
        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="stats"/> Dashboard
                </PageHeader>

                <div className="dashboard-graph">
                    TODO : add graph back
                </div>

                <PageHeader className="subTitle">
                    <Glyphicon glyph="list"/> Recent Activities
                </PageHeader>

                <ActivityTable activities={this.props.activities}/>

                <ButtonToolbar>
                    <Button bsStyle="primary" href="/#/activities">
                        <Glyphicon glyph="list"/> View/Add
                    </Button>
                </ButtonToolbar>

            </div>
        );
    }

    componentDidMount() {
        // TODO : move that up (in Root?) to avoid doing it twice
        // or have 2 different actions (fetch all and fetch recent)
        this.props.fetchActivities();
    }
}

function mapStateToProps(state: AppState): $Shape<DashboardProps> {
    return {
        activities: state.activities.slice(0, 10)
    };
}

function mapDispatchToProps(dispatch: Dispatch): $Shape<DashboardProps> {
    return {
        fetchActivities: () => dispatch(actions.fetchActivitiesIfNeeded())
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);
