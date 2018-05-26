package com.github.freongrr.run.services.impl;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.ToDoubleFunction;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.ActivityService;
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

    @Autowired
    SimpleGraphService(Logger logger, ActivityService activityService) {
        this.logger = logger;
        this.activityService = activityService;
    }

    @Override
    public Object[][] getRows(GraphDataRequest request) {
        logger.info("Building graph data for %s", request);
        Map<String, List<Activity>> groupedActivities = activityService.getAll().stream()
                .filter(getIntervalFilter(request.getInterval()))
                .collect(Collectors.groupingBy(getGroupingFunction(request.getGrouping())));

        Set<String> sortedKeys = new TreeSet<>(getComparator(request.getGrouping()));
        sortedKeys.addAll(groupedActivities.keySet());

        logger.info("Graph keys: %s", groupedActivities.keySet());
        return sortedKeys.stream()
                .map(key -> {
                    Object[] row = new Object[2];
                    row[0] = key;
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

    private Function<Activity, String> getGroupingFunction(String grouping) {
        // TODO : handle "day", "week", "month" and "year" as grouping functions
        if (grouping == null || grouping.isEmpty()) {
            return activity -> getYearAndMonth(activity.getDate());
        } else {
            return activity -> {
                String attribute = activity.getAttribute(grouping);
                return attribute == null ? "N/A" : attribute;
            };
        }
    }

    private Comparator<String> getComparator(String grouping) {
        // TODO : use more metadata
        if ("temperature".equals(grouping)) {
            return Comparator.comparingInt(s -> {
                try {
                    return Integer.parseInt(s);
                } catch (NumberFormatException e) {
                    return Integer.MIN_VALUE;
                }
            });
        } else {
            return Comparator.naturalOrder();
        }
    }

    private static String getYearAndMonth(LocalDate date) {
        String dateString = date.withDayOfMonth(1).toString();
        return dateString.substring(0, 4 + 1 + 2);
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

    private static ToDoubleFunction<Activity> extractor(String measure) {
        return activity -> {
            Object value = extract(activity, measure);
            return asDouble(value);
        };
    }

    private static Object extract(Activity activity, String name) {
        switch (name) {
            /* Core attributes */
            case GraphDataRequest.MEASURE_DURATION:
                return activity.getDuration();
            case GraphDataRequest.MEASURE_DISTANCE:
                return activity.getDistance();
            /* Derived attributes */
            case "count":
                return 1;
            case GraphDataRequest.MEASURE_TIME_1KM:
                return activity.getDuration() * 1000 / activity.getDistance();
            case "speed":
                return (double) activity.getDistance() / (double) activity.getDuration() * 3.6;
            /* Derived attributes */
            default:
                return activity.getAttribute(name);
        }
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
