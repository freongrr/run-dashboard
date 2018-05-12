package com.github.freongrr.run;

import static org.mockito.Mockito.mock;

import javax.servlet.ServletContext;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import com.github.freongrr.run.controllers.ActivityController;

public final class ApplicationTest {

    // TODO : how do I rest "bindings" without actually instantiating anything (like with Guice)

    @Test
    public void test_real_injection() {
        System.setProperty("databaseUrl", "foo");

        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.registerBean(ServletContext.class, () -> mock(ServletContext.class));
        context.register(Application.class);
        context.refresh();

        // TODO : do I need to call getBean to get an error?
        context.getBean(ActivityController.class);
    }
}
