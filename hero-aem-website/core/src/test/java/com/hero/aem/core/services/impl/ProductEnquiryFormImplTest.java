package com.hero.aem.core.services.impl;

import com.hero.aem.core.beans.ProductEnquiryBean;

import java.io.IOException;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNull;

class ProductEnquiryFormImplTest {

    @Test
    @Disabled("TODO: Complete this test")
    void testGenerateXML() {
        ProductEnquiryFormImpl productEnquiryFormImpl = new ProductEnquiryFormImpl();

        ProductEnquiryBean productEnquiryBean = new ProductEnquiryBean();
        productEnquiryBean.setAge("Age");
        productEnquiryBean.setBriefAboutEnquiry("Brief About Enquiry");
        productEnquiryBean.setCity("Oxford");
        productEnquiryBean.setDealerCity("Dealer City");
        productEnquiryBean.setDealerCode("Dealer Code");
        productEnquiryBean.setDealerName("Dealer Name");
        productEnquiryBean.setDealerState("Dealer State");
        productEnquiryBean.setDistrict("District");
        productEnquiryBean.setEmail("jane.doe@example.org");
        productEnquiryBean.setEnquiryDate("2020-03-01");
        productEnquiryBean.setExistingVehicle("Existing Vehicle");
        productEnquiryBean.setExpectedDateOfPurchase("2020-03-01");
        productEnquiryBean.setExpectedDateOfTestRide("2020-03-01");
        productEnquiryBean.setFirstName("Jane");
        productEnquiryBean.setGender("Gender");
        productEnquiryBean.setIntendedUse("Intended Use");
        productEnquiryBean.setLastName("Doe");
        productEnquiryBean.setMobile("Mobile");
        productEnquiryBean.setOccupation("Occupation");
        productEnquiryBean.setState("MD");
        productEnquiryBean.setTel("Tel");
        productEnquiryBean.setTestRideRequired("Test Ride Required");
        productEnquiryBean.setVehicleModel("Vehicle Model");
        assertNull(productEnquiryFormImpl.GenerateXML(productEnquiryBean));
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testProcessSOAPRequest() {
       (new ProductEnquiryFormImpl()).ProcessSOAPRequest("Xml Input");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendSMS() throws IOException {

        (new ProductEnquiryFormImpl()).SendSMS("42", "Vehicle Model");
    }
}

