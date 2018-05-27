package com.github.freongrr.run.beans;

import java.util.Comparator;
import java.util.function.Function;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * TODO : documentation
 */
public interface Attribute {

    enum Type {
        CORE, DERIVED, EXTRA
    }

    enum DataType {
        STRING, NUMBER, DATE
    }

    String getId();

    String getLabel();

    Type getType();

    DataType getDataType();

    // TODO : we need a function that returns possible values for grouping, even when there is no activity that match:
    // - the last 12 months
    // - a series of number ranges (e.g. -10 to 0, 0 to 10, etc) 

    @JsonIgnore
    Function<Activity, ?> getExtractor();

    @JsonIgnore
    Comparator<?> getComparator();

    // TODO : format?
}
