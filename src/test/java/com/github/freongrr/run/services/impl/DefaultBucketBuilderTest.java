package com.github.freongrr.run.services.impl;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.Before;
import org.junit.Test;

import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.beans.AxisBucket;
import com.github.freongrr.run.beans.BucketBuilder;

public class DefaultBucketBuilderTest {

    private BucketBuilder<String> builder;

    @Before
    public void setUp() {
        //noinspection unchecked
        Attribute<String> attribute = mock(Attribute.class);
        when(attribute.getComparator()).thenReturn(Comparator.naturalOrder());

        builder = DefaultBucketBuilder.builder(attribute);
    }

    @Test
    public void when_there_are_no_values_then_return_an_empty_list_of_buckets() {
        List<AxisBucket<String>> buckets = builder.build(Collections.emptyList());
        assertThat(buckets, equalTo(Collections.emptyList()));
    }

    @Test
    public void when_values_contain_duplicates_then_builder_return_them_as_one_bucket() {
        List<AxisBucket<String>> buckets = builder.build(Arrays.asList("foo", "bar", "foo"));
        List<Object> bucketValues = buckets.stream().map(AxisBucket::getValueOrLabel).collect(Collectors.toList());
        assertThat(bucketValues, equalTo(Arrays.asList("bar", "foo")));
    }
}
