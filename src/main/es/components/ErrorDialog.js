// @flow
"use strict";

import React from "react";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";

type ErrorDialogProps = {
    error: Error,
    onDismiss: () => void
};

export default class ErrorDialog extends React.Component<*> {
    props: ErrorDialogProps;

    constructor(props: ErrorDialogProps) {
        super(props);
    }

    render() {
        return (
            <Modal show={true} onHide={() => this.props.onDismiss()}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.errorMessage()}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.props.onDismiss()}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    errorMessage() {
        return this.props.error.message || this.props.error.toString();
    }
}
