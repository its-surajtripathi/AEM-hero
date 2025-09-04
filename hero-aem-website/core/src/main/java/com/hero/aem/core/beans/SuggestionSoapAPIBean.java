package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude()
public class SuggestionSoapAPIBean {

    @JsonProperty("first_name")
    private String firstName = "";

    @JsonProperty("last_name")
    private String lastName = "";

    @JsonProperty("telephone")
    private String tel = "";

    @JsonProperty("email")
    private String email = "";

    @JsonProperty("address_1")
    private String addressLine1 = "";

    @JsonProperty("address_2")
    private String addressLine2 = "";

    @JsonProperty("state")
    private String state = "";

    @JsonProperty("city")
    private String city = "";

    @JsonProperty("town")
    private String town = "";

    @JsonProperty("pin")
    private String pin = "";

    @JsonProperty("vehicle_name")
    private String vehicleModel = "";

    @JsonProperty("vehicle_reg_no")
    private String vehicleRegdNo = "";

    @JsonProperty("odometer_reading")
    private String odometer = "";

    @JsonProperty("malfunction_date")
    private String malfunctionDate = "";

    @JsonProperty("dealer_state")
    private String dealerState = "";

    @JsonProperty("dealer_city")
    private String dealerCity = "";

    @JsonProperty("dealer")
    private String dealerName = "";

    @JsonProperty("complaint_stream")
    private String complaintStream = "";

    @JsonProperty("complaint_category")
    private String complaintCategory = "";

    @JsonProperty("complaint")
    private String complaintDesc = "";

    @JsonProperty("mobile")
    private String cellularPhone = "";

    @JsonProperty("vin_number")
    private String hhmlVINNumber = "";


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

    public String getCellularPhone() {
        return cellularPhone;
    }

    public void setCellularPhone(String cellularPhone) {
        this.cellularPhone = cellularPhone;
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

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
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

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleRegdNo() {
        return vehicleRegdNo;
    }

    public void setVehicleRegdNo(String vehicleRegdNo) {
        this.vehicleRegdNo = vehicleRegdNo;
    }

    public String getOdometer() {
        return odometer;
    }

    public void setOdometer(String odometer) {
        this.odometer = odometer;
    }

    public String getMalfunctionDate() {
        return malfunctionDate;
    }

    public void setMalfunctionDate(String malfunctionDate) {
        this.malfunctionDate = malfunctionDate;
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

    public String getComplaintStream() {
        return complaintStream;
    }

    public void setComplaintStream(String complaintStream) {
        this.complaintStream = complaintStream;
    }

    public String getComplaintCategory() {
        return complaintCategory;
    }

    public void setComplaintCategory(String complaintCategory) {
        this.complaintCategory = complaintCategory;
    }

    public String getComplaintDesc() {
        return complaintDesc;
    }

    public void setComplaintDesc(String complaintDesc) {
        this.complaintDesc = complaintDesc;
    }

    public String getHhmlVINNumber() {
        return hhmlVINNumber;
    }

    public void setHhmlVINNumber(String hhmlVINNumber) {
        this.hhmlVINNumber = hhmlVINNumber;
    }

}
