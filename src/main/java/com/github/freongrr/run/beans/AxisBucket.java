package com.github.freongrr.run.beans;

import java.util.Objects;
import java.util.function.Predicate;

/**
 * This class represents a "bucket" that aggregates multiple values to show it on the graph. e.g. the bucket for the
 * month of march, the bucket for temperature between 20 and 30.
 *
 * @param <T> the type of values in the bucket (e.g. a date, or a temperature)
 */
public final class AxisBucket<T> {

    private final Object valueOrLabel;
    private final Predicate<T> predicate;

    public AxisBucket(Object valueOrLabel, Predicate<T> predicate) {
        this.valueOrLabel = valueOrLabel;
        this.predicate = predicate;
    }

    /**
     * @return the value that represents the bucket of a friendly label (e.g. "June 2018" or "10-20°C")
     */
    public Object getValueOrLabel() {
        return valueOrLabel;
    }

    /**
     * @return a matcher that returns true for values inside the bucket
     */
    public Predicate<T> getPredicate() {
        return predicate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        } else if (!(o instanceof AxisBucket)) {
            return false;
        }
        AxisBucket<?> that = (AxisBucket<?>) o;
        return Objects.equals(valueOrLabel, that.valueOrLabel) &&
                Objects.equals(predicate, that.predicate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valueOrLabel, predicate);
    }

    @Override
    public String toString() {
        return String.valueOf(valueOrLabel);
    }
}
