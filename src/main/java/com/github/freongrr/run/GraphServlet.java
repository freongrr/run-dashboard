package com.github.freongrr.run;

import java.io.IOException;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.github.freongrr.run.components.GraphSource;
import com.github.freongrr.run.components.JsonSerializer;
import com.github.freongrr.run.components.Logger;

/**
 * TODO : documentation
 */
@WebServlet({"/graph/*"})
public class GraphServlet extends BaseJsonServlet {

    private Logger logger;
    private GraphSource source;
    private JsonSerializer serializer;

    @Inject
    public void setLogger(Logger logger) {
        this.logger = logger;
    }

    @Inject
    public void setSource(GraphSource source) {
        this.source = source;
    }

    @Inject
    public void setSerializer(JsonSerializer serializer) {
        this.serializer = serializer;
    }

    // TODO : get all graph types

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {

        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        String graphTypeId = request.getRequestURI().replaceAll("/graph/", "");

        Object[][] rows = source.getRows(graphTypeId);
        String responseJson = serializer.serializeGraphRows(rows);

        writeJsonResponse(response, responseJson);
    }
}
