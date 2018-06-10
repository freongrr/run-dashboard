package com.github.freongrr.run.beans;

import java.util.Comparator;
import java.util.function.Function;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * This interface defines an attribute of an {@link Activity}. It can be a core attribute defined in the
 * {@link Activity} class itself, or other attributes that have to be extracted.
 *
 * @param <T> the type of the value of the attribute
 */
public interface Attribute<T> {

    /** This represents the type of attribute */
    enum Type {
        /** CORE attributes are defined in the {@link Activity} class */
        CORE,
        /** DERIVED attributes are computed from other attributes */
        DERIVED,
        /** EXTRA attributes are dynamic values */
        EXTRA
    }

    /** The represents the type of the value fo the attribute. It should, more of less, match the type &lt;T;gt; */
    enum DataType {
        /** The data is a string */
        STRING,
        /** The data is a number */
        NUMBER,
        /** The data is a date */
        DATE
    }

    String getId();

    String getLabel();

    Type getType();

    DataType getDataType();

    /**
     * @return a function that extract the value of this attribute from an activity
     */
    @JsonIgnore
    Function<Activity, T> getExtractor();

    /**
     * @return a {@link Comparator} for values of this attribute
     */
    @JsonIgnore
    Comparator<T> getComparator();

    /**
     * @return a function that formats a value of this attribute
     */
    @JsonIgnore
    Function<T, String> getFormatter();

    /**
     * @return a function that build a list of buckets from a collection of values of this attribute
     */
    @JsonIgnore
    BucketBuilder<T> getBucketBuilder();
}
