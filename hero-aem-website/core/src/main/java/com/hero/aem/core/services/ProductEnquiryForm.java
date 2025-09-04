package com.hero.aem.core.services;

import com.hero.aem.core.beans.ProductEnquiryBean;

import javax.xml.soap.SOAPException;
import java.io.IOException;

public interface ProductEnquiryForm {

    String GenerateXML(ProductEnquiryBean productEnquiryBean) throws SOAPException;
    String ProcessSOAPRequest(String xml);
    void SendSMS(String mobileNumber, String vehicleMode) throws IOException;
}
