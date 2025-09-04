package com.hero.aem.core.services;

import com.hero.aem.core.beans.LeadGenerationAPIBean;

import javax.xml.soap.SOAPException;

public interface SOAPServiceGen {

    String GenerateXML(LeadGenerationAPIBean leadGenerationAPIBean) throws SOAPException;
    String ProcessSOAPRequest(String xml);
}
