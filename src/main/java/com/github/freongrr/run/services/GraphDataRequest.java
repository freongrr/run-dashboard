package com.github.freongrr.run.services;

/**
 * TODO : documentation
 */
public final class GraphDataRequest {

    public static final String MEASURE_DURATION = "duration";
    public static final String MEASURE_DISTANCE = "distance";
    public static final String MEASURE_TIME_1KM = "time1km";

    // TODO : use enums?
    private final String interval;
    private final String measure;
    private final String grouping;

    public GraphDataRequest(String interval, String measure, String grouping) {
        this.interval = interval;
        this.measure = measure;
        this.grouping = grouping;
    }

    public String getInterval() {
        return interval;
    }

    public String getMeasure() {
        return measure;
    }

    public String getGrouping() {
        return grouping;
    }

    @Override
    public String toString() {
        return "{" +
                "interval=" + interval +
                ", measure=" + measure +
                ", grouping=" + grouping +
                "}";
    }
}
