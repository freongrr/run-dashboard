package com.github.freongrr.run.services;

import com.github.freongrr.run.beans.GraphData;
import com.github.freongrr.run.beans.GraphDataRequest;

/**
 * This interface represents a service that can build graphs.
 */
public interface GraphService {

    /**
     * Builds a graph according to the given request and returns rows of data.
     *
     * @param request the graph request
     * @return a instance of {@link GraphData}
     */
    GraphData getData(GraphDataRequest request);
}
