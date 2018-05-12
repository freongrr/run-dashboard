package com.github.freongrr.run.services;

import java.util.List;

import com.github.freongrr.run.beans.Activity;

public interface ActivityService {

    List<Activity> getAll();

    Activity update(Activity activity);

    void delete(Activity activity);
}
