// @flow

import * as reducers from "../../../main/es/redux/reducers";
import * as actionBuilders from "../../../main/es/redux/actionBuilders";

describe("loadingActivities", () => {

    test("is set to true when requesting activities", () => {
        const action = actionBuilders.loadActivitiesStart();
        const fetching = reducers.loadingActivities(false, action);

        expect(fetching).toEqual(true);
    });

    test("is set to false when loading activities succeeds", () => {
        const action = actionBuilders.loadActivitiesSuccess([]);
        const fetching = reducers.loadingActivities(true, action);

        expect(fetching).toEqual(false);
    });

    test("is set to false when loading activities fails", () => {
        const action = actionBuilders.loadActivitiesFailure(new Error());
        const fetching = reducers.loadingActivities(true, action);

        expect(fetching).toEqual(false);
    });

    test("does not change for other actions", () => {
        const action = actionBuilders.setError(new Error("Boom"));
        const fetching = reducers.loadingActivities(true, action);

        expect(fetching).toEqual(true);
    });
});

describe("loadingGraph", () => {

    test("is set to true when requesting chart data", () => {
        const action = actionBuilders.loadChartDataStart();
        const fetching = reducers.loadingGraph(false, action);

        expect(fetching).toEqual(true);
    });

    test("is set to false when loading chart data succeeds", () => {
        const action = actionBuilders.loadChartDataSuccess({rows: []});
        const fetching = reducers.loadingGraph(true, action);

        expect(fetching).toEqual(false);
    });

    test("is set to false when loading chart data fails", () => {
        const action = actionBuilders.loadChartDataFailure(new Error());
        const fetching = reducers.loadingGraph(true, action);

        expect(fetching).toEqual(false);
    });

    test("does not change for other actions", () => {
        const action = actionBuilders.setError(new Error("Boom"));
        const fetching = reducers.loadingGraph(true, action);

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
