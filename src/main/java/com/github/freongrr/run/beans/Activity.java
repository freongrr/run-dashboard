package com.github.freongrr.run.beans;

import java.time.LocalDate;

public class Activity {

    private String id;
    private LocalDate date;
    private int duration;
    private int distance;

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof Activity))
            return false;

        Activity activity = (Activity) o;

        if (duration != activity.duration)
            return false;
        if (distance != activity.distance)
            return false;
        if (id != null ? !id.equals(activity.id) : activity.id != null)
            return false;
        return date != null ? date.equals(activity.date) : activity.date == null;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + duration;
        result = 31 * result + distance;
        return result;
    }

    @Override
    public String toString() {
        return "{" +
                "id=" + id +
                ", date=" + date +
                ", duration=" + duration +
                ", distance=" + distance +
                "}";
    }
}
