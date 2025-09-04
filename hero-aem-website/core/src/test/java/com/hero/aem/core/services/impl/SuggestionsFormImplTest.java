package com.hero.aem.core.services.impl;

import com.hero.aem.core.beans.SuggestionSoapAPIBean;

import java.io.IOException;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNull;

class SuggestionsFormImplTest {

    @Test
    @Disabled("TODO: Complete this test")
    void testGenerateXML() {
        SuggestionsFormImpl suggestionsFormImpl = new SuggestionsFormImpl();

        SuggestionSoapAPIBean suggestionSoapAPIBean = new SuggestionSoapAPIBean();
        suggestionSoapAPIBean.setAddressLine1("42 Main St");
        suggestionSoapAPIBean.setAddressLine2("42 Main St");
        suggestionSoapAPIBean.setCellularPhone("4105551212");
        suggestionSoapAPIBean.setCity("Oxford");
        suggestionSoapAPIBean.setComplaintCategory("Complaint Category");
        suggestionSoapAPIBean.setComplaintDesc("Complaint Desc");
        suggestionSoapAPIBean.setComplaintStream("Complaint Stream");
        suggestionSoapAPIBean.setDealerCity("Dealer City");
        suggestionSoapAPIBean.setDealerName("Dealer Name");
        suggestionSoapAPIBean.setDealerState("Dealer State");
        suggestionSoapAPIBean.setEmail("jane.doe@example.org");
        suggestionSoapAPIBean.setFirstName("Jane");
        suggestionSoapAPIBean.setHhmlVINNumber("42");
        suggestionSoapAPIBean.setLastName("Doe");
        suggestionSoapAPIBean.setMalfunctionDate("2020-03-01");
        suggestionSoapAPIBean.setOdometer("Odometer");
        suggestionSoapAPIBean.setPin("Pin");
        suggestionSoapAPIBean.setState("MD");
        suggestionSoapAPIBean.setTel("Tel");
        suggestionSoapAPIBean.setTown("Oxford");
        suggestionSoapAPIBean.setVehicleModel("Vehicle Model");
        suggestionSoapAPIBean.setVehicleRegdNo("Vehicle Regd No");
        assertNull(suggestionsFormImpl.GenerateXML(suggestionSoapAPIBean));
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testProcessSOAPRequest() {
        (new SuggestionsFormImpl()).ProcessSOAPRequest("Xml Input");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendSMS() throws IOException {
        (new SuggestionsFormImpl()).SendSMS("42");
    }
}

