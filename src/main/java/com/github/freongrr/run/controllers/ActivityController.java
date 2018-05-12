package com.github.freongrr.run.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.ActivityService;
import com.github.freongrr.run.services.Logger;

@RestController
public final class ActivityController {

    private final Logger logger;
    private final ActivityService store;

    @Autowired
    public ActivityController(Logger logger, ActivityService store) {
        this.logger = logger;
        this.store = store;
    }

    @RequestMapping(path = "/api/activities", method = RequestMethod.GET)
    public List<Activity> getActivities() {
        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        return store.getAll();
    }

    @RequestMapping(path = "/api/activities", method = RequestMethod.POST)
    public Activity saveActivity(@RequestBody Activity activity) {
        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        // Id is an empty string initially
        if ("".equals(activity.getId())) {
            activity.setId(null);
        }

        logger.info("Updating activity: %s", activity);
        return store.update(activity);
    }

    @RequestMapping(path = "/api/activities", method = RequestMethod.DELETE)
    public void deleteActivity(@RequestBody Activity activity) {
        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        logger.info("Deleting activity: %s", activity);
        store.delete(activity);
    }
}
