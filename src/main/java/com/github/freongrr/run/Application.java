package com.github.freongrr.run;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class Application extends SpringBootServletInitializer /* only required when building a WAR */ {

    /* only required when building a WAR */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // TODO : add more?
        return application.sources(Application.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
