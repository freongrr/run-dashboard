package com.github.freongrr.run.services.impl;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.sqlite.SQLiteDataSource;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.Logger;

public class SQLiteStoreTest {

    private SQLiteService store;

    @Before
    public void setUp() throws Exception {
        File tempFile = File.createTempFile(getClass().getSimpleName() + "-", ".sqlite");
        System.out.println("Temp DB: " + tempFile);

        SQLiteDataSource dataSource = new SQLiteDataSource();
        dataSource.setUrl("jdbc:sqlite:file://" + tempFile.getAbsolutePath());

        store = new SQLiteService(dataSource, mock(Logger.class));
        store.createSchema();
    }

    @Test
    public void when_updating_a_new_activity_then_it_is_inserted_in_the_store() throws Exception {
        Activity activity = newActivity();

        Activity updatedActivity = store.update(activity);

        assertStoreContent(updatedActivity);
    }

    @Test
    public void when_updating_an_existing_activity_then_it_is_updated_in_the_store() throws Exception {
        Activity activity = store.update(newActivity());
        activity.setDistance(11 * 1000);

        store.update(activity);

        assertStoreContent(activity);
    }

    @Test
    public void when_deleting_an_existing_activity_then_it_is_removed_from_the_store() throws Exception {
        Activity activity = store.update(newActivity());
        activity.setDistance(11 * 1000);

        store.delete(activity);

        assertStoreIsEmpty();
    }

    private Activity newActivity() {
        Activity activity = new Activity();
        activity.setDate(LocalDate.of(2017, 1, 10));
        activity.setDuration(45 * 60);
        activity.setDistance(9 * 1000);
        return activity;
    }

    private void assertStoreContent(Activity activity) {
        List<Activity> activities = store.getAll();
        assertThat(activities.size(), equalTo(1));

        Activity actualActivity = activities.get(0);
        assertThat(actualActivity.getId(), notNullValue());
        assertThat(actualActivity.getId(), equalTo(activity.getId()));
        assertThat(actualActivity.getDate(), equalTo(activity.getDate()));
        assertThat(actualActivity.getDuration(), equalTo(activity.getDuration()));
        assertThat(actualActivity.getDistance(), equalTo(activity.getDistance()));
    }

    private void assertStoreIsEmpty() {
        List<Activity> activities = store.getAll();
        assertThat(activities.size(), equalTo(0));
    }
}
