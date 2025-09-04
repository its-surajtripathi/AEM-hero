package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonInclude
public class NpsBean {
    @JsonProperty("rating")
    private String rating = "";

    @JsonProperty("feedback1")
    private String feedback1 = "";

    @JsonProperty("feedback2")
    private String feedback2 = "";

    @JsonProperty("feedback3")
    private String feedback3 = "";

    @JsonProperty("feedback4")
    private String feedback4 = "";

    @JsonProperty("source")
    private String source = "";

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getFeedback1() {
        return feedback1;
    }

    public void setFeedback1(String feedback1) {
        this.feedback1 = feedback1;
    }

    public String getFeedback2() {
        return feedback2;
    }

    public void setFeedback2(String feedback2) {
        this.feedback2 = feedback2;
    }

    public String getFeedback3() {
        return feedback3;
    }

    public void setFeedback3(String feedback3) {
        this.feedback3 = feedback3;
    }

    public String getFeedback4() {
        return feedback4;
    }

    public void setFeedback4(String feedback4) {
        this.feedback4 = feedback4;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}