package com.github.freongrr.run.services.impl;

import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.services.AttributeService;

@Service
final class StaticAttributeService implements AttributeService {

    private final Collection<Attribute> attributes = new HashSet<>();

    @Autowired
    StaticAttributeService() {
        // TODO : proper formatters!

        /* Core Attributes */

        attributes.add(newIntAttribute(
                "duration",
                "Duration",
                Attribute.Type.CORE,
                Activity::getDuration
        ));
        attributes.add(newIntAttribute(
                "distance",
                "Distance",
                Attribute.Type.CORE,
                Activity::getDistance
        ));

        /* Derived Attributes */

        attributes.add(newStringAttribute(
                "yearAndMonth",
                "Month",
                Attribute.Type.DERIVED,
                a -> a.getDate().withDayOfMonth(1).toString().substring(0, 7)
        ));
        attributes.add(newIntAttribute(
                "count",
                "Number of runs",
                Attribute.Type.DERIVED,
                a -> 1
        ));
        attributes.add(newDoubleAttribute(
                "time1km",
                "Time for 1km",
                Attribute.Type.DERIVED,
                a -> a.getDuration() * 1000D / a.getDistance()
        ));
        attributes.add(newDoubleAttribute(
                "speed",
                "Speed (km/h)",
                Attribute.Type.DERIVED,
                a -> (double) a.getDistance() / (double) a.getDuration() * 3.6
        ));

        /* Extra attributes */

        attributes.add(newStringAttribute(
                "city",
                "City",
                Attribute.Type.EXTRA,
                a -> a.getAttribute("city")
        ));
        attributes.add(newDoubleAttribute(
                "temperature",
                "Temperature (Celsius)",
                Attribute.Type.EXTRA,
                doubleAttributeExtractor("temperature")
        ));
    }

    private AttributeImpl<String> newStringAttribute(String id, String label, Attribute.Type type,
            Function<Activity, String> extractor) {
        return new AttributeImpl<>(
                id,
                label,
                type,
                Attribute.DataType.STRING,
                extractor,
                Comparator.nullsLast(Comparator.naturalOrder()),
                DefaultBucketBuilder::builder
        );
    }

    private AttributeImpl<Double> newIntAttribute(String id, String label, Attribute.Type type,
            Function<Activity, Integer> extractor) {
        return new AttributeImpl<>(
                id,
                label,
                type,
                Attribute.DataType.NUMBER,
                extractor.andThen(l -> (double) l),
                Comparator.nullsLast(Comparator.naturalOrder()),
                DoubleBucketBuilder::new
        );
    }

    private AttributeImpl<Double> newDoubleAttribute(String id, String label, Attribute.Type type,
            Function<Activity, Double> extractor) {
        return new AttributeImpl<>(
                id,
                label,
                type,
                Attribute.DataType.NUMBER,
                extractor,
                Comparator.nullsLast(Comparator.naturalOrder()),
                DoubleBucketBuilder::new
        );
    }

    private static Function<Activity, Double> doubleAttributeExtractor(String attribute) {
        Function<Activity, String> f = activity -> activity.getAttribute(attribute);
        return f.andThen(s -> s == null ? null : Double.parseDouble(s));
    }

    @Override
    public Collection<Attribute> getAttributes() {
        return Collections.unmodifiableCollection(attributes);
    }
}
