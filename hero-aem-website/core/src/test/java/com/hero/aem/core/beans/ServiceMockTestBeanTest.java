package com.hero.aem.core.beans;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

class ServiceMockTestBeanTest {

    private String mockTestFullName;
    private String mockTestEmail;

    @InjectMocks
    private ServiceMockTestBean serviceMockTestBean;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        serviceMockTestBean.setMockTestEmail(mockTestEmail);
        serviceMockTestBean.setMockTestFullName(mockTestFullName);
    }

    @Test
    void getTestResult() {
        assertEquals(mockTestEmail, serviceMockTestBean.getMockTestEmail());
        assertEquals(mockTestFullName, serviceMockTestBean.getMockTestFullName());
    }

}