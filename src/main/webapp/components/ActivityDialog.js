// @flow
"use strict";

import type {ActivityBuilder} from "../types/Types";
import React from "react";
import update from "immutability-helper";
import {Button, FormGroup, ControlLabel, FormControl, HelpBlock, Modal} from "react-bootstrap";
import {parseDuration} from "../utils/TimeUtils";
import {parseDistance} from "../utils/DistanceUtils";

type ActivityDialogProps = {
    initialActivity: ActivityBuilder,
    onDismiss: () => void,
    onSave: (ActivityBuilder) => void
};

type ActivityDialogState = {
    builder: ActivityBuilder
};

export default class ActivityDialog extends React.Component<ActivityDialogProps, ActivityDialogState> {
    props: ActivityDialogProps;
    state: ActivityDialogState;
    inputs: Map<string, HTMLInputElement>;

    constructor(props: ActivityDialogProps) {
        super(props);

        this.state = {
            builder: Object.assign({}, props.initialActivity)
        };

        // Is there a better way to focus the first input field?
        this.inputs = new Map();
    }

    componentDidMount() {
        const dateInput = this.inputs.get("date");
        if (dateInput !== undefined) {
            dateInput.focus();
        }
    }

    render() {
        return (
            <Modal show={true} onHide={() => this.props.onDismiss()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.props.initialActivity.id ? "Edit an activity" : "Add a new activity"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* TODO : this is the wrong format (i.e. DD/MM/YYYY) */}
                    {this.createField("activityDate", "date", "date", "Date", this.hasValidDate())}
                    {this.createField("activityDuration", "text", "duration", "Duration", this.hasValidDuration(), "e.g. \"1 hour\" or \"45 min\"")}
                    {this.createField("activityDistance", "text", "distance", "Distance", this.hasValidDistance(), "e.g. \"10.5 km\"")}
                </Modal.Body>

                <Modal.Footer>
                    <Button key="dismiss" onClick={() => this.props.onDismiss()}>
                        Cancel
                    </Button>
                    <Button key="save" bsStyle="primary" disabled={!this.isValid()} onClick={() => this.onSave()}>
                        Save
                    </Button>
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

    onSave() {
        if (this.isValid()) {
            this.props.onSave(this.state.builder);
        }
    }
}
