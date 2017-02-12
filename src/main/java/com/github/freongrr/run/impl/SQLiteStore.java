package com.github.freongrr.run.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import javax.inject.Inject;
import javax.sql.DataSource;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.Logger;

final class SQLiteStore implements ActivityStore {

    private static final String SCHEMA_SQL = "" +
            "CREATE TABLE activity (" +
            "    id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "    type TEXT," +
            "    date INT," +
            "    time INT," +
            "    distance INT," +
            "    elevation INT)";

    private final DataSource dataSource;
    private final Logger logger;

    @Inject
    public SQLiteStore(DataSource dataSource, Logger logger) {
        this.dataSource = dataSource;
        this.logger = logger;
    }

    // For tests
    void createSchema() {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(SCHEMA_SQL)) {
            statement.execute();
        } catch (SQLException e) {
            throw new RuntimeException("Could not delete the record", e);
        }
    }

    @Override
    public List<Activity> getAll() {
        List<Activity> activities = new LinkedList<>();

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = prepareSelectAll(connection);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                try {
                    Activity activity = new Activity();
                    activity.setId(String.valueOf(resultSet.getLong("id")));
                    activity.setDate(toLocalDate(resultSet.getInt("date")));
                    activity.setDuration(resultSet.getInt("time"));
                    activity.setDistance(resultSet.getInt("distance"));
                    activities.add(activity);
                } catch (SQLException | RuntimeException e) {
                    logger.warn("Could not read record", e);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Could not query activities", e);
        }

        return activities;
    }

    private static PreparedStatement prepareSelectAll(Connection connection) throws SQLException {
        return connection.prepareStatement(
                "SELECT " +
                        "id, date, time, distance, (time * 1000.0 / 60 / distance) " +
                        "FROM activity " +
                        "WHERE type != 'Walk' " +
                        "ORDER BY date DESC");
    }

    private static LocalDate toLocalDate(int date) {
        // e.g. "20160811"
        int year = date / 10000;
        int month = date % 10000 / 100;
        int day = date % 100;
        return LocalDate.of(year, month, day);
    }

    @Override
    public Activity update(Activity activity) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = prepareUpdate(connection, activity)) {

            int updateRows = statement.executeUpdate();
            if (updateRows != 1) {
                throw new SQLException("Could not insert the record");
            }

            if (activity.getId() == null) {
                long id = selectLastAutoId(connection);
                activity.setId(String.valueOf(id));
            }
        } catch (SQLException e) {
            throw new RuntimeException("Could not insert/update the record", e);
        }
        return activity;
    }

    private static PreparedStatement prepareUpdate(Connection connection, Activity activity) throws SQLException {
        PreparedStatement statement = connection.prepareStatement(
                "INSERT OR REPLACE INTO activity (id, type, date, time, distance) VALUES (?, ?, ?, ?, ?)");
        if (activity.getId() == null) {
            statement.setNull(1, Types.INTEGER);
        } else {
            statement.setInt(1, Integer.parseInt(activity.getId()));
        }
        statement.setString(2, "Run");
        statement.setInt(3, fromLocalDate(activity.getDate()));
        statement.setInt(4, activity.getDuration());
        statement.setInt(5, activity.getDistance());
        return statement;
    }

    private static int fromLocalDate(LocalDate date) {
        // e.g. "20160811"
        return date.getYear() * 10000 + date.getMonthValue() * 100 + date.getDayOfMonth();
    }

    private long selectLastAutoId(Connection connection) throws SQLException {
        // HACK - This class could work with any JDBC data source, except this...
        try (PreparedStatement idStatement = connection.prepareStatement("SELECT last_insert_rowid()");
             ResultSet resultSet = idStatement.executeQuery()) {

            if (!resultSet.next()) {
                throw new SQLException("Could not fetch the new activity id");
            }
            return resultSet.getLong(1);
        }
    }

    @Override
    public void delete(Activity activity) {
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = prepareDelete(connection, activity)) {

            statement.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("Could not delete the record", e);
        }
    }

    private static PreparedStatement prepareDelete(Connection connection, Activity activity) throws SQLException {
        PreparedStatement statement = connection.prepareStatement("DELETE FROM activity WHERE id = ?");
        statement.setInt(1, Integer.parseInt(activity.getId()));
        return statement;
    }
}
