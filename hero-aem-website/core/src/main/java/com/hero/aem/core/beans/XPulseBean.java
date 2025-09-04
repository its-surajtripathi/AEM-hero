package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude
public class XPulseBean {
    @JsonProperty("name")
    private String name = "";

    @JsonProperty("mobile")
    private String mobile = "";

    @JsonProperty("address")
    private String address = "";

    @JsonProperty("city")
    private String city = "";

    @JsonProperty("event")
    private String selectProgram = "";

    @JsonProperty("date")
    private String selectDate = "";

    @JsonProperty("utm_source")
    private String utmSource = "";

    @JsonProperty("utm_medium")
    private String utmMedium = "";

    @JsonProperty("utm_term")
    private String utmTerm = "";

    @JsonProperty("utm_content")
    private String utmContent = "";

    @JsonProperty("utm_campaign")
    private String utmCampaign = "";

    @JsonProperty("sms_text")
    private String smsText = "";


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getSelectProgram() {
        return selectProgram;
    }

    public void setSelectProgram(String selectProgram) {
        this.selectProgram = selectProgram;
    }

    public String getSelectDate() {
        return selectDate;
    }

    public void setSelectDate(String selectDate) {
        this.selectDate = selectDate;
    }

    public String getUtmSource() {
        return utmSource;
    }

    public void setUtmSource(String utmSource) {
        this.utmSource = utmSource;
    }

    public String getUtmMedium() {
        return utmMedium;
    }

    public void setUtmMedium(String utmMedium) {
        this.utmMedium = utmMedium;
    }

    public String getUtmTerm() {
        return utmTerm;
    }

    public void setUtmTerm(String utmTerm) {
        this.utmTerm = utmTerm;
    }

    public String getUtmContent() {
        return utmContent;
    }

    public void setUtmContent(String utmContent) {
        this.utmContent = utmContent;
    }

    public String getUtmCampaign() {
        return utmCampaign;
    }

    public void setUtmCampaign(String utmCampaign) {
        this.utmCampaign = utmCampaign;
    }

    public String getSmsText() {
        return smsText;
    }

    public void setSmsText(String smsText) {
        this.smsText = smsText;
    }
}
