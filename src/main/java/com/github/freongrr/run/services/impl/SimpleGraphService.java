package com.github.freongrr.run.services.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.Attribute;
import com.github.freongrr.run.services.ActivityService;
import com.github.freongrr.run.services.AttributeService;
import com.github.freongrr.run.services.GraphDataRequest;
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
        Collection<Activity> activities = queryActivitiesInInterval(request);
        Map<?, List<Activity>> groupedActivities = groupActivities(request, activities);

        List<?> sortedKeys = new ArrayList<>(groupedActivities.keySet());
        sortedKeys.sort((Comparator) getComparator(request.getGrouping()));

        // TODO : format keys

        logger.info("Graph keys: %s", groupedActivities.keySet());
        return sortedKeys.stream()
                .map(key -> {
                    Object[] row = new Object[2];
                    row[0] = String.valueOf(key);
                    row[1] = aggregateValue(request, groupedActivities.get(key));
                    return row;
                })
                .toArray(Object[][]::new);
    }

    private Collection<Activity> queryActivitiesInInterval(GraphDataRequest request) {
        return activityService.getAll().stream()
                .filter(getIntervalFilter(request.getInterval()))
                .collect(Collectors.toList());
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

    private Map<?, List<Activity>> groupActivities(GraphDataRequest request, Collection<Activity> activities) {
        Function<Activity, ?> groupingFunction = getGroupingFunction(request.getGrouping(), activities);
        return activities.stream().collect(Collectors.groupingBy(groupingFunction));
    }

    private Function<Activity, ?> getGroupingFunction(String grouping, Collection<Activity> activities) {
        Attribute attribute = getAttribute(grouping);
        Function<Activity, ?> extractor = attribute.getExtractor();

        if (attribute.getDataType() == Attribute.DataType.NUMBER) {
            //noinspection unchecked
            Function<Activity, Double> doubleExtractor = (Function<Activity, Double>) extractor;
            List<Double> sortedValues = activities.stream()
                    .map(doubleExtractor)
                    .filter(Objects::nonNull)
                    .sorted()
                    .distinct()
                    .collect(Collectors.toList());
            if (!sortedValues.isEmpty()) {
                double xAxisMin = sortedValues.get(0);
                double xAxisMax = sortedValues.get(sortedValues.size() - 1);
                int xAxisInterval;
                if (xAxisMax - xAxisMin > 20) {
                    xAxisInterval = (int) Math.ceil((xAxisMax - xAxisMin) / 20);
                    return doubleExtractor.andThen(d -> {
                        if (d == null) {
                            return null;
                        } else {
                            int v1 = (int) Math.round(d / xAxisInterval);
                            double v2 = v1 * xAxisInterval;
                            return v2;
                        }
                    });
                }
            }
        } else if (attribute.getDataType() == Attribute.DataType.DATE) {
            // TODO : handle "day", "week", "month" and "year" as grouping functions
        }

        return extractor::apply;
    }

    private Double asDoubleOrNull(Object rawValue) {
        if (rawValue instanceof Number) {
            return ((Number) rawValue).doubleValue();
        }
        try {
            return Double.parseDouble(String.valueOf(rawValue));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Attribute getAttribute(String grouping) {
        return attributeService.getAttributes().stream()
                .filter(a -> a.getId().equals(grouping)).findAny()
                .orElseThrow(() -> new IllegalArgumentException("Can't find attribute " + grouping));
    }

    private Comparator<?> getComparator(String grouping) {
        return getAttribute(grouping).getComparator();
    }

    private double aggregateValue(GraphDataRequest request, List<Activity> activities) {
        Function<Activity, Double> extractor = getAttribute(request.getMeasure())
                .getExtractor()
                .andThen(this::asDoubleOrNull)
                .andThen(d -> d == null ? 0d : d);
        // TODO : redo with metadata
        double sum = activities.stream().map(extractor).reduce(0d, (a, b) -> a + b);
        if ("yearAndMonth".equals(request.getGrouping())) {
            return sum;
        } else {
            return sum / activities.size();
        }
    }
}
