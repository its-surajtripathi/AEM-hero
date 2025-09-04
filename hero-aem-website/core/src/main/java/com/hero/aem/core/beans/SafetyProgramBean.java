package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude
public class SafetyProgramBean {
    @JsonProperty("enrolltype")
    private String enrolltype = "";

    @JsonProperty("fullname")
    private String fullname = "";

    @JsonProperty("mobileno")
    private String mobileno = "";

    @JsonProperty("email")
    private String email = "";

    @JsonProperty("enrollmentNameVal")
    private String enrollmentNameVal = "";

    @JsonProperty("dateEnroll")
    private String date = "";

    @JsonProperty("ttcenterNameVal")
    private String location = "";

    @JsonProperty("drive-radio")
    private String ridetwowheeler = "";

    @JsonProperty("license-radio")
    private String validLicense = "";

    @JsonProperty("organisationfullname")
    private String orgName = "";

    @JsonProperty("participantsNo")
    private String participantCount;

    public String getEnrolltype() {
        return enrolltype;
    }

    public void setEnrolltype(String enrolltype) {
        this.enrolltype = enrolltype;
    }

    public String getFullName() {
        return fullname;
    }

    public void setFullName(String fullname) {
        this.fullname = fullname;
    }

    public String getMobile() {
        return mobileno;
    }

    public void setMobile(String mobileno) {
        this.mobileno = mobileno;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEnrollprogram() {
        return enrollmentNameVal;
    }

    public void setEnrollprogram(String enrollmentNameVal) {
        this.enrollmentNameVal = enrollmentNameVal;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRidetwowheeler() {
        return ridetwowheeler;
    }

    public void setRidetwowheeler(String ridetwowheeler) {
        this.ridetwowheeler = ridetwowheeler;
    }

    public String getValidLicense() {
        return validLicense;
    }

    public void setValidLicense(String validLicense) {
        this.validLicense = validLicense;
    }

    public String getOrgName() {
        return orgName;
    }

    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    public String getParticipantCount() {
        return participantCount;
    }

    public void setParticipantCount(String participantCount) {
        this.participantCount = participantCount;
    }
}
