package com.github.freongrr.run.beans;

import java.util.Collection;
import java.util.List;

/**
 * This interface defines a function that takes a collection of typed values and arrange them in a list of buckets.
 * For instance, the list of values could be dates and the result a list of buckets for each month.
 *
 * @param <T> the type of values of the bucket
 */
@FunctionalInterface
public interface BucketBuilder<T> {

    /**
     * Builds a list of buckets for the given values.
     *
     * @param values a collection of values (not necessarily sorted)
     * @return a list of sorted buckets
     */
    List<AxisBucket<T>> build(Collection<T> values);
}
