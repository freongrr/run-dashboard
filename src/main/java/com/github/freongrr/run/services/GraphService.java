package com.github.freongrr.run.services;

import com.github.freongrr.run.beans.GraphDataRequest;

/**
 * This interface represents a service that can build graphs.
 */
public interface GraphService {

    /**
     * Builds a graph according to the given request and returns a array of data. The first value in each row is the
     * value on the axis. It can be any type (e.g. "March 2018"), the other values are {@link Double}.
     *
     * @param request the graph request
     * @return an array of rows
     */
    Object[][] getRows(GraphDataRequest request);
}
