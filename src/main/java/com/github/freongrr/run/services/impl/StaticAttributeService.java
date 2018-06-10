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
                Activity::getDuration,
                i -> i + " s"
        ));
        attributes.add(newIntAttribute(
                "distance",
                "Distance",
                Attribute.Type.CORE,
                Activity::getDistance,
                i -> i + " m"
        ));

        /* Derived Attributes */

        attributes.add(new AttributeImpl<String>(
                "yearAndMonth",
                "Month",
                Attribute.Type.DERIVED,
                Attribute.DataType.STRING,
                a -> a.getDate().withDayOfMonth(1).toString().substring(0, 7),
                Comparator.naturalOrder(),
                s -> s,
                DefaultBucketBuilder::builder
        ));
        attributes.add(newIntAttribute(
                "count",
                "Number of runs",
                Attribute.Type.DERIVED,
                a -> 1,
                String::valueOf
        ));
        attributes.add(newDoubleAttribute(
                "time1km",
                "Time for 1km",
                Attribute.Type.DERIVED,
                a -> a.getDuration() * 1000D / a.getDistance(),
                d -> Math.round(d * 100) / 100 + " s/km"
        ));
        attributes.add(newDoubleAttribute(
                "speed",
                "Speed (km/h)",
                Attribute.Type.DERIVED,
                a -> (double) a.getDistance() / (double) a.getDuration() * 3.6,
                d -> Math.round(d * 100) / 100 + " km/hm"
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
                doubleAttributeExtractor("temperature"),
                d -> d.intValue() + " °C"
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
                Function.identity(),
                DefaultBucketBuilder::builder
        );
    }

    private AttributeImpl<Double> newIntAttribute(String id, String label, Attribute.Type type,
            Function<Activity, Integer> extractor, Function<Integer, String> formatter) {
        Function<Integer, Double> fromDouble = l -> (double) l;
        Function<Double, Integer> toDouble = Double::intValue;
        return new AttributeImpl<>(
                id,
                label,
                type,
                Attribute.DataType.NUMBER,
                extractor.andThen(fromDouble),
                Comparator.nullsLast(Comparator.naturalOrder()),
                toDouble.andThen(formatter),
                DoubleBucketBuilder::new
        );
    }

    private AttributeImpl<Double> newDoubleAttribute(String id, String label, Attribute.Type type,
            Function<Activity, Double> extractor, Function<Double, String> formatter) {
        return new AttributeImpl<>(
                id,
                label,
                type,
                Attribute.DataType.NUMBER,
                extractor,
                Comparator.nullsLast(Comparator.naturalOrder()),
                formatter,
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
