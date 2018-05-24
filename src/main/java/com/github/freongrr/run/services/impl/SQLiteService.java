package com.github.freongrr.run.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.services.ActivityService;
import com.github.freongrr.run.services.Logger;

@Service
@Profile("default")
final class SQLiteService implements ActivityService {

    // TODO : foreign keys & indexes
    private static final String[] SCHEMA_SQL = {
            "CREATE TABLE activity (" +
                    "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                    "type TEXT," +
                    "date INT," +
                    "time INT," +
                    "distance INT," +
                    "elevation INT)",
            "CREATE TABLE activity_attribute (" +
                    "activity_id STRING," +
                    "id STRING NOT NULL," +
                    "value STRING NOT NULL," +
                    "PRIMARY KEY (activity_id, id)," +
                    "FOREIGN KEY (activity_id) REFERENCES activity (id))"
    };

    private final DataSource dataSource;
    private final Logger logger;

    @Autowired
    SQLiteService(DataSource dataSource, Logger logger) {
        this.dataSource = dataSource;
        this.logger = logger;
    }

    // For tests
    void createSchema() {
        try (Connection connection = dataSource.getConnection()) {
            for (String sql : SCHEMA_SQL) {
                try (PreparedStatement statement = connection.prepareStatement(sql)) {
                    statement.execute();
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("Could not delete the record", e);
        }
    }

    @Override
    public List<Activity> getAll() {
        List<Activity> activities = new LinkedList<>();

        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = prepareSelectAll(connection);
             PreparedStatement attributeStatement = prepareSelectAttributes(connection);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                try {
                    Activity activity = new Activity();
                    activity.setId(String.valueOf(resultSet.getLong("id")));
                    activity.setDate(toLocalDate(resultSet.getInt("date")));
                    activity.setDuration(resultSet.getInt("time"));
                    activity.setDistance(resultSet.getInt("distance"));
                    populateAttributes(attributeStatement, activity);
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

    private void populateAttributes(PreparedStatement statement, Activity activity) throws SQLException {
        statement.setString(1, activity.getId());
        try (ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                String attribute = resultSet.getString("id");
                String value = resultSet.getString("value");
                activity.setAttribute(attribute, value);
            }
        }
        statement.clearParameters();
    }

    private static PreparedStatement prepareSelectAll(Connection connection) throws SQLException {
        return connection.prepareStatement(
                "SELECT " +
                        "id, date, time, distance, (time * 1000.0 / 60 / distance) " +
                        "FROM activity " +
                        "WHERE type != 'Walk' " +
                        "ORDER BY date DESC");
    }

    private PreparedStatement prepareSelectAttributes(Connection connection) throws SQLException {
        return connection.prepareStatement(
                "SELECT " +
                        "id, value " +
                        "FROM activity_attribute " +
                        "WHERE activity_id = ?");
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

            updateActivityAttributes(connection, activity);
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

    private void updateActivityAttributes(Connection connection, Activity activity) throws SQLException {
        Set<String> existingAttributes = getExistingAttributes(connection, activity);

        String activityId = activity.getId();
        try (PreparedStatement statement = connection.prepareStatement(
                "INSERT OR REPLACE INTO activity_attribute (activity_id, id, value) VALUES (?, ?, ?)")) {
            for (Map.Entry<String, String> entry : activity.getAttributes().entrySet()) {
                String attribute = entry.getKey();
                String value = entry.getValue();
                if (value != null && !value.isEmpty()) {
                    statement.setString(1, activityId);
                    statement.setString(2, attribute);
                    statement.setString(3, value);
                    statement.addBatch();
                    existingAttributes.remove(attribute);
                }
            }
            statement.executeBatch();
        }

        deleteActivityAttributes(connection, activity, existingAttributes);
    }

    private Set<String> getExistingAttributes(Connection connection, Activity activity) throws SQLException {
        Set<String> existingAttributes = new HashSet<>();
        try (PreparedStatement statement = connection.prepareStatement(
                "SELECT id FROM activity_attribute WHERE activity_id = ?")) {
            statement.setString(1, activity.getId());
            try (ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    String attribute = resultSet.getString("id");
                    existingAttributes.add(attribute);
                }
            }
        }
        return existingAttributes;
    }

    private void deleteActivityAttributes(Connection connection, Activity activity, Set<String> existingAttributes)
            throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(
                "DELETE FROM activity_attribute WHERE activity_id = ? AND id = ?")) {
            for (String attribute : existingAttributes) {
                statement.setString(1, activity.getId());
                statement.setString(2, attribute);
                statement.addBatch();
            }
            statement.executeBatch();
        }
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

            deleteActivityAttributes(connection, activity);
        } catch (SQLException e) {
            throw new RuntimeException("Could not delete the record", e);
        }
    }

    private static PreparedStatement prepareDelete(Connection connection, Activity activity) throws SQLException {
        PreparedStatement statement = connection.prepareStatement("DELETE FROM activity WHERE id = ?");
        statement.setInt(1, Integer.parseInt(activity.getId()));
        return statement;
    }

    private void deleteActivityAttributes(Connection connection, Activity activity) throws SQLException {
        try (PreparedStatement statement = connection.prepareStatement(
                "DELETE FROM activity_attribute WHERE activity_id = ?")) {
            statement.setString(1, activity.getId());
            statement.execute();
        }
    }
}
