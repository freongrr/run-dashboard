package com.github.freongrr.run.impl;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDate;
import javax.sql.DataSource;

import org.junit.Before;
import org.junit.Test;

import com.github.freongrr.run.components.Logger;

public final class SQLGraphSourceTest {

    private DataSource dataSource;
    private Connection connection;
    private PreparedStatement preparedStatement;
    private ResultSet resultSet;

    @Before
    public void setUp() throws Exception {
        dataSource = mock(DataSource.class);

        connection = mock(Connection.class);
        when(dataSource.getConnection()).thenReturn(connection);

        preparedStatement = mock(PreparedStatement.class);
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);

        resultSet = mock(ResultSet.class);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
    }

    @Test
    public void test_month_query() throws Exception {
        String sql = SQLGraphSource.monthQuery(LocalDate.of(2017, 2, 15), 6);
        assertThat(sql, equalTo("" +
                "SELECT \"2017-02\" AS month, 20170201 AS start, 20170228 AS end\n" +
                "UNION SELECT \"2017-01\" AS month, 20170101 AS start, 20170131 AS end\n" +
                "UNION SELECT \"2016-12\" AS month, 20161201 AS start, 20161231 AS end\n" +
                "UNION SELECT \"2016-11\" AS month, 20161101 AS start, 20161130 AS end\n" +
                "UNION SELECT \"2016-10\" AS month, 20161001 AS start, 20161031 AS end\n" +
                "UNION SELECT \"2016-09\" AS month, 20160901 AS start, 20160930 AS end\n"));
    }

    @Test
    public void test_query_over_12_months() throws Exception {
        SQLGraphSource graphSource = new SQLGraphSource(mock(Logger.class), dataSource);

        when(resultSet.next()).thenReturn(true, false);
        when(resultSet.getString(1)).thenReturn("2017-02");
        when(resultSet.getObject(2)).thenReturn(50D);

        Object[][] rows = graphSource.queryOverLast12Months("SUM(A.time)");
        assertThat(rows.length, equalTo(1));
        assertThat(rows[0].length, equalTo(2));
        assertThat(rows[0][0], equalTo("2017-02"));
        assertThat(rows[0][1], equalTo(50D));
    }
}
    