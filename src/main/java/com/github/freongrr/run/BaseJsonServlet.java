package com.github.freongrr.run;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.stream.Collectors;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.github.freongrr.run.impl.ActivityModule;
import com.google.inject.Guice;
import com.google.inject.Injector;

/**
 * Simple injected servlet that returns JSON.
 */
abstract class BaseJsonServlet extends HttpServlet {

    private static final String INJECTOR_ATTRIBUTE = "injector";

    @Override
    public void init() throws ServletException {
        super.init();

        try {
            Injector injector = createInjector();
            injector.injectMembers(this);
        } catch (RuntimeException e) {
            log("Could not inject members of " + getClass().getSimpleName(), e);
        }
    }

    private synchronized Injector createInjector() {
        ServletContext servletContext = getServletContext();
        Injector injector = (Injector) servletContext.getAttribute(INJECTOR_ATTRIBUTE);
        if (injector == null) {
            injector = Guice.createInjector(new ActivityModule(servletContext));
            servletContext.setAttribute(INJECTOR_ATTRIBUTE, injector);
        }
        return injector;
    }

    static String consumeRequestData(HttpServletRequest request) throws IOException {
        try (BufferedReader reader = request.getReader()) {
            return reader.lines().collect(Collectors.joining(""));
        }
    }

    static void writeJsonResponse(HttpServletResponse response, String json) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setContentLength(json.length());
        response.getWriter().print(json);
    }
}
