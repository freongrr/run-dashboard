package com.github.freongrr.run.components;

public interface Logger {

    void info(String message, Object... parameters);

    void warn(String message, Object... parameters);

    void error(String message, Object... parameters);
}
