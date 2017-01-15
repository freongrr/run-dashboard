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

        addActivity(LocalDate.of(2016, 12, 17), 2544, 8500);
        addActivity(LocalDate.of(2016, 12, 11), 2145, 7000);
        addActivity(LocalDate.of(2016, 10, 22), 3391, 11500);
        addActivity(LocalDate.of(2016, 10, 6), 1547, 5500);
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
