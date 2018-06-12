package com.github.freongrr.run.controllers;

import javax.servlet.http.HttpServlet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.freongrr.run.beans.GraphData;
import com.github.freongrr.run.beans.GraphDataRequest;
import com.github.freongrr.run.services.GraphService;
import com.github.freongrr.run.services.Logger;

@RestController
public class GraphController extends HttpServlet {

    private final Logger logger;
    private final GraphService source;

    @Autowired
    public GraphController(Logger logger, GraphService source) {
        this.logger = logger;
        this.source = source;
    }

    @RequestMapping(path = "/api/graph", method = RequestMethod.GET)
    public GraphData getGraph(
            @RequestParam("interval") String interval,
            @RequestParam("measure") String measure,
            @RequestParam("grouping") String grouping) {

        GraphDataRequest request = new GraphDataRequest(interval, measure, grouping);
        logger.info("Querying graph for " + request);
        return source.getData(request);
    }
}
