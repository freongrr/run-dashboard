package com.github.freongrr.run.services.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.github.freongrr.run.services.GraphDataRequest;
import com.github.freongrr.run.services.GraphService;
import com.github.freongrr.run.services.Logger;

@Service
@Profile("sql")
final class SQLGraphService implements GraphService {

    private final Logger logger;
    private final DataSource dataSource;

    @Autowired
    SQLGraphService(Logger logger, DataSource dataSource) {
        this.logger = logger;
        this.dataSource = dataSource;
    }

    @Override
    public Object[][] getRows(GraphDataRequest request) {
        // TODO : handle time interval
        switch (request.getMeasure()) {
            case GraphDataRequest.MEASURE_DURATION:
                return queryOverLast12Months("SUM(A.time)");
            case GraphDataRequest.MEASURE_DISTANCE:
                return queryOverLast12Months("SUM(A.distance)");
            case GraphDataRequest.MEASURE_TIME_1KM:
                return queryOverLast12Months("AVG(1000 * A.time / A.distance)");
            default:
                throw new IllegalArgumentException("Invalid graph request: " + request);
        }
    }

    Object[][] queryOverLast12Months(String... expressions) {
        StringBuilder builder = new StringBuilder();
        for (String expression : expressions) {
            builder.append(", ").append(expression);
        }

        String sql = "" +
                "SELECT T.month" + builder.toString() +
                "  FROM (" + monthQuery(LocalDate.now(), 12) + ") T" +
                "  LEFT OUTER JOIN activity A ON A.date >= T.start AND A.date < T.end" +
                " GROUP BY T.month" +
                " ORDER BY T.month DESC";

        logger.info("Querying with:\n" + sql);

        List<Object[]> rows = new LinkedList<>();
        try (Connection connection = dataSource.getConnection();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {

            while (resultSet.next()) {
                Object[] row = new Object[1 + expressions.length];
                row[0] = resultSet.getString(1);
                for (int i = 0; i < expressions.length; i++) {
                    Object object = resultSet.getObject(2);
                    if (object == null) {
                        // TODO : using a special value may work better here, but 0 does not work well on line charts...
                        row[i + 1] = null;
                    } else {
                        row[i + 1] = ((Number) object).doubleValue();
                    }
                }
                rows.add(row);
            }
        } catch (SQLException e) {
            throw new RuntimeException("Could not query activities", e);
        }

        return rows.toArray(new Object[rows.size()][]);
    }

    static String monthQuery(LocalDate from, final int count) {
        final StringBuilder builder = new StringBuilder();

        LocalDate d = from;
        for (int i = 0; i < count; i++) {
            LocalDate startOfMonth = d.withDayOfMonth(1);
            LocalDate endOfMonth = d.plusMonths(1).withDayOfMonth(1).minusDays(1);

            if (i != 0) {
                builder.append("UNION ");
            }

            builder.append("SELECT ");
            builder.append('"');
            builder.append(d.getYear());
            builder.append('-');
            builder.append(d.getMonthValue() < 10 ? "0" : "").append(d.getMonthValue());
            builder.append('"');
            builder.append(" AS month, ");
            builder.append(fromLocalDate(startOfMonth));
            builder.append(" AS start, ");
            builder.append(fromLocalDate(endOfMonth));
            builder.append(" AS end\n");

            d = d.minusMonths(1);
        }

        return builder.toString();
    }

    private static int fromLocalDate(LocalDate date) {
        // e.g. "20160811"
        return date.getYear() * 10000 + date.getMonthValue() * 100 + date.getDayOfMonth();
    }
}
