package com.hero.aem.core.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonObject;

public class CSVUtils {

    static StaticWrapper jcrUtilWrapper = new StaticWrapper();

    public static ArrayList<JsonObject> getDataFromFile(BufferedReader csvFile) throws IOException {
        Map<String, Integer> columnHeadings = new HashMap<>();
        ArrayList<JsonObject> csvDataList = new ArrayList<>();
        String csvLineVal = csvFile.readLine();
        String[] firstRow = csvLineVal.split(",", -1);
        for (int i = 0; i < firstRow.length; i++) {
            columnHeadings.put(jcrUtilWrapper.createValidName(firstRow[i]), i);
        }
        while ((csvLineVal = csvFile.readLine()) != null) {
            JsonObject rowValueJson = new JsonObject();
            if (csvLineVal.contains(",")) {
                String[] rowValues = csvLineVal.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)", -1);
                if (columnHeadings.size() > rowValues.length) {
                    // can do error handling here
                    break;
                }
                for (String columnString : columnHeadings.keySet()) {
                    rowValueJson.addProperty(columnString, rowValues[columnHeadings.get(columnString)]);
                }
                csvDataList.add(rowValueJson);
            }
        }
        return csvDataList;
    }

    /**
     * This method returns back a valid name that can be used to create nodes. All
     * special characters will be replaced by - and spaces by _.
     * 
     * @param rowData
     * @param property
     * @return formatted string which can be directly used to create nodes.
     */
    public static String getNodeName(JsonObject rowData, String property) {
        return jcrUtilWrapper.createValidName(rowData.get(property).getAsString());
    }
}
