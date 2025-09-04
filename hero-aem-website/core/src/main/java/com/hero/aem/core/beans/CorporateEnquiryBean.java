package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude
public class CorporateEnquiryBean {
    @JsonProperty("full_name")
    private String name = "";

    @JsonProperty("designation")
    private String designation = "";

    @JsonProperty("company")
    private String companyName = "";

    @JsonProperty("mobile_number")
    private String mobile = "";

    @JsonProperty("phone_number")
    private String tel = "";

    @JsonProperty("email")
    private String email = "";

    @JsonProperty("address")
    private String address = "";

    @JsonProperty("state_global")
    private String state = "";

    @JsonProperty("city_global")
    private String city = "";

    @JsonProperty("category")
    private String category = "";

    @JsonProperty("addt_info")
    private String otherInfo = "";

    @JsonProperty("countryId")
    private String countryId = "";

    @JsonProperty("requirements")
    private String requirements = "";

    @JsonProperty("enquiry_date")
    private String enquiryDate="";

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getOtherInfo() {
        return otherInfo;
    }

    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }

    public String getCountryId() {
        return countryId;
    }

    public void setCountryId(String countryId) {
        this.countryId = countryId;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getEnquiryDate() {
        return enquiryDate;
    }

    public void setEnquiryDate(String enquiryDate) {
        this.enquiryDate = enquiryDate;
    }


}
