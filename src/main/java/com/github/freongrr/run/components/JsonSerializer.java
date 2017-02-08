package com.github.freongrr.run.components;

import java.util.List;

import com.github.freongrr.run.beans.Activity;

public interface JsonSerializer {

    String serialize(List<Activity> activities);

    Activity deserialize(String json);
}
