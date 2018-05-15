//@flow

import {createBuilder} from "../../../main/es/data/graphBuilderHelper";

test("returns empty graph for invalid parameters", () => {
    const graphBuilder = createBuilder("", "", "");
    expect(graphBuilder).not.toBeNull();
    expect(graphBuilder.x).not.toBeNull();
    expect(graphBuilder.series).toEqual([]);
});
