package com.github.freongrr.run.controllers;

import javax.servlet.http.HttpServlet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.github.freongrr.run.services.GraphService;
import com.github.freongrr.run.services.Logger;

/**
 * TODO : documentation
 */
@RestController
public class GraphController extends HttpServlet {

    private final Logger logger;
    private final GraphService source;

    @Autowired
    public GraphController(Logger logger, GraphService source) {
        this.logger = logger;
        this.source = source;
    }

    // TODO : get all graph types

    @RequestMapping(path = "/graph/{graphTypeId}", method = RequestMethod.GET)
    public Object[][] getGraph(@PathVariable String graphTypeId) {
        return source.getRows(graphTypeId);
    }
}
