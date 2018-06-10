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

        attributes.add(new AttributeImpl<>(
                "duration",
                "Duration",
                Attribute.Type.CORE,
                Attribute.DataType.NUMBER,
                Activity::getDuration,
                Comparator.naturalOrder(),
                i -> i + " s",
                DefaultBucketBuilder::builder
        ));
        attributes.add(new AttributeImpl<>(
                "distance",
                "Distance",
                Attribute.Type.CORE,
                Attribute.DataType.NUMBER,
                Activity::getDistance,
                Comparator.naturalOrder(),
                i -> i + " m",
                DefaultBucketBuilder::builder
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
        attributes.add(new AttributeImpl<Integer>(
                "count",
                "Number of runs",
                Attribute.Type.DERIVED,
                Attribute.DataType.NUMBER,
                a -> 1,
                Comparator.naturalOrder(),
                String::valueOf,
                DefaultBucketBuilder::builder
        ));
        attributes.add(new AttributeImpl<Double>(
                "time1km",
                "Time for 1km",
                Attribute.Type.DERIVED,
                Attribute.DataType.NUMBER,
                a -> a.getDuration() * 1000D / a.getDistance(),
                Comparator.naturalOrder(),
                d -> Math.round(d * 100) / 100 + " s/km",
                DefaultBucketBuilder::builder
        ));
        attributes.add(new AttributeImpl<Double>(
                "speed",
                "Speed (km/h)",
                Attribute.Type.DERIVED,
                Attribute.DataType.NUMBER,
                a -> (double) a.getDistance() / (double) a.getDuration() * 3.6,
                Comparator.naturalOrder(),
                d -> Math.round(d * 100) / 100 + " km/hm",
                DefaultBucketBuilder::builder
        ));

        /* Extra attributes */

        attributes.add(new AttributeImpl<>(
                "city",
                "City",
                Attribute.Type.EXTRA,
                Attribute.DataType.STRING,
                a -> a.getAttribute("city"),
                Comparator.naturalOrder(),
                Function.identity(),
                DefaultBucketBuilder::builder
        ));
        attributes.add(new AttributeImpl<>(
                "temperature",
                "Temperature (Celsius)",
                Attribute.Type.EXTRA,
                Attribute.DataType.NUMBER,
                getDoubleAttribute("temperature"),
                Comparator.nullsFirst(Comparator.naturalOrder()),
                d -> d.intValue() + " °C",
                NumericBucketBuilder::new
        ));
    }

    private static Function<Activity, Double> getDoubleAttribute(String attribute) {
        Function<Activity, String> f = activity -> activity.getAttribute(attribute);
        return f.andThen(s -> s == null ? null : Double.parseDouble(s));
    }

    @Override
    public Collection<Attribute> getAttributes() {
        return Collections.unmodifiableCollection(attributes);
    }
}
