package com.github.freongrr.run;

import java.io.IOException;
import javax.inject.Inject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.github.freongrr.run.components.ActivityStore;
import com.github.freongrr.run.components.Logger;

/**
 * TODO : documentation
 */
@WebServlet({"/graph/*"})
public class GraphServlet extends BaseJsonServlet {

    private Logger logger;
    private ActivityStore store;

    @Inject
    public void setLogger(Logger logger) {
        this.logger = logger;
    }

    @Inject
    public void setStore(ActivityStore store) {
        this.store = store;
    }

    // TODO : get all graph types

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {

        if (Math.random() < 0.1) {
            throw new IllegalStateException("Boom!");
        }

        String graphTypeId = request.getRequestURI().replaceAll("/graph/", "");
        // String graphTypeId = request.getParameterNames().nextElement();

        switch (graphTypeId) {
            case "last12MonthsDuration":
                break;
            case "last12MonthsDistance":
                break;
            case "last12MonthsSplitTime":
                break;
            case "last12MonthsVsPrevious12Months":
                break;
            case "last30DaysDuration":
                break;
            case "last30DaysDistance":
                break;
            case "last30DaysSplitTime":
                break;
            case "last30DaysVsPrevious30Days":
                break;
            case "last30DaysVsAYearAgo":
                break;
            default:
                throw new IllegalArgumentException("Invalid graph type: " + graphTypeId);
        }

        String responseJson = "[[\"2017-02\", 10, 20], [\"2017-01\", 15, 22], [\"2016-12\", 20, 40]]";
        writeJsonResponse(response, responseJson);
    }
}
