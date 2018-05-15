// @flow

import {isFetching} from "../../../main/es/redux/reducers";
import * as actionBuilders from "../../../main/es/redux/actionBuilders";

describe("isFetching", () => {

    test("is set to true when requesting activities", () => {
        const action = actionBuilders.loadActivitiesStart();
        const fetching = isFetching(false, action);

        expect(fetching).toEqual(true);
    });

    test("is set to false when loading activities succeeds", () => {
        const action = actionBuilders.loadActivitiesSuccess([]);
        const fetching = isFetching(true, action);

        expect(fetching).toEqual(false);
    });

    test("is set to false when loading activities fails", () => {
        const action = actionBuilders.loadActivitiesFailure(new Error());
        const fetching = isFetching(true, action);

        expect(fetching).toEqual(false);
    });

    test("does not change for other activities", () => {
        const action = actionBuilders.setError(new Error("Boom"));
        const fetching = isFetching(true, action);

        expect(fetching).toEqual(true);
    });
});
