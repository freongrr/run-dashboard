package com.github.freongrr.run.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.inject.Inject;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.components.ActivityStore;

final class DummyStore implements ActivityStore {

    private static final Comparator<Activity> RECENT_FIRST_COMPARATOR = Comparator
            .comparing(Activity::getDate).reversed();

    private final Map<String, Activity> activities;

    @Inject
    DummyStore() {
        this.activities = new ConcurrentHashMap<>();

        addActivity("12", LocalDate.of(2017, 1, 14), 1769, 6200);
        addActivity("2", LocalDate.of(2017, 1, 8), 3033, 10300);
        addActivity("3", LocalDate.of(2017, 1, 3), 1441, 5000);
        addActivity("4", LocalDate.of(2016, 12, 30), 1773, 6200);
        addActivity("5", LocalDate.of(2016, 12, 23), 2956, 9500);
        addActivity("6", LocalDate.of(2016, 12, 17), 2544, 8500);
        addActivity("7", LocalDate.of(2016, 12, 11), 2145, 7000);
        addActivity("8", LocalDate.of(2016, 10, 22), 3391, 11500);
        addActivity("9", LocalDate.of(2016, 10, 9), 1799, 6400);
        addActivity("10", LocalDate.of(2016, 10, 6), 1547, 5500);
        addActivity("11", LocalDate.of(2016, 10, 3), 1428, 4800);
        addActivity("12", LocalDate.of(2016, 9, 25), 2801, 9000);
        addActivity("13", LocalDate.of(2016, 9, 22), 1560, 5200);
        addActivity("14", LocalDate.of(2016, 9, 11), 2939, 10100);
        addActivity("15", LocalDate.of(2016, 8, 28), 1775, 6000);
        addActivity("16", LocalDate.of(2016, 8, 11), 1878, 6500);
        addActivity("17", LocalDate.of(2016, 7, 30), 2474, 8000);
        addActivity("18", LocalDate.of(2016, 7, 10), 1357, 4100);
        addActivity("19", LocalDate.of(2016, 7, 10), 1439, 5000);
        addActivity("20", LocalDate.of(2016, 6, 25), 1479, 5400);
        addActivity("21", LocalDate.of(2016, 6, 14), 1831, 6500);
        addActivity("22", LocalDate.of(2016, 6, 5), 1406, 4200);
        addActivity("23", LocalDate.of(2016, 6, 5), 1655, 6000);
        addActivity("24", LocalDate.of(2016, 5, 28), 1538, 5400);
        addActivity("25", LocalDate.of(2016, 5, 22), 1390, 4900);
        addActivity("26", LocalDate.of(2016, 5, 15), 1453, 4700);
        addActivity("27", LocalDate.of(2016, 5, 15), 1528, 5300);
        addActivity("28", LocalDate.of(2016, 4, 30), 1574, 5400);
        addActivity("29", LocalDate.of(2016, 4, 24), 3309, 10700);
        addActivity("30", LocalDate.of(2016, 4, 19), 2206, 7300);
    }

    private void addActivity(String id, LocalDate date, int duration, int distance) {
        Activity activity = new Activity();
        activity.setId(id);
        activity.setDate(date);
        activity.setDuration(duration);
        activity.setDistance(distance);

        this.activities.put(id, activity);
    }

    @Override
    public List<Activity> getAll() {
        List<Activity> copy = new ArrayList<>(this.activities.values());
        copy.sort(RECENT_FIRST_COMPARATOR);
        return copy;
    }

    @Override
    public void update(Activity activity) {
        this.activities.put(activity.getId(), activity);
    }

    @Override
    public void delete(Activity activity) {
        this.activities.remove(activity.getId());
    }
}
