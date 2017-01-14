package com.github.freongrr.run.components;

import java.util.List;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.ActivityRequest;

public interface JsonSerializer {

    String serialize(Activity activity);

    String serialize(List<Activity> activities);

    ActivityRequest deserializeRequest(String json);
}
