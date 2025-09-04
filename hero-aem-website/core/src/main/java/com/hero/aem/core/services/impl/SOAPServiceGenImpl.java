package com.hero.aem.core.services.impl;

import com.google.gson.JsonObject;
import com.hero.aem.core.beans.LeadGenerationAPIBean;
import com.hero.aem.core.services.SOAPServiceGen;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.FormsUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.soap.*;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@Component(service = SOAPServiceGen.class, immediate = true)
@ServiceDescription("SOAP Service for Campaign Form enhancement")
public class SOAPServiceGenImpl implements SOAPServiceGen {

    @Reference
    transient APIConfigurations apiConfigurations;

    private static final Logger log = LoggerFactory.getLogger(SOAPServiceGenImpl.class);

    @Override
    public String GenerateXML(LeadGenerationAPIBean leadGenerationAPIBean)  {
        try {

            MessageFactory factory = MessageFactory.newInstance();
            SOAPMessage soapMsg = factory.createMessage();
            SOAPPart part = soapMsg.getSOAPPart();
            SOAPEnvelope envelope = part.getEnvelope();
            SOAPHeader header = envelope.getHeader();

            envelope.addNamespaceDeclaration("hhm", "http://siebel.com/HHMLInterface/");

            QName qNameUsername = new QName("http://siebel.com/webservices", "UsernameToken");
            SOAPHeaderElement username = header.addHeaderElement(qNameUsername);
            username.addTextNode(apiConfigurations.getConfigProperty("getSOAPUsername"));

            QName qNamePassword = new QName("http://siebel.com/webservices", "PasswordText");
            SOAPHeaderElement password = header.addHeaderElement(qNamePassword);
            password.addTextNode(apiConfigurations.getConfigProperty("getSOAPPassword"));
            QName qNameSessionType = new QName("http://siebel.com/webservices", "SessionType");
            SOAPHeaderElement sessionType = header.addHeaderElement(qNameSessionType);
            sessionType.addTextNode("None");

            SOAPBody body = envelope.getBody();

            SOAPElement soapBodyElem = body.addChildElement("CreateEnquiry_Input","hhm");
            soapBodyElem.setPrefix("hhm");
            SOAPElement modelNumber = soapBodyElem.addChildElement( "ModelNo","hhm");
            if (leadGenerationAPIBean.getBike_model().equals("XOOM")) {
                modelNumber.addTextNode("XOOM");
            }
            else if(leadGenerationAPIBean.getBike_model().equals("Passion+")) {
                modelNumber.addTextNode("PASSION +");
            }
            else{
                modelNumber.addTextNode("HARLEY X440");
            }

            SOAPElement enqSource = soapBodyElem.addChildElement("EnqSource","hhm");
            if (leadGenerationAPIBean.getBike_model().equals("XOOM")) {
                enqSource.addTextNode("OtherSocial");
            }
            else if(leadGenerationAPIBean.getBike_model().equals("Passion+")) {
                enqSource.addTextNode("Cross Selling");
            }
            else{
                enqSource.addTextNode("CWS");
            }

            SOAPElement fName = soapBodyElem.addChildElement("FName","hhm");
            fName.addTextNode(leadGenerationAPIBean.getName());

            SOAPElement lName = soapBodyElem.addChildElement("LName","hhm");
            lName.addTextNode(leadGenerationAPIBean.getName());

            SOAPElement enqName = soapBodyElem.addChildElement("EnqName","hhm");
            if (leadGenerationAPIBean.getBike_model().equals("XOOM") || leadGenerationAPIBean.getBike_model().equals("Passion+")) {
                enqName.addTextNode(leadGenerationAPIBean.getBike_model()+RandomStringUtils.random(9, false, true));
            } else{
                enqName.addTextNode("HARLEYX440"+RandomStringUtils.random(9, false, true));
            }
            SOAPElement emailAddr = soapBodyElem.addChildElement("EmailAddr","hhm");
            emailAddr.addTextNode("N/A");

            SOAPElement mobile = soapBodyElem.addChildElement("MobileNo","hhm");
            mobile.addTextNode(leadGenerationAPIBean.getMobile());

            SOAPElement dealerCode = soapBodyElem.addChildElement("DealerCode","hhm");
            dealerCode.addTextNode(leadGenerationAPIBean.getDealer_code());

            soapMsg.saveChanges();
            final StringWriter sw = new StringWriter();

            try {
                TransformerFactory.newInstance().newTransformer().transform(
                        new DOMSource(soapMsg.getSOAPPart()),
                        new StreamResult(sw));
            } catch (TransformerException e) {
                log.error("TransformerException" + e);
            }
            return sw.toString();
        } catch (SOAPException e) {
            log.error("Exception" + e);
        }
        return null;
    }



    @Override
    public String ProcessSOAPRequest(String xmlInput) {
        try{
            FormsUtils.ValidateHostName();
            String wsURL = apiConfigurations.getConfigProperty("getProductEnquiryAPIURL");
            String responseString = "";
            String outputString = "";
            URL url = new URL(wsURL);
            URLConnection connection = url.openConnection();
            HttpURLConnection httpConn = (HttpURLConnection) connection;
            ByteArrayOutputStream bout = new ByteArrayOutputStream();
            bout.write(xmlInput.getBytes());
            byte[] b = bout.toByteArray();
            String SOAPAction = "\"document/http://siebel.com/HHMLInterface/:CreateEnquiry\"";
// Set the appropriate HTTP parameters.
            httpConn.setRequestProperty("Content-Length",String.valueOf(b.length));
            httpConn.setRequestProperty("Content-Type", "text/xml; charset=utf-8");
            httpConn.setRequestProperty("SOAPAction", SOAPAction);
            httpConn.setRequestMethod("POST");
            httpConn.setDoOutput(true);
            httpConn.setDoInput(true);
            httpConn.setConnectTimeout(30000);
            httpConn.setReadTimeout(30000);
            OutputStream out = httpConn.getOutputStream();
            out.write(b);
            out.close();
            InputStreamReader isr = null;
            if (httpConn.getResponseCode() == 200) {
                isr = new InputStreamReader(httpConn.getInputStream());
            } else {
                isr = new InputStreamReader(httpConn.getErrorStream());
            }
            BufferedReader in = new BufferedReader(isr);

            while ((responseString = in.readLine()) != null) {
                outputString = outputString + responseString;
            }
            log.info("Output SOAP Response"+outputString);

            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = null;
            try {
                db = dbf.newDocumentBuilder();
                InputSource is = new InputSource();
                is.setCharacterStream(new StringReader(outputString));
                try {
                    Document doc = db.parse(is);
                    String message = doc.getDocumentElement().getTextContent();
                    log.info("Harley Message"+message);
                    JsonObject obj=new JsonObject();
                    obj.addProperty("login", "true");
                    obj.addProperty("response", "message");
                    if(message.contains("SUCCESS")|| message.contains("Success") || message.contains("Already Open Enq Exists")){
                        obj.addProperty("message", "success");
                    }
                    else {
                        obj.addProperty("message", "failure");
                    }
                    return obj.toString();
                } catch (SAXException e) {
                    log.error("SAX Exception"+ e);
                } catch (IOException e) {
                    log.error("IO Exception"+ e);
                }
            } catch (ParserConfigurationException e1) {
                log.error("ParserConfigurationException" +e1);
            }
        }
        catch (IOException e) {
            log.error("IOException in SOAPServiceGenImpl"+e);
        } catch (NoSuchAlgorithmException e) {
            log.error("NoSuchAlgorithmException in SOAPServiceGenImpl"+e);
        } catch (KeyManagementException e) {
            log.error("KeyManagementException in SOAPServiceGenImpl"+e);
        }
        return null;
    }
}
