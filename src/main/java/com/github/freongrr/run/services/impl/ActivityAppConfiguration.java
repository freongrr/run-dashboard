package com.github.freongrr.run.services.impl;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.sqlite.javax.SQLiteConnectionPoolDataSource;

@Configuration
public class ActivityAppConfiguration {

    @Bean
    public DataSource getDataSource(@Value("#{systemProperties.databaseUrl}") String url) {
        SQLiteConnectionPoolDataSource dataSource = new SQLiteConnectionPoolDataSource();
        dataSource.setUrl(url);
        return dataSource;
    }
}
