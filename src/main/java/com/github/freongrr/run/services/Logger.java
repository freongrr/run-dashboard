package com.github.freongrr.run.services;

// TODO : why did I write my own logger?
public interface Logger {

    void info(String message, Object... parameters);

    void warn(String message, Object... parameters);

    void error(String message, Object... parameters);
}
