package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

class NpsBeanTest {

    private String rating;
    private String feedback1;
    private String feedback2 ;
    private String feedback3;
    private String feedback4;
    private String source;

    @InjectMocks
    private NpsBean npsBean;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        npsBean.setFeedback1(feedback1);
        npsBean.setFeedback2(feedback2);
        npsBean.setFeedback3(feedback3);
        npsBean.setFeedback4(feedback4);
        npsBean.setSource(source);
        npsBean.setRating(rating);
    }

    @Test
    void getTestResult() {
        assertEquals(feedback1, npsBean.getFeedback1());
        assertEquals(feedback2, npsBean.getFeedback2());
        assertEquals(feedback3, npsBean.getFeedback3());
        assertEquals(feedback4, npsBean.getFeedback4());
        assertEquals(source, npsBean.getSource());
        assertEquals(rating, npsBean.getRating());
    }
}