package com.github.freongrr.run.components;

import java.util.List;

import com.github.freongrr.run.beans.Activity;

public interface JsonSerializer {

    String serializeActivities(List<Activity> activities);

    Activity deserializeActivity(String json);

    String serializeGraphRows(Object[][] rows);
}
