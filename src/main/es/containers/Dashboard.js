// @flow
"use strict";

import React from "react";
import Glyphicon from "react-bootstrap/lib/Glyphicon";
import PageHeader from "react-bootstrap/lib/PageHeader";
import * as redux from "react-redux";
import ActivityTable from "../components/ActivityTable";
import type {Activity} from "../types/Types";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import type {AppState} from "../types/AppState";
import ChartContainer from "./ChartContainer";

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
                    <ChartContainer/>
                </div>

                <PageHeader className="subTitle">
                    <Glyphicon glyph="list"/> Recent Activities
                </PageHeader>

                <ActivityTable activities={this.props.activities}/>

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
        fetchActivities: () => dispatch(actions.fetchActivities())
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(Dashboard);
