// @flow

import {isFetching} from "../../../main/es/redux/reducers";
import * as actionBuilders from "../../../main/es/redux/actionBuilders";

describe("isFetching", () => {

    test("is true when requesting activities", () => {
        const action = actionBuilders.requestActivities();
        const fetching = isFetching(false, action);

        expect(fetching).toEqual(true);
    });

    test("is false when receiving activities", () => {
        const action = actionBuilders.receivedActivities([]);
        const fetching = isFetching(true, action);

        expect(fetching).toEqual(false);
    });

    test("does not change for other activities", () => {
        const action = actionBuilders.setError(new Error("Boom"));
        const fetching = isFetching(true, action);

        expect(fetching).toEqual(true);
    });
});
