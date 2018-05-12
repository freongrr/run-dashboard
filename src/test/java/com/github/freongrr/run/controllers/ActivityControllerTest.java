package com.github.freongrr.run.controllers;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.Before;
import org.junit.Test;

import com.github.freongrr.run.services.ActivityService;
import com.github.freongrr.run.services.Logger;

public final class ActivityControllerTest {

    private ActivityService activityService;
    private ActivityController activityController;

    @Before
    public void setUp() {
        activityService = mock(ActivityService.class);
        activityController = new ActivityController(mock(Logger.class), activityService);
    }

    @Test
    public void when_calling_getActivities_it_invokes_getAll_on_store() {
        activityController.getActivities();
        verify(activityService).getAll();
    }

    // TODO : etc
}
