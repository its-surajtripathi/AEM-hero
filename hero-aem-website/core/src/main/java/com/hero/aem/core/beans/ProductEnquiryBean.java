package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude()
public class ProductEnquiryBean {

    @JsonProperty("first_name")
    private String firstName = "";

    @JsonProperty("last_name")
    private String lastName = "";

    @JsonProperty("mobile_number")
    private String mobile = "";

    @JsonProperty("tel_number")
    private String tel = "";

    @JsonProperty("email")
    private String email = "";

    @JsonProperty("vehicle_name")
    private String vehicleModel = "";

    @JsonProperty("state")
    private String state = "";

    @JsonProperty("district")
    private String district = "";

    @JsonProperty("city")
    private String city = "";

    @JsonProperty("existing_vehicle_name")
    private String existingVehicle = "";

    @JsonProperty("dealer_state")
    private String dealerState = "";

    @JsonProperty("dealer_city")
    private String dealerCity = "";

    @JsonProperty("dealer")
    private String dealerName = "";

    @JsonProperty("enquiry")
    private String briefAboutEnquiry = "";

    @JsonProperty("expected_purchase_date")
    private String expectedDateOfPurchase = "";

    @JsonProperty("gender")
    private String gender ="";

    @JsonProperty("age")
    private String age ="";

    @JsonProperty("occupation")
    private String occupation ="";

    @JsonProperty("intended_usage")
    private String intendedUse ="";

    @JsonProperty("testride_date")
    private String expectedDateOfTestRide = "";

    private String enquiryDate = "";
    private String testRideRequired = "";
    private String dealerCode = "";

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getExistingVehicle() {
        return existingVehicle;
    }

    public void setExistingVehicle(String existingVehicle) {
        this.existingVehicle = existingVehicle;
    }

    public String getDealerState() {
        return dealerState;
    }

    public void setDealerState(String dealerState) {
        this.dealerState = dealerState;
    }

    public String getDealerCity() {
        return dealerCity;
    }

    public void setDealerCity(String dealerCity) {
        this.dealerCity = dealerCity;
    }

    public String getDealerName() {
        return dealerName;
    }

    public void setDealerName(String dealerName) {
        this.dealerName = dealerName;
    }

    public String getBriefAboutEnquiry() {
        return briefAboutEnquiry;
    }

    public void setBriefAboutEnquiry(String briefAboutEnquiry) {
        this.briefAboutEnquiry = briefAboutEnquiry;
    }

    public String getExpectedDateOfPurchase() {
        return expectedDateOfPurchase;
    }

    public void setExpectedDateOfPurchase(String expectedDateOfPurchase) {
        this.expectedDateOfPurchase = expectedDateOfPurchase;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getIntendedUse() {
        return intendedUse;
    }

    public void setIntendedUse(String intendedUse) {
        this.intendedUse = intendedUse;
    }

    public String getExpectedDateOfTestRide() {
        return expectedDateOfTestRide;
    }

    public void setExpectedDateOfTestRide(String expectedDateOfTestRide) {
        this.expectedDateOfTestRide = expectedDateOfTestRide;
    }

    public String getEnquiryDate() {
        return enquiryDate;
    }

    public void setEnquiryDate(String enquiryDate) {
        this.enquiryDate = enquiryDate;
    }

    public String getTestRideRequired() {
        return testRideRequired;
    }

    public void setTestRideRequired(String testRideRequired) {
        this.testRideRequired = testRideRequired;
    }

    public String getDealerCode() {
        return dealerCode;
    }

    public void setDealerCode(String dealerCode) {
        this.dealerCode = dealerCode;
    }


}
