// @flow
"use strict";

import type {ActivityBuilder, AttributeType} from "../types/Types";
import React from "react";
import * as ActivityBuilderValidator from "../data/ActivityBuilderValidator";
import type {ChangeEvent} from "./Fields";
import {DateField, NumberField, TextField} from "./Fields";

type ActivityFormProps = {
    activityBuilder: ActivityBuilder,
    attributeTypes: AttributeType[],
    onMainFieldChange: (property: string, newValue: string) => void,
    onAttributeFieldChange: (attributeType: AttributeType, newValue: string) => void
};


export default class ActivityForm extends React.Component<ActivityFormProps> {

    dateFieldRef = React.createRef();

    setDateFieldRef = (ref: any) => this.dateFieldRef.current = ref;

    componentDidMount() {
        if (this.dateFieldRef.current) {
            this.dateFieldRef.current.focus();
        }
    }

    render() {
        return (
            <div className="ActivityForm">
                {/* TODO : this is the wrong format (i.e. DD/MM/YYYY) */}
                <DateField id="activity_date" label="Date" value={this.props.activityBuilder.date}
                    onChange={this.onDateChange} validator={ActivityBuilderValidator.hasValidDate}
                    refFunction={this.setDateFieldRef}/>
                <TextField id="activity_duration" label="Duration" value={this.props.activityBuilder.duration}
                    onChange={this.onDurationChange} validator={ActivityBuilderValidator.hasValidDuration}
                    placeholder={"e.g. \"1 hour\" or \"45 min\""}/>
                <TextField id="activity_distance" label="Distance" value={this.props.activityBuilder.distance}
                    onChange={this.onDistanceChange}
                    validator={ActivityBuilderValidator.hasValidDistance} placeholder={"e.g. \"10.5 km\""}/>
                {this.props.attributeTypes
                    .filter(a => !a.output)
                    .map(a => this.createAttributeField(a))}
            </div>
        );
    }

    onDateChange = (e: ChangeEvent) => this.props.onMainFieldChange("date", e.target.value);
    onDurationChange = (e: ChangeEvent) => this.props.onMainFieldChange("duration", e.target.value);
    onDistanceChange = (e: ChangeEvent) => this.props.onMainFieldChange("distance", e.target.value);

    createAttributeField(attributeType: AttributeType) {
        const id = "activity_" + attributeType.id;
        const fieldProps = {
            key: id,
            id: id,
            label: attributeType.label,
            value: this.props.activityBuilder.attributes[attributeType.id] || "",
            onChange: (e) => this.props.onAttributeFieldChange(attributeType, e.target.value)
        };
        if (attributeType.type === "number") {
            return <NumberField {...fieldProps}/>;
        } else if (attributeType.type === "date") {
            return <DateField {...fieldProps}/>;
        } else {
            return <TextField {...fieldProps}/>;
        }
    }
}
