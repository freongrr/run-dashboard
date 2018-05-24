package com.github.freongrr.run.services.impl;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;
import static org.mockito.Mockito.mock;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.Before;
import org.junit.Test;
import org.sqlite.SQLiteDataSource;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.Logger;

public class SQLiteServiceTest {

    private SQLiteDataSource dataSource;
    private SQLiteService store;

    @Before
    public void setUp() throws Exception {
        File tempFile = File.createTempFile(getClass().getSimpleName() + "-", ".sqlite");
        System.out.println("Temp DB: " + tempFile);

        dataSource = new SQLiteDataSource();
        dataSource.setUrl("jdbc:sqlite:file://" + tempFile.getAbsolutePath());

        store = new SQLiteService(dataSource, mock(Logger.class));
        store.createSchema();
    }

    @Test
    public void when_updating_a_new_activity_then_it_is_inserted_in_the_store() {
        Activity activity = newActivity();

        Activity updatedActivity = store.update(activity);

        assertStoreContent(updatedActivity);
    }

    @Test
    public void when_saving_new_activity_it_also_saves_attributes() {
        Activity activity = newActivity();
        activity.setAttribute("city", "Tokyo");
        activity.setAttribute("temperature", "18");

        store.update(activity);

        Activity savedActivity = store.getAll().get(0);
        Map<String, String> attributes = savedActivity.getAttributes();
        assertThat(attributes.keySet(), equalTo(Stream.of("city", "temperature").collect(Collectors.toSet())));
        assertThat(attributes.get("city"), equalTo("Tokyo"));
        assertThat(attributes.get("temperature"), equalTo("18"));
    }

    @Test
    public void when_updating_an_existing_activity_then_it_is_updated_in_the_store() {
        Activity activity = store.update(newActivity());
        activity.setDistance(11 * 1000);

        store.update(activity);

        assertStoreContent(activity);
    }

    @Test
    public void when_saving_an_existing_activity_it_removes_attributes_that_are_not_present_anymore() {
        Activity activity = newActivity();
        activity.setAttribute("city", "Tokyo");
        activity.setAttribute("temperature", "18");

        activity = store.update(activity);
        activity.removeAttribute("city");
        store.update(activity);

        Activity savedActivity = store.getAll().get(0);
        Map<String, String> attributes = savedActivity.getAttributes();
        assertThat(attributes.keySet(), equalTo(Collections.singleton("temperature")));
        assertThat(attributes.get("temperature"), equalTo("18"));
    }

    @Test
    public void when_deleting_an_existing_activity_then_it_is_removed_from_the_store() {
        Activity activity = store.update(newActivity());

        store.delete(activity);

        assertStoreIsEmpty();
    }

    @Test
    public void when_deleting_an_existing_activity_it_also_deletes_attributes() throws SQLException {
        Activity activity = newActivity();
        activity.setAttribute("city", "Tokyo");
        activity.setAttribute("temperature", "18");

        Activity existingActivity = store.update(activity);

        store.delete(existingActivity);

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement("SELECT COUNT(*) FROM activity_attribute");
             ResultSet resultSet = statement.executeQuery()) {
            int count = resultSet.getInt(1);
            assertThat(count, equalTo(0));
        }
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
