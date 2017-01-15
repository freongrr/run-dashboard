package com.github.freongrr.run.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import javax.inject.Inject;
import javax.inject.Named;
import javax.sql.DataSource;

import org.sqlite.javax.SQLiteConnectionPoolDataSource;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.Logger;

final class SQLiteStore implements ActivityStore {

    /* Schema (for now)
    
       CREATE TABLE activity (
           type TEXT,
           date INT,
           time INT,
           distance INT,
           elevation INT
       );
     */

    private final Logger logger;
    private final String databaseUrl;

    private SQLiteConnectionPoolDataSource dataSource;

    @Inject
    public SQLiteStore(Logger logger, @Named("databaseUrl") String databaseUrl) {
        this.logger = logger;
        this.databaseUrl = databaseUrl;
    }

    private synchronized DataSource getDataSource() {
        if (dataSource == null) {
            dataSource = new SQLiteConnectionPoolDataSource();
            dataSource.setUrl(databaseUrl);
        }
        return dataSource;
    }

    @Override
    public List<Activity> getAll() {
        List<Activity> activities = new LinkedList<>();

        // TODO : do I need to use getPooledConnection?
        try (Connection connection = getDataSource().getConnection();
             PreparedStatement statement = connection.prepareStatement(
                     "SELECT " +
                             "date, " +
                             "time, distance, (time * 1000.0 / 60 / distance) " +
                             "FROM activity " +
                             "WHERE type != 'Walk' " +
                             "ORDER BY 1");
             ResultSet resultSet = statement.executeQuery()) {

            int index = 1;
            while (resultSet.next()) {
                try {
                    Activity activity = new Activity();
                    // TODO : use a proper id!
                    activity.setId(String.valueOf(++index));
                    activity.setDate(toLocalDate(resultSet.getInt("date")));
                    activity.setDuration(resultSet.getInt("time"));
                    activity.setDistance(resultSet.getInt("distance"));
                    activities.add(activity);
                } catch (SQLException e) {
                    logger.warn("Could not read record", e);
                }
            }
        } catch (SQLException e) {
            logger.error("Could not query the data source", e);
        }

        Collections.reverse(activities);
//        return activities.subList(0, 50);
        return activities;
    }

    private static LocalDate toLocalDate(int date) throws SQLException {
        // e.g. "20160811"
        int year = date / 10000;
        int month = date % 10000 / 100;
        int day = date % 100;
        return LocalDate.of(year, month, day);
    }

    @Override
    public void update(Activity activity) {
        // TODO : implement method

    }

    @Override
    public void delete(Activity activity) {
        // TODO : implement method

    }
}
