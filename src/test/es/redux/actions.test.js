// @flow

import * as actionBuilders from "../../../main/es/redux/actionBuilders";
import * as actions from "../../../main/es/redux/actions";
import RPC from "../../../main/es/utils/RPC";

let rpc: RPC;
let dispatch: actions.Dispatch;
let getState: actions.GetState;

beforeEach(() => {
    rpc = ({
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
    }: any);

    actions.overrideRPC(rpc);

    dispatch = jest.fn();
    getState = jest.fn().mockReturnValue(({}: any));
});

describe("fetchActivities", () => {

    test("dispatches the start and success actions when loading activities", done => {
        rpc.get.mockReturnValue(Promise.resolve([]));

        const thunkAction = actions.fetchActivities();
        thunkAction(dispatch, getState);

        assertLater(done, () => {
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadActivitiesStart());
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadActivitiesSuccess([]));
        });
    });

    test("dispatches the start and failure actions when loading activities fails", done => {
        rpc.get.mockReturnValue(Promise.reject(new Error()));

        const thunkAction = actions.fetchActivities();
        thunkAction(dispatch, getState);

        assertLater(done, () => {
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadActivitiesStart());
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadActivitiesFailure(new Error()));
        });
    });

    test("invokes GET on activities API", done => {
        rpc.get.mockReturnValue(Promise.resolve([]));

        const thunkAction = actions.fetchActivities();
        thunkAction(dispatch, getState);

        assertLater(done, () => expect(rpc.get).toHaveBeenCalledWith("/api/activities"));
    });
});

test("updateChartInterval dispatches setChartInterval and doFetchChartData", done => {
    const thunkAction = actions.updateChartInterval("newInterval");
    thunkAction(dispatch, getState);

    assertLater(done, () => {
        expect(dispatch).toHaveBeenCalledWith(actionBuilders.setChartInterval("newInterval"));
        expect(dispatch).toHaveBeenCalledWith(actions.doFetchChartData);
    });
});

test("updateChartMeasure dispatches setChartMeasure and doFetchChartData", done => {
    const thunkAction = actions.updateChartMeasure("newMeasure");
    thunkAction(dispatch, getState);

    assertLater(done, () => {
        expect(dispatch).toHaveBeenCalledWith(actionBuilders.setChartMeasure("newMeasure"));
        expect(dispatch).toHaveBeenCalledWith(actions.doFetchChartData);
    });
});

test("updateChartGrouping dispatches setChartGrouping and doFetchChartData", done => {
    const thunkAction = actions.updateChartGrouping("newGrouping");
    thunkAction(dispatch, getState);

    assertLater(done, () => {
        expect(dispatch).toHaveBeenCalledWith(actionBuilders.setChartGrouping("newGrouping"));
        expect(dispatch).toHaveBeenCalledWith(actions.doFetchChartData);
    });
});

describe("fetchChartData", () => {

    test("dispatches the start and success actions when loading chart data", done => {
        rpc.get.mockReturnValue(Promise.resolve([]));

        const thunkAction = actions.fetchChartData();
        thunkAction(dispatch, getState);

        assertLater(done, () => {
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadChartDataStart());
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadChartDataSuccess({rows: []}));
        });
    });

    test("dispatches the start and failure actions when loading chart data fails", done => {
        rpc.get.mockReturnValue(Promise.reject(new Error()));

        const thunkAction = actions.fetchChartData();
        thunkAction(dispatch, getState);

        assertLater(done, () => {
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadChartDataStart());
            expect(dispatch).toHaveBeenCalledWith(actionBuilders.loadChartDataFailure(new Error()));
        });
    });

    test("invokes GET on chart API with correct parameters", done => {
        getState().chartInterval = "foo";
        getState().chartMeasure = "bar";
        getState().chartGrouping = "baz";

        rpc.get.mockReturnValue(Promise.resolve([]));

        const thunkAction = actions.fetchChartData();
        thunkAction(dispatch, getState);

        assertLater(done, () => {
            expect(rpc.get).toHaveBeenCalledWith("/api/graph?interval=foo&measure=bar&grouping=baz");
        });
    });
});

function assertLater(done: () => void, assertFunction: () => void) {
    setTimeout(() => {
        assertFunction();
        done();
    }, 1);
}
