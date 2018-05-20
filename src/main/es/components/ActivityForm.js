// @flow
"use strict";

import type {ActivityBuilder, AttributeType} from "../types/Types";
import React from "react";
import {ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";
import * as ActivityBuilderValidator from "../data/ActivityBuilderValidator";

type ActivityFormProps = {
    activityBuilder: ActivityBuilder,
    attributeTypes: AttributeType[],
    onMainFieldChange: (property: string, newValue: string) => void,
    onAttributeFieldChange: (attributeType: AttributeType, newValue: string) => void
};

export default class ActivityForm extends React.Component<ActivityFormProps> {

    dateFieldRef = React.createRef();

    componentDidMount() {
        if (this.dateFieldRef.current) {
            this.dateFieldRef.current.focus();
        }
    }

    render() {
        const hasValidDate = ActivityBuilderValidator.hasValidDate(this.props.activityBuilder);
        const hasValidDuration = ActivityBuilderValidator.hasValidDuration(this.props.activityBuilder);
        const hasValidDistance = ActivityBuilderValidator.hasValidDistance(this.props.activityBuilder);
        return (
            <div>
                {/* TODO : this is the wrong format (i.e. DD/MM/YYYY) */}
                {this.createField("activity_date", "date", "date", "Date", hasValidDate, undefined, undefined, this.dateFieldRef)}
                {this.createField("activity_duration", "text", "duration", "Duration", hasValidDuration, "e.g. \"1 hour\" or \"45 min\"")}
                {this.createField("activity_distance", "text", "distance", "Distance", hasValidDistance, "e.g. \"10.5 km\"")}
                {this.props.attributeTypes.map(a => this.createAttributeField(a))}
            </div>
        );
    }

    createField(id: string, type: string, property: string, label: string, valid: boolean, placeholder: ?string, help: ?string, ref: any) {
        const value = (this.props.activityBuilder[property]: string);
        const updateHandler = (newValue: string) => {
            this.props.onMainFieldChange(property, newValue);
        };
        return this.doCreateField(id, type, value, updateHandler, label, valid, placeholder, help, ref);
    }

    createAttributeField(attributeType: AttributeType) {
        let value = this.props.activityBuilder.attributes[attributeType.id] || "";
        const updateHandler = (newValue: string) => {
            this.props.onAttributeFieldChange(attributeType, newValue);
        };
        return this.doCreateField("activity_" + attributeType.id, "text", value, updateHandler, attributeType.label, true, "", "");
    }

    doCreateField(id: string, type: string, value: string, updateHandler: (string) => void, label: string, valid: boolean, placeholder: ?string, help: ?string, ref: any) {
        const validationState = valid ? "success" : "error";
        const onChangeHandle = (e: any) => updateHandler(e.target.value);
        return (
            <FormGroup key={id} controlId={id} validationState={validationState}>
                <ControlLabel>{label}</ControlLabel>
                <FormControl id={id} type={type} value={value} placeholder={placeholder}
                    onChange={onChangeHandle} inputRef={ref}/>
                {help && <HelpBlock>{help}</HelpBlock>}
                <FormControl.Feedback/>
            </FormGroup>
        );
    }
}
