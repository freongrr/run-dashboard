package com.github.freongrr.run.services.impl;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.beans.AxisBucket;
import com.github.freongrr.run.beans.GraphDataRequest;
import com.github.freongrr.run.services.ActivityService;
import com.github.freongrr.run.services.AttributeService;
import com.github.freongrr.run.services.GraphService;
import com.github.freongrr.run.services.Logger;

/**
 * This naive implementation of {@link GraphService} queries all the activities from {@link ActivityService}.
 * It is mainly used for testing, but could also be used in the "production" code if there is very little data.
 */
@Service
@Primary
final class SimpleGraphService implements GraphService {

    private final Logger logger;
    private final ActivityService activityService;
    private final AttributeService attributeService;

    @Autowired
    SimpleGraphService(Logger logger, ActivityService activityService, AttributeService attributeService) {
        this.logger = logger;
        this.activityService = activityService;
        this.attributeService = attributeService;
    }

    @Override
    public Object[][] getRows(GraphDataRequest request) {
        logger.info("Building graph data for %s", request);
        Collection<Activity> activities = activityService.getAll().stream()
                .filter(getIntervalFilter(request.getInterval()))
                .collect(Collectors.toList());

        return buildRows(request, activities);
    }

    private static Predicate<Activity> getIntervalFilter(String interval) {
        switch (interval) {
            case GraphDataRequest.DURATION_LAST_12_MONTHS:
                LocalDate minus12Months = LocalDate.now().minusMonths(12);
                return a -> a.getDate().isAfter(minus12Months);
            case GraphDataRequest.ALL_DATA:
                return activity -> true;
            default:
                throw new IllegalArgumentException("Invalid interval: " + interval);
        }
    }

    private <X> Object[][] buildRows(GraphDataRequest request, Collection<Activity> activities) {
        Attribute<?> measureAttribute = getAttribute(request.getMeasure());
        Function<Activity, ?> measureAttributeExtractor = measureAttribute.getExtractor();

        //noinspection unchecked
        Attribute<X> groupingAttribute = (Attribute<X>) getAttribute(request.getGrouping());
        Function<Activity, X> groupingAttributeExtractor = groupingAttribute.getExtractor();

        List<X> groupingValues = activities.stream()
                .map(groupingAttributeExtractor)
                .collect(Collectors.toList());

        List<AxisBucket<X>> buckets = groupingAttribute.getBucketBuilder().build(groupingValues);
        logger.info("Building values for: %s", buckets);
        return buckets.stream()
                .map((AxisBucket<X> bucket) -> {
                    Predicate<X> bucketPredicate = bucket.getPredicate();
                    List<?> bucketValues = activities.stream()
                            .filter(a -> {
                                X v = groupingAttributeExtractor.apply(a);
                                return bucketPredicate.test(v);
                            })
                            .map(measureAttributeExtractor)
                            .collect(Collectors.toList());

                    if (bucketValues.isEmpty()) {
                        logger.warn("Can't find value for bucket " + bucket);
                    }

                    Object[] row = new Object[2];
                    row[0] = bucket.getValueOrLabel();
                    row[1] = aggregateValue(request, bucketValues);
                    return row;
                })
                .toArray(Object[][]::new);
    }

    private Attribute<?> getAttribute(String grouping) {
        return attributeService.getAttributes().stream()
                .filter(a -> a.getId().equals(grouping)).findAny()
                .orElseThrow(() -> new IllegalArgumentException("Can't find attribute " + grouping));
    }

    private double aggregateValue(GraphDataRequest request, Collection<?> values) {
        Stream<Double> valueStream = values.stream()
                .map(SimpleGraphService::asDoubleOrNull)
                .map(d -> d == null ? 0d : d);
        double sum = valueStream.reduce(0d, (a, b) -> a + b);
        // TODO : redo with metadata
        boolean forceSum = "count".equals(request.getMeasure()) || "yearAndMonth".equals(request.getGrouping());
        boolean forceAverage = "speed".equals(request.getMeasure()) || "temperature".equals(request.getMeasure());
        if (forceSum && !forceAverage) {
            return sum;
        } else {
            return sum / values.size();
        }
    }

    private static Double asDoubleOrNull(Object rawValue) {
        if (rawValue instanceof Number) {
            return ((Number) rawValue).doubleValue();
        }
        try {
            return Double.parseDouble(String.valueOf(rawValue));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
