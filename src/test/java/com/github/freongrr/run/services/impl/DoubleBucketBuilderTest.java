package com.github.freongrr.run.services.impl;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

import org.junit.Before;
import org.junit.Test;

import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.beans.AxisBucket;
import com.github.freongrr.run.beans.BucketBuilder;

public final class DoubleBucketBuilderTest {

    private BucketBuilder<Double> builder;

    @Before
    public void setUp() {
        //noinspection unchecked
        Attribute<Double> attribute = mock(Attribute.class);
        when(attribute.getComparator()).thenReturn(Comparator.naturalOrder());
        when(attribute.getFormatter()).thenReturn(Object::toString);

        builder = new DoubleBucketBuilder(attribute);
    }

    @Test
    public void when_there_are_no_values_then_return_an_empty_list_of_buckets() {
        List<AxisBucket<Double>> buckets = builder.build(Collections.emptyList());
        assertThat(buckets.size(), equalTo(0));
    }

    @Test
    public void when_there_are_values_use_min_as_first_bucket() {
        List<AxisBucket<Double>> buckets = builder.build(Arrays.asList(20d, 10d, 15d, 30d));
        assertThat(first(buckets).getLabel(), equalTo("10.0"));
    }

    @Test
    public void when_there_are_values_use_max_as_start_of_last_bucket() {
        List<AxisBucket<Double>> buckets = builder.build(Arrays.asList(0d, 40d));
        assertThat(last(buckets).getLabel(), equalTo("38.0"));
    }

    @Test
    public void test_predicate_with_simple_step() {
        List<AxisBucket<Double>> buckets = builder.build(Arrays.asList(0d, 20d)); // -> step=2

        Predicate<Double> firstBucketPredicate = first(buckets).getPredicate();
        assertFalse(firstBucketPredicate.test(-1d));
        assertTrue(firstBucketPredicate.test(0d));
        assertTrue(firstBucketPredicate.test(0.5d));
        assertFalse(firstBucketPredicate.test(1d));
    }

    @Test
    public void test_predicate_with_decimal_step() {
        List<AxisBucket<Double>> buckets = builder.build(Arrays.asList(30d, 143d)); // -> step=5.65

        Predicate<Double> firstBucketPredicate = first(buckets).getPredicate();
        assertFalse(firstBucketPredicate.test(28d));
        assertTrue(firstBucketPredicate.test(30d));
        assertTrue(firstBucketPredicate.test(35.5d));
        assertFalse(firstBucketPredicate.test(35.7));
    }

    private static AxisBucket<Double> first(List<AxisBucket<Double>> buckets) {
        return buckets.get(0);
    }

    private static AxisBucket<Double> last(List<AxisBucket<Double>> buckets) {
        return buckets.get(buckets.size() - 1);
    }
}
