package com.github.freongrr.run.components;

import java.util.List;

import com.github.freongrr.run.beans.Activity;

public interface ActivityStore {

    List<Activity> getAll();

    void update(Activity activity);

    void delete(Activity activity);
}
