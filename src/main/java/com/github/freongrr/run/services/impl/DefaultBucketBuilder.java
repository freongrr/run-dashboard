package com.github.freongrr.run.services.impl;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.beans.AxisBucket;
import com.github.freongrr.run.beans.BucketBuilder;

/**
 * This implementation fo {@link DefaultBucketBuilder} by creating a bucket for each distinct value.
 *
 * @param <T> the type of values of the bucket
 */
final class DefaultBucketBuilder<T> implements BucketBuilder<T> {

    private final Attribute<T> attribute;

    private DefaultBucketBuilder(Attribute<T> attribute) {
        this.attribute = attribute;
    }

    @Override
    public List<AxisBucket<T>> build(Collection<T> values) {
        return values.stream()
                .distinct()
                .sorted(attribute.getComparator())
                .map(this::makeBucket)
                .collect(Collectors.toList());
    }

    private AxisBucket<T> makeBucket(T bucketValue) {
        Predicate<T> predicate = v -> Objects.equals(v, bucketValue);
        return new AxisBucket<>(bucketValue, predicate);
    }

    static <X> DefaultBucketBuilder<X> builder(Attribute<X> attribute) {
        return new DefaultBucketBuilder<>(attribute);
    }
}
