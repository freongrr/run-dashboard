package com.github.freongrr.run;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.ActivityRequest;
import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.JsonSerializer;
import com.github.freongrr.run.components.Logger;
import com.github.freongrr.run.impl.ActivityModule;
import com.google.inject.Guice;
import com.google.inject.Injector;

/**
 * TODO : documentation
 */
@WebServlet({"/activities"})
public final class ActivityServlet extends HttpServlet {

    private Logger logger;
    private ActivityStore store;
    private JsonSerializer serializer;

    @Override
    public void init() throws ServletException {
        super.init();

        try {
            Injector injector = Guice.createInjector(new ActivityModule(getServletContext()));
            injector.injectMembers(this);
        } catch (RuntimeException e) {
            log("Could not initialize the data source", e);
        }
    }

    @Inject
    public void setLogger(Logger logger) {
        this.logger = logger;
    }

    @Inject
    public void setStore(ActivityStore store) {
        this.store = store;
    }

    @Inject
    public void setSerializer(JsonSerializer serializer) {
        this.serializer = serializer;
    }

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {

        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        List<Activity> activities = store.getAll();

        String responseJson = serializer.serialize(activities);
        writeJsonResponse(response, responseJson);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        String json = consoleRequestData(request);
        ActivityRequest updateRequest = serializer.deserializeRequest(json);
        Activity activity = updateRequest.getActivity();

        logger.info("Updating activity: %s", activity);
        Activity updatedActivity = store.update(activity);

        String responseJson = serializer.serialize(updatedActivity);
        writeJsonResponse(response, responseJson);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        String json = consoleRequestData(request);
        ActivityRequest updateRequest = serializer.deserializeRequest(json);
        Activity activity = updateRequest.getActivity();

        logger.info("Deleting activity: %s", activity);
        store.delete(activity);

        // No response
        writeJsonResponse(response, "{}");
    }

    private static String consoleRequestData(HttpServletRequest request) throws IOException {
        try (BufferedReader reader = request.getReader()) {
            return reader.lines().collect(Collectors.joining(""));
        }
    }

    private static void writeJsonResponse(HttpServletResponse response, String json) throws IOException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setContentLength(json.length());
        response.getWriter().print(json);
    }
}
