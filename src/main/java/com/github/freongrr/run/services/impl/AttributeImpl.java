package com.github.freongrr.run.services.impl;

import java.util.Comparator;
import java.util.Objects;
import java.util.function.Function;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.Attribute;

final class AttributeImpl implements Attribute {

    private final String id;
    private final String label;
    private final Type type;
    private final DataType dataType;
    private final Function<Activity, ?> extractor;
    private final Comparator<?> comparator;

    AttributeImpl(String id, String label, Type type, DataType dataType, Function<Activity, ?> extractor,
            Comparator<?> comparator) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.dataType = dataType;
        this.extractor = extractor;
        this.comparator = comparator;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public String getLabel() {
        return label;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public DataType getDataType() {
        return dataType;
    }

    @Override
    public Function<Activity, ?> getExtractor() {
        return extractor;
    }

    @Override
    public Comparator<?> getComparator() {
        return comparator;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        } else if (!(o instanceof AttributeImpl)) {
            return false;
        }
        AttributeImpl attribute = (AttributeImpl) o;
        return Objects.equals(id, attribute.id) &&
                Objects.equals(label, attribute.label) &&
                type == attribute.type &&
                dataType == attribute.dataType;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, label, type, dataType);
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", label=" + label +
                ", type=" + type +
                ", dataType=" + dataType +
                "}";
    }
}

