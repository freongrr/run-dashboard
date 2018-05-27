package com.github.freongrr.run.services.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.ToDoubleFunction;
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
        Map<?, List<Activity>> groupedActivities = activityService.getAll().stream()
                .filter(getIntervalFilter(request.getInterval()))
                .collect(Collectors.groupingBy(getGroupingFunction(request.getGrouping())));

        List<?> sortedKeys = new ArrayList<>(groupedActivities.keySet());
        sortedKeys.sort((Comparator) getComparator(request.getGrouping()));

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

    private Function<Activity, ?> getGroupingFunction(String grouping) {
        // TODO : handle "day", "week", "month" and "year" as grouping functions
        return getAttribute(grouping).getExtractor();
    }

    private Attribute getAttribute(String grouping) {
        return attributeService.getAttributes().stream()
                .filter(a -> a.getId().equals(grouping)).findAny()
                .orElseThrow(() -> new IllegalArgumentException("Can't find attribute " + grouping));
    }

    private Comparator<?> getComparator(String grouping) {
        return getAttribute(grouping).getComparator();
    }

    // TODO : redo with metadata
    private double aggregateValue(GraphDataRequest request, List<Activity> activities) {
        ToDoubleFunction<Activity> extractor = extractor(request.getMeasure());
        if (GraphDataRequest.MEASURE_TIME_1KM.equals(request.getMeasure()) || "speed".equals(request.getMeasure())) {
            return activities.stream().mapToDouble(extractor).average().orElse(0d);
        } else {
            return activities.stream().mapToDouble(extractor).sum();
        }
    }

    private ToDoubleFunction<Activity> extractor(String measure) {
        Function<Activity, ?> extractor = getAttribute(measure).getExtractor();
        return activity -> asDouble(extractor.apply(activity));
    }

    private static double asDouble(Object value) {
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (NumberFormatException e) {
            // ???
            return 0;
        }
    }
}
