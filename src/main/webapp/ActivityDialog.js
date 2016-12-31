// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {ActivityBuilder} from "./Types";
import React from "react";
import update from "react-addons-update";
import {Button, FormGroup, ControlLabel, FormControl, HelpBlock, Modal} from "react-bootstrap";

type ActivityDialogProps = {
    initialActivity: ActivityBuilder,
    saveHandler: (ActivityBuilder) => void
};

type ActivityDialogState = {
    visible: boolean,
    builder: ActivityBuilder
};

export default class ActivityDialog extends React.Component {
    props: ActivityDialogProps;
    state: ActivityDialogState;

    constructor(props: ActivityDialogProps) {
        super(props);

        this.state = {
            visible: true,
            builder: Object.assign({}, props.initialActivity)
        };
    }

    componentWillReceiveProps(nextProps: ActivityDialogProps) {
        const clonedActivity = Object.assign({}, nextProps.initialActivity);

        this.setState({
            visible: true,
            builder: clonedActivity
        });
    }

    render() {
        return (
            <Modal show={this.state.visible} onHide={() => this.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.props.initialActivity.id ? "Edit an activity" : "Add a new activity"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form>
                        {this.createField("activityDate", "date", "date", "Date", null)}
                        {this.createField("activityDuration", "text", "duration", "Duration", "e.g. \"1 hour\" or \"45 min\"")}
                        {this.createField("activityDistance", "text", "distance", "Distance", "e.g. \"10.5 km\"")}
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => this.onClose()}>Cancel</Button>
                    <Button bsStyle="primary" disabled={!this.isValid()} onClick={() => this.onSave()}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    createField(id: string, type: string, property: string, label: string, placeholder: ?string, help: ?string) {
        const value = this.state.builder[property];
        const validationState = ActivityDialog.isDefined(value) ? "success" : "error";
        console.debug(`Value of ${property}: ${value} (validationState: ${validationState})`);
        const changeHandle = (e: any) => {
            const newState = update(this.state, {
                builder: {
                    $apply: (b: ActivityBuilder) => {
                        console.debug(`Updating property ${property} to: ${e.target.value}`);
                        b[property] = e.target.value;
                        return b;
                    }
                }
            });
            this.setState(newState);
        };
        return (
            <FormGroup controlId={id} validationState={validationState}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl id={id} type={type} value={value} placeholder={placeholder} onChange={changeHandle}/>
                {help && <HelpBlock>{help}</HelpBlock>}
                <FormControl.Feedback />
            </FormGroup>
        );
    }

    // TODO : we need to validate distances and duration with custom functions   
    static isDefined(value: string) {
        return value !== undefined && value !== "0" && value !== "";
    }

    isValid(): boolean {
        return ActivityDialog.isDefined(this.state.builder.date) &&
            ActivityDialog.isDefined(this.state.builder.duration) &&
            ActivityDialog.isDefined(this.state.builder.distance);
    }

    onClose() {
        this.setState({visible: false});
    }

    onSave() {
        if (this.isValid()) {
            this.props.saveHandler(this.state.builder);
            this.setState({visible: false});
        }
    }
}
