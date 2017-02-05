package com.github.freongrr.run.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import javax.inject.Inject;

import com.github.freongrr.run.beans.Activity;
import com.github.freongrr.run.beans.ActivityRequest;
import com.github.freongrr.run.components.JsonSerializer;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;

final class GsonSerializer implements JsonSerializer {

    private final Gson gson;

    @Inject
    GsonSerializer() {
        GsonBuilder builder = new GsonBuilder();
        builder.registerTypeAdapter(LocalDate.class, new LocalDateTypeAdapter());

        gson = builder.create();
    }

    @Override
    public String serialize(Activity activity) {
        return gson.toJson(activity);
    }

    @Override
    public String serialize(List<Activity> activities) {
        return gson.toJson(activities);
    }

    @Override
    public ActivityRequest deserializeRequest(String json) {
        ActivityRequest activityRequest = gson.fromJson(json, ActivityRequest.class);
        if (activityRequest.getActivity() != null && "".equals(activityRequest.getActivity().getId())) {
            activityRequest.getActivity().setId(null);
        }
        return activityRequest;
    }

    // Use "YYYY-MM-DD" for LocalDate
    private static class LocalDateTypeAdapter extends TypeAdapter<LocalDate> {

        @Override
        public void write(JsonWriter out, LocalDate value) throws IOException {
            String stringValue = String.format("%04d-%02d-%02d",
                    value.getYear(), value.getMonthValue(), value.getDayOfMonth());
            out.value(stringValue);
        }

        @Override
        public LocalDate read(JsonReader in) throws IOException {
            String s = in.nextString();
            int year = Integer.parseInt(s.substring(0, 4));
            int month = Integer.parseInt(s.substring(5, 7));
            int day = Integer.parseInt(s.substring(8, 10));
            return LocalDate.of(year, month, day);
        }
    }
}
