// @flow
"use strict";

import React from "react";
import {Glyphicon, PageHeader} from "react-bootstrap";
import * as redux from "react-redux";
import EditableActivityTable from "./EditableActivityTable";

export class Dashboard extends React.Component<{}> {

    render() {
        return (
            <div>
                <PageHeader>
                    <Glyphicon glyph="stats"/> Stats
                </PageHeader>

                <div className="dashboard-graph">
                    {/* TODO : add graph back */}
                </div>

                <PageHeader className="subTitle">
                    <Glyphicon glyph="list"/> Activities
                </PageHeader>

                <EditableActivityTable/>
            </div>
        );
    }
}

export default redux.connect()(Dashboard);
