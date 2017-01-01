// @flow
/* eslint no-console: ["off"] */
"use strict";

import type {ActivityBuilder} from "./Types";
import React from "react";
import update from "react-addons-update";
import {Button, FormGroup, ControlLabel, FormControl, HelpBlock, Modal} from "react-bootstrap";
import {parseDuration} from "./TimeUtils";
import {parseDistance} from "./DistanceUtils";

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
    inputs: Map<string, HTMLInputElement>;

    constructor(props: ActivityDialogProps) {
        super(props);

        this.state = {
            visible: true,
            builder: Object.assign({}, props.initialActivity)
        };

        this.inputs = new Map();
    }

    componentDidMount() {
        const dateInput = this.inputs.get("date");
        if (dateInput !== undefined) {
            dateInput.focus();
        }
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
                    {this.createField("activityDate", "date", "date", "Date", this.hasValidDate())}
                    {this.createField("activityDuration", "text", "duration", "Duration", this.hasValidDuration(), "e.g. \"1 hour\" or \"45 min\"")}
                    {this.createField("activityDistance", "text", "distance", "Distance", this.hasValidDistance(), "e.g. \"10.5 km\"")}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => this.onClose()}>Cancel</Button>
                    <Button bsStyle="primary" disabled={!this.isValid()} onClick={() => this.onSave()}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    createField(id: string, type: string, property: string, label: string, valid: boolean, placeholder: ?string, help: ?string) {
        const value = this.state.builder[property];
        const validationState = valid ? "success" : "error";
        console.debug(`Value of ${property}: ${value} (validationState: ${validationState})`);
        const changeHandle = (e: any) => {
            console.debug(`Updating property ${property} to: ${e.target.value}`);
            this.setState(update(this.state, {
                builder: {
                    $apply: (b: ActivityBuilder) => {
                        b[property] = e.target.value;
                        return b;
                    }
                }
            }));
        };
        return (
            <FormGroup controlId={id} validationState={validationState}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl id={id} type={type} value={value} placeholder={placeholder}
                             onChange={changeHandle} inputRef={ref => this.inputs.set(property, ref)}/>
                {help && <HelpBlock>{help}</HelpBlock>}
                <FormControl.Feedback />
            </FormGroup>
        );
    }

    hasValidDate(): boolean {
        return this.state.builder.date !== null && this.state.builder.date !== "";
    }

    hasValidDuration(): boolean {
        if (this.state.builder.duration !== "") {
            try {
                parseDuration(this.state.builder.duration);
                return true;
            } catch (e) {
                // 
            }
        }
        return false;
    }

    hasValidDistance(): boolean {
        if (this.state.builder.distance !== "") {
            try {
                parseDistance(this.state.builder.distance);
                return true;
            } catch (e) {
                // 
            }
        }
        return false;
    }

    isValid(): boolean {
        return this.hasValidDate() &&
            this.hasValidDuration() &&
            this.hasValidDistance();
    }

    onClose() {
        this.setState({visible: false});
    }

    onSave() {
        if (this.isValid()) {
            this.props.saveHandler(this.state.builder);
        }
    }
}
