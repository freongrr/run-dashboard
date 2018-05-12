package com.github.freongrr.run.services.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.ActivityService;

@Service
@Profile("dummy")
final class DummyService implements ActivityService {

    private static final Comparator<Activity> RECENT_FIRST_COMPARATOR = Comparator
            .comparing(Activity::getDate).reversed();

    private final Map<String, Activity> activities;

    @Autowired
    DummyService() {
        this.activities = new ConcurrentHashMap<>();

        addActivity(LocalDate.of(2017, 2, 5), 2897, 10000);
        addActivity(LocalDate.of(2017, 1, 14), 1769, 6200);
        addActivity(LocalDate.of(2017, 1, 8), 3033, 10300);
        addActivity(LocalDate.of(2017, 1, 3), 1441, 5000);
        addActivity(LocalDate.of(2016, 12, 30), 1773, 6200);
        addActivity(LocalDate.of(2016, 12, 23), 2956, 9500);
        addActivity(LocalDate.of(2016, 12, 17), 2544, 8500);
        addActivity(LocalDate.of(2016, 12, 11), 2145, 7000);
        addActivity(LocalDate.of(2016, 10, 22), 3391, 11500);
        addActivity(LocalDate.of(2016, 10, 9), 1799, 6400);
        addActivity(LocalDate.of(2016, 10, 6), 1547, 5500);
        addActivity(LocalDate.of(2016, 10, 3), 1428, 4800);
        addActivity(LocalDate.of(2016, 9, 25), 2801, 9000);
        addActivity(LocalDate.of(2016, 9, 22), 1560, 5200);
        addActivity(LocalDate.of(2016, 9, 11), 2939, 10100);
        addActivity(LocalDate.of(2016, 8, 28), 1775, 6000);
        addActivity(LocalDate.of(2016, 8, 11), 1878, 6500);
        addActivity(LocalDate.of(2016, 7, 30), 2474, 8000);
        addActivity(LocalDate.of(2016, 7, 10), 1357, 4100);
        addActivity(LocalDate.of(2016, 7, 10), 1439, 5000);
        addActivity(LocalDate.of(2016, 6, 25), 1479, 5400);
        addActivity(LocalDate.of(2016, 6, 14), 1831, 6500);
        addActivity(LocalDate.of(2016, 6, 5), 1406, 4200);
        addActivity(LocalDate.of(2016, 6, 5), 1655, 6000);
        addActivity(LocalDate.of(2016, 5, 28), 1538, 5400);
        addActivity(LocalDate.of(2016, 5, 22), 1390, 4900);
        addActivity(LocalDate.of(2016, 5, 15), 1453, 4700);
        addActivity(LocalDate.of(2016, 5, 15), 1528, 5300);
        addActivity(LocalDate.of(2016, 4, 30), 1574, 5400);
        addActivity(LocalDate.of(2016, 4, 24), 3309, 10700);
        addActivity(LocalDate.of(2016, 4, 19), 2206, 7300);
    }

    private void addActivity(LocalDate date, int duration, int distance) {
        Activity activity = new Activity();
        activity.setDate(date);
        activity.setDuration(duration);
        activity.setDistance(distance);
        this.update(activity);
    }

    @Override
    public List<Activity> getAll() {
        List<Activity> copy = new ArrayList<>(this.activities.values());
        copy.sort(RECENT_FIRST_COMPARATOR);
        return copy;
    }

    @Override
    public Activity update(Activity activity) {
        if (activity.getId() == null) {
            activity.setId(String.valueOf(this.activities.size() + 1));
        }
        this.activities.put(activity.getId(), activity);
        return activity;
    }

    @Override
    public void delete(Activity activity) {
        this.activities.remove(activity.getId());
    }
}
