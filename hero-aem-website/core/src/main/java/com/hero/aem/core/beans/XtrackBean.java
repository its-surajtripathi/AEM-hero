package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude
public class XtrackBean {
    @JsonProperty("event")
    private String event = "";

    @JsonProperty("name")
    private String name = "";

    @JsonProperty("age")
    private String age = "";

    @JsonProperty("email")
    private String email = "";

    @JsonProperty("mobile")
    private String mobile = "";

    @JsonProperty("vehicle")
    private String vehicle = "";

    @JsonProperty("address")
    private String address = "";

    @JsonProperty("fb_handle")
    private String fbHandle = "";

    @JsonProperty("tweet_handle")
    private String tweetHandle = "";

    @JsonProperty("insta_handle")
    private String instaHandle = "";

    @JsonProperty("data_rider")
    private String dataRider = "";

    @JsonProperty("rider_community_name")
    private String riderCommunityName = "";

    @JsonProperty("sms_text")
    private String smsText = "";

    public String getSmsText() {
        return smsText;
    }

    public void setSmsText(String smsText) {
        this.smsText = smsText;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFbHandle() {
        return fbHandle;
    }

    public void setFbHandle(String fbHandle) {
        this.fbHandle = fbHandle;
    }

    public String getTweetHandle() {
        return tweetHandle;
    }

    public void setTweetHandle(String tweetHandle) {
        this.tweetHandle = tweetHandle;
    }

    public String getInstaHandle() {
        return instaHandle;
    }

    public void setInstaHandle(String instaHandle) {
        this.instaHandle = instaHandle;
    }

    public String getDataRider() {
        return dataRider;
    }

    public void setDataRider(String dataRider) {
        this.dataRider = dataRider;
    }

    public String getRiderCommunityName() {
        return riderCommunityName;
    }

    public void setRiderCommunityName(String riderCommunityName) {
        this.riderCommunityName = riderCommunityName;
    }

}
