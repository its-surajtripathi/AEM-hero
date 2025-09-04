package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude
public class ServiceMockTestBean {

    @JsonProperty("mockTestFullName")
    private String mockTestFullName = "";

    @JsonProperty("mockTestEmail")
    private String mockTestEmail = "";

    public String getMockTestFullName() {
        return mockTestFullName;
    }

    public void setMockTestFullName(String mockTestFullName) {
        this.mockTestFullName = mockTestFullName;
    }

    public String getMockTestEmail() {
        return mockTestEmail;
    }

    public void setMockTestEmail(String mockTestEmail) {
        this.mockTestEmail = mockTestEmail;
    }
    
}
