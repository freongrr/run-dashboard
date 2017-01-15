package com.github.freongrr.run;

import static org.mockito.Mockito.mock;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;

import org.junit.Test;

import com.github.freongrr.run.impl.ActivityModule;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.Stage;

public class ActivityServletTest {

    @Test
    public void test_servlet_injection() throws Exception {
        ServletContext mockServletContext = mock(ServletContext.class);
        Injector injector = Guice.createInjector(Stage.DEVELOPMENT, new ActivityModule(mockServletContext));
        validateInjection(injector, ActivityServlet.class);
    }

    private static void validateInjection(Injector injector, final Class<? extends HttpServlet> servletClass) {
        Injector childInjector = injector.createChildInjector(new AbstractModule() {
            @Override
            protected void configure() {
                bind(servletClass);
            }
        });

        childInjector.getBinding(servletClass);
    }
}
