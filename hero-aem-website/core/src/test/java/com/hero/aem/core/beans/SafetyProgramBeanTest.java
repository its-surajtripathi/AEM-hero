package com.hero.aem.core.beans;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

class SafetyProgramBeanTest {

    private String enrolltype;
    private String fullname;
    private String mobileno;
    private String email;
    private String enrollmentNameVal;
    private String date;
    private String location;
    private String ridetwowheeler;
    private String validLicense;
    private String orgName;
    private String participantCount;

    @InjectMocks
    private SafetyProgramBean safetyProgramBean;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        safetyProgramBean.setEnrolltype(enrolltype);
        safetyProgramBean.setFullName(fullname);
        safetyProgramBean.setMobile(mobileno);
        safetyProgramBean.setEmail(email);
        safetyProgramBean.setEnrollprogram(enrollmentNameVal);
        safetyProgramBean.setDate(date);
        safetyProgramBean.setLocation(location);
        safetyProgramBean.setRidetwowheeler(ridetwowheeler);
        safetyProgramBean.setValidLicense(validLicense);
        safetyProgramBean.setOrgName(orgName);
        safetyProgramBean.setParticipantCount(participantCount);
    }

    @Test
    void getTestResult() {
        assertEquals(enrolltype, safetyProgramBean.getEnrolltype());
        assertEquals(fullname, safetyProgramBean.getFullName());
        assertEquals(mobileno, safetyProgramBean.getMobile());
        assertEquals(email, safetyProgramBean.getEmail());
        assertEquals(enrollmentNameVal, safetyProgramBean.getEnrollprogram());
        assertEquals(date, safetyProgramBean.getDate());
        assertEquals(location, safetyProgramBean.getLocation());
        assertEquals(ridetwowheeler, safetyProgramBean.getRidetwowheeler());
        assertEquals(validLicense, safetyProgramBean.getValidLicense());
        assertEquals(orgName, safetyProgramBean.getOrgName());
        assertEquals(participantCount, safetyProgramBean.getParticipantCount());
    }

}