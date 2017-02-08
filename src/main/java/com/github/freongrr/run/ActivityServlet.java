package com.github.freongrr.run;

import java.io.IOException;
import java.util.List;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.JsonSerializer;
import com.github.freongrr.run.components.Logger;

/**
 * TODO : documentation
 */
@WebServlet({"/activities"})
public final class ActivityServlet extends BaseJsonServlet {

    private Logger logger;
    private ActivityStore store;
    private JsonSerializer serializer;

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

        String json = consumeRequestData(request);
        Activity activity = serializer.deserialize(json);

        logger.info("Updating activity: %s", activity);
        store.update(activity);

        // TODO : only return the updated activity and the index it was inserted/updated at
        List<Activity> activities = store.getAll();

        String responseJson = serializer.serialize(activities);
        writeJsonResponse(response, responseJson);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // Generate a random error to test the error dialog
        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        String json = consumeRequestData(request);
        Activity activity = serializer.deserialize(json);

        logger.info("Deleting activity: %s", activity);
        store.delete(activity);

        // TODO : only return the index of the deleted activity
        List<Activity> activities = store.getAll();

        String responseJson = serializer.serialize(activities);
        writeJsonResponse(response, responseJson);
    }
}
