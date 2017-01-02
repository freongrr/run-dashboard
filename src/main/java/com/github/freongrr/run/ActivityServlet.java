package com.github.freongrr.run;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.stream.Collectors;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * TODO : documentation
 */
public final class ActivityServlet extends HttpServlet {

    @Override
    protected void doGet(final HttpServletRequest request, final HttpServletResponse response)
            throws ServletException, IOException {

        if (request.getRequestURI().equals("/activities")) {
            // Generate a random error to test the error dialog
            if (Math.random() < 0.1) {
                throw new IllegalStateException("Boom!");
            }

            final String activities = "[" +
                    "{" +
                    "    \"id\": \"1\"," +
                    "    \"date\": \"2016-12-17\"," +
                    "    \"duration\": 2544," +
                    "    \"distance\": 8500" +
                    "}, {" +
                    "    \"id\": \"2\"," +
                    "    \"date\": \"2016-12-11\"," +
                    "    \"duration\": 2145," +
                    "    \"distance\": 7000" +
                    "}, {" +
                    "    \"id\": \"3\"," +
                    "    \"date\": \"2016-10-22\"," +
                    "    \"duration\": 3391," +
                    "    \"distance\": 11500" +
                    "}, {" +
                    "    \"id\": \"4\"," +
                    "    \"date\": \"2016-10-06\"," +
                    "    \"duration\": 1547," +
                    "    \"distance\": 5500" +
                    "}]";

            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setContentLength(activities.length());
            response.getWriter().print(activities);
        } else {
            super.doGet(request, response);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        if (request.getRequestURI().equals("/activities")) {
            try (BufferedReader reader = request.getReader()) {
                String json = reader.lines().collect(Collectors.joining(""));

                // Generate a random error to test the error dialog
                if (Math.random() < 0.1) {
                    throw new IllegalStateException("Boom!");
                } else {
                    // Return the JSON string as-is 
                    response.setStatus(HttpServletResponse.SC_OK);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.setContentLength(json.length());
                    response.getWriter().print(json);
                }
            }
        } else {
            super.doPost(request, response);
        }
    }
}
