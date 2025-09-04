package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude()
public class LeadGenerationAPIBean {

    private String bike_model = "";
    private String name = "";
    private String email = "";
    private String mobile = "";
    private String state = "";
    private String city = "";
    private String ip = "";
    private String agent = "";
    private String insert_date = "";
    private String utm_source = "";
    private String utm_medium = "";
    private String utm_term = "";
    private String utm_content = "";
    private String utm_campaign = "";
    private String postal_code = "";
    private String interested_in = "";
    private String preferred_dealership = "";
    private String vehicle_purchase_plan = "";
    private String own_vehicle = "";
    private String token = "";
    private String source = "";
    private String otp = "";
    private String reqId = "";
    private String captcha = "";
    private String variation_type="";
    private String dealer_code="";
    private String dealer_name="";
    private String topic="";
    private String suggestion="";
    private String section="";

    @JsonProperty("variation_type")
    public String getVariation_type() {
        return variation_type;
    }

    public void setVariation_type(String variation_type) {
        this.variation_type = variation_type;
    }

    @JsonProperty("dealer_code")
    public String getDealer_code() {
        return dealer_code;
    }

    public void setDealer_code(String dealer_code) {
        this.dealer_code = dealer_code;
    }

    @JsonProperty("bike_model")
    public String getBike_model() {
        return bike_model;
    }

    public void setBike_model(String bike_model) {
        this.bike_model = bike_model;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @JsonProperty("mobile")
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    @JsonProperty("city")
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @JsonProperty("ip")
    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    @JsonProperty("agent")
    public String getAgent() {
        return agent;
    }

    public void setAgent(String agent) {
        this.agent = agent;
    }

    @JsonProperty("insert_date")
    public String getInsert_date() {
        return insert_date;
    }

    public void setInsert_date(String insert_date) {
        this.insert_date = insert_date;
    }

    @JsonProperty("utm_source")
    public String getUtm_source() {
        return utm_source;
    }

    public void setUtm_source(String utm_source) {
        this.utm_source = utm_source;
    }

    @JsonProperty("utm_medium")
    public String getUtm_medium() {
        return utm_medium;
    }

    public void setUtm_medium(String utm_medium) {
        this.utm_medium = utm_medium;
    }

    @JsonProperty("utm_term")
    public String getUtm_term() {
        return utm_term;
    }

    public void setUtm_term(String utm_term) {
        this.utm_term = utm_term;
    }

    @JsonProperty("utm_content")
    public String getUtm_content() {
        return utm_content;
    }

    public void setUtm_content(String utm_content) {
        this.utm_content = utm_content;
    }

    @JsonProperty("utm_campaign")
    public String getUtm_campaign() {
        return utm_campaign;
    }

    public void setUtm_campaign(String utm_campaign) {
        this.utm_campaign = utm_campaign;
    }

    @JsonProperty("state")
    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    @JsonProperty("postal_code")
    public String getPostal_code() {
        return postal_code;
    }

    public void setPostal_code(String postal_code) {
        this.postal_code = postal_code;
    }

    @JsonProperty("interested_in")
    public String getInterested_in() {
        return interested_in;
    }

    public void setInterested_in(String interested_in) {
        this.interested_in = interested_in;
    }

    @JsonProperty("preferred_dealership")
    public String getPreferred_dealership() {
        return preferred_dealership;
    }

    public void setPreferred_dealership(String preferred_dealership) {
        this.preferred_dealership = preferred_dealership;
    }

    @JsonProperty("vehicle_purchase_plan")
    public String getVehicle_purchase_plan() {
        return vehicle_purchase_plan;
    }

    public void setVehicle_purchase_plan(String vehicle_purchase_plan) {
        this.vehicle_purchase_plan = vehicle_purchase_plan;
    }

    @JsonProperty("own_vehicle")
    public String getOwn_vehicle() {
        return own_vehicle;
    }

    public void setOwn_vehicle(String own_vehicle) {
        this.own_vehicle = own_vehicle;
    }

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @JsonProperty("source")
    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    @JsonProperty("otp")
    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    @JsonProperty("reqID")
    public String getReqId() {
        return reqId;
    }

    public void setReqId(String reqId) {
        this.reqId = reqId;
    }

    @JsonProperty("captcha")
	public String getCaptcha() {
		return captcha;
	}

	public void setCaptcha(String captcha) {
		this.captcha = captcha;
	}

    @JsonProperty("dealer_name")
    public String getDealer_name() {
        return dealer_name;
    }

    public void setDealer_name(String dealer_name) {
        this.dealer_name = dealer_name;
    }

    @JsonProperty("topic")
    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    @JsonProperty("suggestion")
    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    @JsonProperty("section")
    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }


}
