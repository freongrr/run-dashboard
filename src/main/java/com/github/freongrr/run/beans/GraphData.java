package com.github.freongrr.run.beans;

import java.util.Arrays;

/**
 * TODO : documentation
 */
public final class GraphData {

    private final Row[] rows;

    public GraphData(Row[] rows) {
        this.rows = Arrays.copyOf(rows, rows.length);
    }

    public Row[] getRows() {
        return rows;
    }

    public static class Row {

        // TODO : add more axis options
        // TODO : store multiple series
        private final String axisLabel;
        private final Double rawValue;
        private final String valueLabel;

        public Row(String axisLabel, Double rawValue, String valueLabel) {
            this.axisLabel = axisLabel;
            this.rawValue = rawValue;
            this.valueLabel = valueLabel;
        }

        public String getAxisLabel() {
            return axisLabel;
        }

        public Double getRawValue() {
            return rawValue;
        }

        public String getValueLabel() {
            return valueLabel;
        }
    }
}
