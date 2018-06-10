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

import org.junit.Test;

import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.beans.AxisBucket;

public final class NumericBucketBuilderTest {

    @Test
    public void when_there_are_no_values_then_return_an_empty_list_of_buckets() {
        Attribute<Double> attribute = givenDoubleAttribute();
        List<Double> values = Collections.emptyList();

        NumericBucketBuilder builder = new NumericBucketBuilder(attribute);
        List<AxisBucket<Double>> buckets = builder.build(values);
        assertThat(buckets.size(), equalTo(0));
    }

    @Test
    public void when_there_are_values_use_min_as_first_bucket() {
        Attribute<Double> attribute = givenDoubleAttribute();
        List<Double> values = Arrays.asList(20d, 10d, 15d, 30d);

        NumericBucketBuilder builder = new NumericBucketBuilder(attribute);
        List<AxisBucket<Double>> buckets = builder.build(values);
        assertThat(first(buckets).getLabel(), equalTo("10.0"));
    }

    @Test
    public void when_there_are_values_use_max_as_start_of_last_bucket() {
        Attribute<Double> attribute = givenDoubleAttribute();
        List<Double> values = Arrays.asList(0d, 40d);

        NumericBucketBuilder builder = new NumericBucketBuilder(attribute);
        List<AxisBucket<Double>> buckets = builder.build(values);
        assertThat(last(buckets).getLabel(), equalTo("38.0"));
    }

    @Test
    public void when_using_the_predicate_of_a_bucket_with_values_inside_of_it_then_it_returns_false() {
        Attribute<Double> attribute = givenDoubleAttribute();
        List<Double> values = Arrays.asList(0d, 20d);

        NumericBucketBuilder builder = new NumericBucketBuilder(attribute);
        List<AxisBucket<Double>> buckets = builder.build(values);

        Predicate<Double> firstBucketPredicate = first(buckets).getPredicate();
        assertTrue(firstBucketPredicate.test(0d));
        assertTrue(firstBucketPredicate.test(0.5d));
    }

    @Test
    public void when_using_the_predicate_of_a_bucket_with_values_outside_of_it_then_it_returns_false() {
        Attribute<Double> attribute = givenDoubleAttribute();
        List<Double> values = Arrays.asList(0d, 20d);

        NumericBucketBuilder builder = new NumericBucketBuilder(attribute);
        List<AxisBucket<Double>> buckets = builder.build(values);

        Predicate<Double> firstBucketPredicate = first(buckets).getPredicate();
        assertFalse(firstBucketPredicate.test(-1d));
        assertFalse(firstBucketPredicate.test(1d));
    }

    private static Attribute<Double> givenDoubleAttribute() {
        //noinspection unchecked
        Attribute<Double> attribute = mock(Attribute.class);
        when(attribute.getExtractor()).thenReturn(a -> Double.parseDouble(a.getAttribute("test")));
        when(attribute.getComparator()).thenReturn(Comparator.naturalOrder());
        when(attribute.getFormatter()).thenReturn(Object::toString);
        return attribute;
    }

    private static AxisBucket<Double> first(List<AxisBucket<Double>> buckets) {
        return buckets.get(0);
    }

    private static AxisBucket<Double> last(List<AxisBucket<Double>> buckets) {
        return buckets.get(buckets.size() - 1);
    }
}
