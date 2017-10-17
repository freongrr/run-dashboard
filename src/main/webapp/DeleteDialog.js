// @flow
"use strict";

import type {Activity} from "./Types";
import React from "react";
import {Modal, Button} from "react-bootstrap";
import {formatHourMinutes} from "./TimeUtils";
import {formatKm} from "./DistanceUtils";

type DeleteDialogProps = {
    activity: Activity,
    onDismiss: () => void,
    onConfirm: () => void
};

export default class DeleteDialog extends React.Component<*> {
    props: DeleteDialogProps;

    constructor(props: DeleteDialogProps) {
        super(props);
    }

    render() {
        return (
            <Modal show={true} onHide={() => this.props.onDismiss()}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You are about to delete this activity:</p>
                    <ul>
                        <li>Date: {this.props.activity.date}</li>
                        <li>Duration: {formatHourMinutes(this.props.activity.duration)}</li>
                        <li>Distance: {formatKm(this.props.activity.distance)}</li>
                    </ul>
                    <p>Do you want to proceed?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button key="dismiss" onClick={() => this.props.onDismiss()}>Cancel</Button>
                    <Button key="delete" bsStyle="danger" onClick={() => this.props.onConfirm()}>Delete</Button>
                </Modal.Footer>
            </Modal>);
    }
}
