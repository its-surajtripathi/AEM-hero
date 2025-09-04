package com.hero.aem.core.util;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import com.google.gson.JsonObject;

public class JsonComparator implements Comparator<JsonObject> {

    List<String> sortingFields;

    public JsonComparator(String... sortingFields) {
        this.sortingFields = Arrays.asList(sortingFields);
    }

    @Override
    public int compare(JsonObject rowData1, JsonObject rowData2) {
        int result = 0;
        for (String field : sortingFields) {
            if (result == 0) {
                String value1 = rowData1.get(field).getAsString().toLowerCase();
                String value2 = rowData2.get(field).getAsString().toLowerCase();
                result = value1.compareTo(value2);
            } else {
                break;
            }
        }
        return result;
    }
}
