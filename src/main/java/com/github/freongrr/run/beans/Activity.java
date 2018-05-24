package com.github.freongrr.run.beans;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public final class Activity {

    private String id;
    private LocalDate date;
    private int duration;
    private int distance;
    private Map<String, String> attributes;

    public Activity() {
        attributes = new HashMap<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getDistance() {
        return distance;
    }

    public void setDistance(int distance) {
        this.distance = distance;
    }

    public Map<String, String> getAttributes() {
        return Collections.unmodifiableMap(attributes);
    }

    public void setAttributes(Map<String, String> attributes) {
        this.attributes = new HashMap<>(attributes);
    }

    public void setAttribute(String attribute, String value) {
        this.attributes.put(attribute, value);
    }

    public void removeAttribute(String attribute) {
        this.attributes.remove(attribute);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        } else if (!(o instanceof Activity)) {
            return false;
        }
        Activity activity = (Activity) o;
        return duration == activity.duration &&
                distance == activity.distance &&
                Objects.equals(id, activity.id) &&
                Objects.equals(date, activity.date) &&
                Objects.equals(attributes, activity.attributes);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, duration, distance, attributes);
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", date=" + date +
                ", duration=" + duration +
                ", distance=" + distance +
                ", attributes=" + attributes +
                "}";
    }
}
