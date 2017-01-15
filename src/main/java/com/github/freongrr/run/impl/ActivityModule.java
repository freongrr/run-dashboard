package com.github.freongrr.run.impl;

import javax.inject.Named;
import javax.servlet.ServletContext;
import javax.sql.DataSource;

import org.sqlite.javax.SQLiteConnectionPoolDataSource;

import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.JsonSerializer;
import com.github.freongrr.run.components.Logger;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Scopes;
import com.google.inject.Singleton;

public final class ActivityModule extends AbstractModule {

    private final ServletContext servletContext;

    public ActivityModule(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @Override
    protected void configure() {
        binder().requireExplicitBindings();

        bind(ServletContext.class).toInstance(servletContext);
        // bind(ActivityStore.class).to(DummyStore.class).in(Scopes.SINGLETON);
        bind(ActivityStore.class).to(SQLiteStore.class).in(Scopes.SINGLETON);
        bind(JsonSerializer.class).to(GsonSerializer.class).in(Scopes.SINGLETON);
        bind(Logger.class).to(ServletLogger.class).in(Scopes.SINGLETON);
    }

    @Provides
    @Singleton
    public DataSource getDataSource(@Named("databaseUrl") String url) {
        SQLiteConnectionPoolDataSource dataSource = new SQLiteConnectionPoolDataSource();
        dataSource.setUrl(url);
        return dataSource;
    }

    @Provides
    @Singleton
    @Named("databaseUrl")
    public String getDatabaseUrl() {
        // e.g. jdbc:sqlite:file:///home/foo/bar.sqlite3
        return System.getProperty("databaseUrl");
    }
}
