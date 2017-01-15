package com.github.freongrr.run.impl;

import java.util.Arrays;
import javax.inject.Inject;
import javax.servlet.ServletContext;

import com.github.freongrr.run.components.Logger;

final class ServletLogger implements Logger {

    private final ServletContext servletContext;

    @Inject
    ServletLogger(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    @Override
    public void info(String message, Object... parameters) {
        log(message, parameters);
    }

    @Override
    public void warn(String message, Object... parameters) {
        log("WARN: " + message, parameters);
    }

    @Override
    public void error(String message, Object... parameters) {
        log("ERROR: " + message, parameters);
    }

    private void log(String message, Object[] parameters) {
        if (parameters.length > 0 && parameters[parameters.length - 1] instanceof Throwable) {
            Throwable cause = (Throwable) parameters[parameters.length - 1];
            Object[] parametersCopy = Arrays.copyOf(parameters, parameters.length - 1);
            this.servletContext.log(String.format(message, parametersCopy), cause);
        } else {
            this.servletContext.log(String.format(message, parameters));
        }
    }
}
