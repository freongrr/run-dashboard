package com.github.freongrr.run.impl;

import javax.servlet.ServletContext;

import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.JsonSerializer;
import com.github.freongrr.run.components.Logger;
import com.google.inject.AbstractModule;
import com.google.inject.Scopes;

public final class ActivityModule extends AbstractModule {

    private final ServletContext servletContext;

    public ActivityModule(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @Override
    protected void configure() {
        binder().requireExplicitBindings();

        bind(ServletContext.class).toInstance(servletContext);
        bind(ActivityStore.class).to(DummyStore.class).in(Scopes.SINGLETON);
        bind(JsonSerializer.class).to(GsonSerializer.class).in(Scopes.SINGLETON);
        bind(Logger.class).to(ServletLogger.class).in(Scopes.SINGLETON);
    }
}
