package com.github.freongrr.run.services.impl;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.DoubleStream;

import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.beans.AxisBucket;
import com.github.freongrr.run.beans.BucketBuilder;

final class NumericBucketBuilder implements BucketBuilder<Double> {

    // TODO : pass parameters instead (e.g. min number of ticket, max steps)
    private static final int TICKS = 20;

    private final Attribute<Double> attribute;

    NumericBucketBuilder(Attribute<Double> attribute) {
        this.attribute = attribute;
    }

    @Override
    public List<AxisBucket<Double>> build(Collection<Double> values) {
        if (values.isEmpty()) {
            return Collections.emptyList();
        }

        List<Double> sortedValues = values.stream()
                .sorted(attribute.getComparator())
                .distinct()
                .collect(Collectors.toList());

        // TODO : round min, max and step
        // e.g. 101 to 199 -> 100, 200 with step of 10
        double min = sortedValues.get(0);
        double max = sortedValues.get(sortedValues.size() - 1);
        double step = Math.round((max - min) / TICKS);
        return DoubleStream.iterate(min, d -> d + step)
                .limit((long) Math.ceil((max - min) / step))
                .mapToObj(bucketValue -> makeBucket(bucketValue, step))
                .collect(Collectors.toList());
    }

    private AxisBucket<Double> makeBucket(double bucketValue, double step) {
        String label = attribute.getFormatter().apply(bucketValue);
        Predicate<Double> predicate = v -> Math.floor(v / step) * step == bucketValue;
        return new AxisBucket<>(label, predicate);
    }
}
