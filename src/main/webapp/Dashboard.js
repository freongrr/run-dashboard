// @flow
"use strict";

import React from "react";
import {
    PageHeader,
    Grid,
    Row,
    Col,
    Table,
    ButtonToolbar,
    Button,
    Glyphicon,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Modal,
    DropdownButton,
    MenuItem
} from "react-bootstrap";

function FieldGroup(props: {id: string, label: string, type: string, help?: string, placeholder?: string}) {
    return (
        <FormGroup controlId={props.id}>
            <ControlLabel>{props.label}</ControlLabel>
            <FormControl id={props.id} type={props.type} placeholder={props.placeholder}/>
            {props.help && <HelpBlock>{props.help}</HelpBlock>}
        </FormGroup>
    );
}

export default class Dashboard extends React.Component {

    constructor(props: any) {
        super(props);
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
                {/*TODO : fix the dropdowns when the table is 'responsive' */}
                <Table hover>
                    <thead>
                    <tr><th>Date</th><th>Duration</th><th>Distance</th><th>Split time (1 km)</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                    <tr><td>2016-12-17</td><td>42 min</td><td>8.5 km</td><td>4 min 59 sec</td><td>{actionMenu}</td></tr>
                    <tr><td>2016-12-11</td><td>35 min</td><td>7.0 km</td><td>5 min 6 sec</td><td>{actionMenu}</td></tr>
                    <tr><td>2016-10-22</td><td>56 min</td><td>11.5 km</td><td>4 min 54 sec</td><td>{actionMenu}</td></tr>
                    <tr><td>2016-10-06</td><td>25 min</td><td>5.5 km</td><td>4 min 41 sec</td><td>{actionMenu}</td></tr>
                    </tbody>
                </Table>

                <ButtonToolbar>
                    <Button bsStyle="primary" onClick={() => {/*TODO*/}}>
                        <Glyphicon glyph="refresh"/> Refresh
                    </Button>
                    <Button bsStyle="primary" onClick={() => {/*TODO*/}}>
                        <Glyphicon glyph="plus"/> Add
                    </Button>
                </ButtonToolbar>

                <Modal show={false}>
                    <Modal.Header>
                        <Modal.Title>Add a new activity</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form>
                            <FieldGroup id="newActivityDate" type="date" label="Date"/>
                            <FieldGroup id="newActivityDuration" type="text" label="Duration"
                                        placeholder={"e.g. \"1 hour\" or \"45 min\""}/>
                            <FieldGroup id="newActivityDistance" type="text" label="Distance"
                                        placeholder={"e.g. \"10.5 km\""} />
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button>Cancel</Button>
                        <Button bsStyle="primary">Add Activity</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
