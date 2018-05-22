// @flow
"use strict";

import React from "react";
import {ControlLabel, FormControl, FormGroup, HelpBlock} from "react-bootstrap";

export type ChangeEvent = {
    target: { value: string }
};

export type RefFunction = (any) => void;

export type FieldProps = {
    id: string,
    value: string,
    label: string,
    onChange: (ChangeEvent) => void,
    validator?: (string) => boolean,
    placeholder?: string,
    help?: string,
    refFunction?: RefFunction
};

const NUMBER_REGEXP = new RegExp(/^[0-9]*$/);

export function TextField(props: FieldProps) {
    const valid = (!props.validator || props.validator(props.value));
    const validationState = valid ? "success" : "error";
    return (
        <FormGroup controlId={props.id} validationState={validationState}>
            <ControlLabel>{props.label}</ControlLabel>
            <FormControl id={props.id} type="string" value={props.value} placeholder={props.placeholder}
                onChange={props.onChange} inputRef={props.refFunction}/>
            {props.help && <HelpBlock>{props.help}</HelpBlock>}
            <FormControl.Feedback/>
        </FormGroup>);
}

export function DateField(props: FieldProps) {
    const valid = (!props.validator || props.validator(props.value));
    const validationState = valid ? "success" : "error";
    return (
        <FormGroup controlId={props.id} validationState={validationState}>
            <ControlLabel>{props.label}</ControlLabel>
            <FormControl id={props.id} type="date" value={props.value} placeholder={props.placeholder}
                onChange={props.onChange} inputRef={props.refFunction}/>
            {props.help && <HelpBlock>{props.help}</HelpBlock>}
            <FormControl.Feedback/>
        </FormGroup>);
}

export function NumberField(props: FieldProps) {
    const valid = NUMBER_REGEXP.test(props.value) &&
        (!props.validator || props.validator(props.value));
    const validationState = valid ? "success" : "error";
    return (
        <FormGroup controlId={props.id} validationState={validationState}>
            <ControlLabel>{props.label}</ControlLabel>
            <FormControl id={props.id} type="string" value={props.value} placeholder={props.placeholder}
                onChange={props.onChange} inputRef={props.refFunction}/>
            {props.help && <HelpBlock>{props.help}</HelpBlock>}
            <FormControl.Feedback/>
        </FormGroup>);
}
