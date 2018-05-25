package com.github.freongrr.run.services.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.ActivityService;

@Service
@Profile("dummy")
final class DummyActivityService implements ActivityService {

    private static final Comparator<Activity> RECENT_FIRST_COMPARATOR = Comparator
            .comparing(Activity::getDate).reversed();

    private final Map<String, Activity> activities;

    @Autowired
    DummyActivityService() {
        this.activities = new ConcurrentHashMap<>();

        Random random = new Random();
        LocalDate current = LocalDate.now();
        for (int i = 0; i < 500; i++) {
            Activity activity = createActivity(random, current);
            this.update(activity);

            current = current.minusDays(1 + random.nextInt(9));
        }
    }

    private Activity createActivity(Random random, LocalDate current) {
        int distance = (30 + random.nextInt(120)) * 100;
        int splitTime = 270 + random.nextInt(60);
        int duration = splitTime * distance / 1000;

        Activity activity = new Activity();
        activity.setDate(current);
        activity.setDuration(duration);
        activity.setDistance(distance);

        int n = random.nextInt(2);
        if (n < 1) {
            activity.setAttribute("city", "New York");
        } else if (n < 4) {
            activity.setAttribute("city", "London");
        } else {
            activity.setAttribute("city", "Tokyo");
        }

        // Map month from 0 to 5 (0 is colder, 5 hottest)
        int x = (int) (5.5 - Math.min(Math.abs(current.getMonthValue() - 7.5), 5.5));
        int temperature = (x * 5) + random.nextInt(10);
        activity.setAttribute("temperature", String.valueOf(temperature));
        return activity;
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
