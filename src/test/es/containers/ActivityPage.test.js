// @flow

import React from "react";
import {shallow} from "enzyme";
import {ActivityPage} from "../../../main/es/containers/ActivityPage";

test("invokes fetchActivities when mounted", () => {
    const fetchActivities = jest.fn();
    shallow(<ActivityPage
        attributeTypes={[]}
        isFetching={false}
        activities={[]}
        editedActivity={null}
        deletedActivity={null}
        error={null}
        fetchActivities={fetchActivities}
        startAddActivity={jest.fn()}
        startEditActivity={jest.fn()}
        startDeleteActivity={jest.fn()}
        dismissDeleteActivity={jest.fn()}
        deleteActivity={jest.fn()}
        dismissError={jest.fn()}/>);

    expect(fetchActivities).toHaveBeenCalled();
});

test("when editing an activity then ActivityDialog is shown", () => {
    const editedActivity = ({}: any);
    const dismissEditActivity = jest.fn();
    const saveActivity = jest.fn();

    const wrapper = shallow(<ActivityPage
        attributeTypes={[]}
        isFetching={false}
        activities={[]}
        editedActivity={editedActivity}
        deletedActivity={null}
        error={null}
        fetchActivities={jest.fn()}
        startAddActivity={jest.fn()}
        startEditActivity={jest.fn()}
        startDeleteActivity={jest.fn()}
        dismissDeleteActivity={jest.fn()}
        deleteActivity={jest.fn()}
        dismissError={jest.fn()}/>);

    const dialog = wrapper.find("ActivityDialog");
    expect(dialog).toHaveLength(1);
    expect(dialog.prop("initialActivity")).toEqual(editedActivity);
    expect(dialog.prop("onDismiss")).toEqual(dismissEditActivity);
    expect(dialog.prop("onSave")).toEqual(saveActivity);
});

// TODO : table, error dialog, etc
