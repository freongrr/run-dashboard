// @flow

import type {ActivityBuilder, Attribute} from "../types/Types";
import React from "react";
import Modal from "react-bootstrap/lib/Modal";
import Button from "react-bootstrap/lib/Button";
import type {Dispatch} from "../redux/actions";
import * as actions from "../redux/actions";
import * as redux from "react-redux";
import type {AppState} from "../types/AppState";
import * as CopyTools from "../data/CopyTools";
import * as ActivityBuilderValidator from "../data/ActivityBuilderValidator";
import ActivityForm from "../components/ActivityForm";

type ActivityDialogProps = {
    activityBuilder: ActivityBuilder,
    attributes: Attribute[],
    onDismiss: () => void,
    onSave: (ActivityBuilder) => void
};

type ActivityDialogState = {
    builder: ActivityBuilder
};

export class ActivityDialog extends React.Component<ActivityDialogProps, ActivityDialogState> {

    constructor(props: ActivityDialogProps) {
        super(props);

        this.state = {
            builder: CopyTools.cloneActivityBuilder(props.activityBuilder)
        };
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
                    <ActivityForm
                        attributes={this.props.attributes}
                        activityBuilder={this.state.builder}
                        onMainFieldChange={this.onMainFieldChange}
                        onAttributeFieldChange={this.onAttributeFieldChange}/>
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

    onMainFieldChange = (property: string, newValue: string) => {
        const updatedBuilder = CopyTools.cloneActivityBuilder(this.state.builder);
        updatedBuilder[property] = newValue;
        this.setState({builder: updatedBuilder});
    };

    onAttributeFieldChange = (attribute: Attribute, newValue: string) => {
        const updatedBuilder = CopyTools.cloneActivityBuilder(this.state.builder);
        updatedBuilder.attributes[attribute.id] = newValue;
        this.setState({builder: updatedBuilder});
    };

    isValid(): boolean {
        return ActivityBuilderValidator.hasValidDate(this.state.builder.date) &&
            ActivityBuilderValidator.hasValidDuration(this.state.builder.duration) &&
            ActivityBuilderValidator.hasValidDistance(this.state.builder.distance);
    }

    onSave() {
        if (this.isValid()) {
            this.props.onSave(this.state.builder);
        }
    }
}

function mapStateToProps(state: AppState): $Shape<ActivityDialogProps> {
    return {
        attributes: state.attributes
    };
}

function mapDispatchToProps(dispatch: Dispatch): $Shape<ActivityDialogProps> {
    return {
        onDismiss: () => dispatch(actions.dismissEditActivity()),
        onSave: (a) => dispatch(actions.saveActivity(a)),
    };
}

export default redux.connect(mapStateToProps, mapDispatchToProps)(ActivityDialog);
