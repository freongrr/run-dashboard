// @flow

import * as reducers from "../../../main/es/redux/reducers";
import * as actionBuilders from "../../../main/es/redux/actionBuilders";

describe("isFetching", () => {

    test("is set to true when requesting activities", () => {
        const action = actionBuilders.loadActivitiesStart();
        const fetching = reducers.isFetching(false, action);

        expect(fetching).toEqual(true);
    });

    test("is set to false when loading activities succeeds", () => {
        const action = actionBuilders.loadActivitiesSuccess([]);
        const fetching = reducers.isFetching(true, action);

        expect(fetching).toEqual(false);
    });

    test("is set to false when loading activities fails", () => {
        const action = actionBuilders.loadActivitiesFailure(new Error());
        const fetching = reducers.isFetching(true, action);

        expect(fetching).toEqual(false);
    });

    test("does not change for other activities", () => {
        const action = actionBuilders.setError(new Error("Boom"));
        const fetching = reducers.isFetching(true, action);

        expect(fetching).toEqual(true);
    });
});

describe("chartInterval", () => {
    test("is updated by action", () => {
        const action = actionBuilders.setChartInterval("newInterval");
        const interval = reducers.chartInterval("oldInterval", action);
        expect(interval).toEqual("newInterval");
    });
});

describe("chartMeasure", () => {
    test("is updated by action", () => {
        const action = actionBuilders.setChartMeasure("newMeasure");
        const measure = reducers.chartMeasure("oldMeasure", action);
        expect(measure).toEqual("newMeasure");
    });
});

describe("chartGrouping", () => {
    test("is updated by action", () => {
        const action = actionBuilders.setChartGrouping("newGrouping");
        const grouping = reducers.chartGrouping("oldGrouping", action);
        expect(grouping).toEqual("newGrouping");
    });
});
