package com.hero.aem.core.services;

import com.google.gson.JsonObject;
import com.hero.aem.core.beans.SuggestionSoapAPIBean;

import javax.xml.soap.SOAPException;
import java.io.IOException;

public interface SuggestionsForm {

    String GenerateXML(SuggestionSoapAPIBean suggestionSoapAPIBean) throws SOAPException;
    JsonObject ProcessSOAPRequest(String xml);
    void SendSMS(String mobileNumber) throws IOException;
}
