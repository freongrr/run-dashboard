// @flow
"use strict";

import type {ActivityBuilder, AttributeType} from "../types/Types";
import React from "react";
import {Button, ControlLabel, FormControl, FormGroup, HelpBlock, Modal} from "react-bootstrap";
import {parseDuration} from "../utils/TimeUtils";
import {parseDistance} from "../utils/DistanceUtils";
import * as CopyTools from "../data/CopyTools";

type ActivityDialogProps = {
    activityBuilder: ActivityBuilder,
    attributeTypes: AttributeType[],
    onDismiss: () => void,
    onSave: (ActivityBuilder) => void
};

type ActivityDialogState = {
    builder: ActivityBuilder
};

// TODO : make this a "connected" component, or wrap it in a ActivityDialogContainer 
export default class ActivityDialog extends React.Component<ActivityDialogProps, ActivityDialogState> {
    props: ActivityDialogProps;
    state: ActivityDialogState;
    inputs: Map<string, HTMLInputElement>;

    constructor(props: ActivityDialogProps) {
        super(props);

        this.state = {
            builder: CopyTools.cloneActivityBuilder(props.activityBuilder)
        };

        // Is there a better way to focus the first input field?
        this.inputs = new Map();
    }

    componentDidMount() {
        const dateInput = this.inputs.get("activityDate");
        if (dateInput !== undefined) {
            dateInput.focus();
        }
    }

    render() {
        return (
            <Modal show={true} onHide={() => this.props.onDismiss()}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {this.props.activityBuilder.id ? "Edit an activity" : "Add a new activity"}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* TODO : this is the wrong format (i.e. DD/MM/YYYY) */}
                    {this.createField("activityDate", "date", "date", "Date", this.hasValidDate())}
                    {this.createField("activityDuration", "text", "duration", "Duration", this.hasValidDuration(), "e.g. \"1 hour\" or \"45 min\"")}
                    {this.createField("activityDistance", "text", "distance", "Distance", this.hasValidDistance(), "e.g. \"10.5 km\"")}
                    {this.props.attributeTypes.map(a => this.createAttributeField(a))}
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
        const value = (this.state.builder[property]: string);
        const updateHandler = (builder: ActivityBuilder, v: string) => {
            builder[property] = v;
            return builder;
        };
        return this.doCreateField(id, type, value, updateHandler, label, valid, placeholder, help);
    }

    createAttributeField(attributeType: AttributeType) {
        let value = this.state.builder.attributes[attributeType.id] || "";
        const updateHandler = (builder: ActivityBuilder, value: string) => {
            builder.attributes[attributeType.id] = value;
            return builder;
        };
        return this.doCreateField(attributeType.id, "text", value, updateHandler, attributeType.label, true, "", "");
    }

    doCreateField(id: string, type: string, value: string, updateHandler: (ActivityBuilder, string) => ActivityBuilder, label: string, valid: boolean, placeholder: ?string, help: ?string) {
        const validationState = valid ? "success" : "error";
        const onChangeHandle = (e: any) => {
            const updatedBuilder = CopyTools.cloneActivityBuilder(this.state.builder);
            updateHandler(updatedBuilder, e.target.value);
            this.setState({builder: updatedBuilder});
        };
        return (
            <FormGroup key={id} controlId={id} validationState={validationState}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl id={id} type={type} value={value} placeholder={placeholder}
                    onChange={onChangeHandle} inputRef={ref => this.inputs.set(id, ref)}/>
                {help && <HelpBlock>{help}</HelpBlock>}
                <FormControl.Feedback/>
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
