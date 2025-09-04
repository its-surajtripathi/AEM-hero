package com.hero.aem.core.services.impl;

import com.google.gson.JsonObject;
import com.hero.aem.core.beans.SuggestionSoapAPIBean;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.MessagingService;
import com.hero.aem.core.services.SuggestionsForm;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.FormsUtils;
import com.hero.aem.core.util.StaticWrapper;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.servlets.HttpConstants;
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
import java.net.*;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.text.ParseException;

@Component(service = SuggestionsForm.class, immediate = true)
@ServiceDescription("SuggestionsFormImpl Service for Suggestions Form")
public class SuggestionsFormImpl implements SuggestionsForm {

    private static final Logger log = LoggerFactory.getLogger(SuggestionsFormImpl.class);

    @Reference
    transient APIConfigurations apiConfigurations;

    @Reference
    transient MessagingService messagingService;

    @Override
    public String GenerateXML(SuggestionSoapAPIBean suggestionSoapAPIBean)  {
        try {

            MessageFactory factory = MessageFactory.newInstance();
            SOAPMessage soapMsg = factory.createMessage();
            SOAPPart part = soapMsg.getSOAPPart();
            SOAPEnvelope envelope = part.getEnvelope();
            SOAPHeader header = envelope.getHeader();

            envelope.addNamespaceDeclaration("hhm", "http://siebel.com/HHMLInterface/");

            QName qNameUsername = new QName(HeroConstants.SIEBEL_WEB_SERVICES, "UsernameToken");
            SOAPHeaderElement username = header.addHeaderElement(qNameUsername);
            username.addTextNode(apiConfigurations.getConfigProperty("getSOAPUsername"));
            QName qNamePassword = new QName(HeroConstants.SIEBEL_WEB_SERVICES, "PasswordText");
            SOAPHeaderElement password = header.addHeaderElement(qNamePassword);
            password.addTextNode(apiConfigurations.getConfigProperty("getSOAPPassword"));
            QName qNameSessionType = new QName(HeroConstants.SIEBEL_WEB_SERVICES, "SessionType");
            SOAPHeaderElement sessionType = header.addHeaderElement(qNameSessionType);
            sessionType.addTextNode("None");

            SOAPBody body = envelope.getBody();

            SOAPElement soapBodyElem = body.addChildElement("CWS_spcCustomer_spcComplaint_Input","hhm");
            soapBodyElem.setPrefix(HeroConstants.HHM);
            SOAPElement firstName = soapBodyElem.addChildElement( "FirstName",HeroConstants.HHM);
            firstName.addTextNode(suggestionSoapAPIBean.getFirstName());

            SOAPElement lastName = soapBodyElem.addChildElement( "LastName",HeroConstants.HHM);
            lastName.addTextNode(suggestionSoapAPIBean.getLastName());

            SOAPElement cellularPhone = soapBodyElem.addChildElement( "CellularPhone",HeroConstants.HHM);
            cellularPhone.addTextNode(suggestionSoapAPIBean.getCellularPhone());

            SOAPElement emailAddress = soapBodyElem.addChildElement( "EmailAddress",HeroConstants.HHM);
            emailAddress.addTextNode(suggestionSoapAPIBean.getEmail());

            SOAPElement customerAddress = soapBodyElem.addChildElement( "CustomerAddress",HeroConstants.HHM);
            customerAddress.addTextNode(suggestionSoapAPIBean.getAddressLine1()+""+suggestionSoapAPIBean.getAddressLine2());

            SOAPElement address = soapBodyElem.addChildElement( "Address",HeroConstants.HHM);
            address.addTextNode(suggestionSoapAPIBean.getTown()+" "+suggestionSoapAPIBean.getCity()+" "+suggestionSoapAPIBean.getState()+" "+suggestionSoapAPIBean.getPin());

            SOAPElement model = soapBodyElem.addChildElement( "Model",HeroConstants.HHM);
            model.addTextNode(suggestionSoapAPIBean.getVehicleModel());

            SOAPElement regdNo = soapBodyElem.addChildElement( "VehicleRegistrationNumber",HeroConstants.HHM);
            regdNo.addTextNode(suggestionSoapAPIBean.getVehicleRegdNo());

            SOAPElement odometer = soapBodyElem.addChildElement( "OdometerReading",HeroConstants.HHM);
            odometer.addTextNode(suggestionSoapAPIBean.getOdometer());

            SOAPElement malfunctionDate = soapBodyElem.addChildElement( "MalfunctionDate",HeroConstants.HHM);
            malfunctionDate.addTextNode(FormsUtils.formatDate(suggestionSoapAPIBean.getMalfunctionDate()));

            SOAPElement dealerCode = soapBodyElem.addChildElement( "DealerCode",HeroConstants.HHM);
            dealerCode.addTextNode(suggestionSoapAPIBean.getDealerName());

            SOAPElement areaOffice = soapBodyElem.addChildElement( "AreaOffice",HeroConstants.HHM);
            areaOffice.addTextNode(suggestionSoapAPIBean.getDealerCity());

            SOAPElement category = soapBodyElem.addChildElement( "Category",HeroConstants.HHM);
            category.addTextNode(suggestionSoapAPIBean.getComplaintStream());

            SOAPElement subCategory = soapBodyElem.addChildElement( "SubCategory",HeroConstants.HHM);
            subCategory.addTextNode(suggestionSoapAPIBean.getComplaintCategory());

            SOAPElement hhmlVIN = soapBodyElem.addChildElement( "HHMLVINNumber",HeroConstants.HHM);
            hhmlVIN.addTextNode(StringUtils.isNotBlank(suggestionSoapAPIBean.getHhmlVINNumber()) ? suggestionSoapAPIBean.getHhmlVINNumber():".");

            SOAPElement briefAboutComplaint = soapBodyElem.addChildElement( "BriefAboutComplaint",HeroConstants.HHM);
            briefAboutComplaint.addTextNode(suggestionSoapAPIBean.getComplaintDesc());

            SOAPElement subSubCategory = soapBodyElem.addChildElement( "SubSubCategory",HeroConstants.HHM);
            subSubCategory.addTextNode("");

            SOAPElement ownedById = soapBodyElem.addChildElement( "OwnedById",HeroConstants.HHM);
            ownedById.addTextNode("");

            SOAPElement srType = soapBodyElem.addChildElement( "SRType",HeroConstants.HHM);
            srType.addTextNode("Complaints");

            SOAPElement srNumber = soapBodyElem.addChildElement( "SRNumber",HeroConstants.HHM);
            srNumber.addTextNode("TXN"+ RandomStringUtils.random(15, false, true) );

            SOAPElement status = soapBodyElem.addChildElement( "Status",HeroConstants.HHM);
            status.addTextNode("Open");

            SOAPElement compRepFlag = soapBodyElem.addChildElement( "CompRepFlag",HeroConstants.HHM);
            compRepFlag.addTextNode("");

            SOAPElement tel = soapBodyElem.addChildElement( "HomePhone",HeroConstants.HHM);
            tel.addTextNode(suggestionSoapAPIBean.getTel());

            SOAPElement partnerName = soapBodyElem.addChildElement( "PartnerName",HeroConstants.HHM);
            partnerName.addTextNode(suggestionSoapAPIBean.getDealerName());

            SOAPElement reportedDate = soapBodyElem.addChildElement( "ReportedDate",HeroConstants.HHM);
            reportedDate.addTextNode(FormsUtils.formatDate(suggestionSoapAPIBean.getMalfunctionDate()));

            SOAPElement source = soapBodyElem.addChildElement( "Source",HeroConstants.HHM);
            source.addTextNode("Corporate Website");

            SOAPElement priority = soapBodyElem.addChildElement( "Priority",HeroConstants.HHM);
            priority.addTextNode("3-Medium");

            SOAPElement location = soapBodyElem.addChildElement( "Location",HeroConstants.HHM);
            location.addTextNode(suggestionSoapAPIBean.getDealerCity());

            soapMsg.saveChanges();
            final StringWriter sw = new StringWriter();
            try {
                TransformerFactory.newInstance().newTransformer().transform(
                        new DOMSource(soapMsg.getSOAPPart()),
                        new StreamResult(sw));
            } catch (TransformerException e) {
                log.error("TransformerException" + e);
            }
            log.info("XML Response"+sw.toString());
            return sw.toString();
        } catch (SOAPException e) {
            log.error("Exception" + e);
        } catch (ParseException e) {
            log.error("Exception" + e);
        }
        return null;
    }



    @Override
    public JsonObject ProcessSOAPRequest(String xmlInput) {
        try{
            FormsUtils.ValidateHostName();
            String responseString = "";
            String outputString = "";
            String wsURL = apiConfigurations.getConfigProperty("getSuggestionsAPIURL");
            log.info("Suggestions form api"+ wsURL);
            URL url = new URL(wsURL);
            URLConnection connection = url.openConnection();
            HttpURLConnection httpConn = (HttpURLConnection) connection;
            ByteArrayOutputStream bout = new ByteArrayOutputStream();
            bout.write(xmlInput.getBytes());
            byte[] b = bout.toByteArray();
            String SOAPAction = "\"document/http://siebel.com/HHMLInterface/:CWS Customer Complaint\"";
// Set the appropriate HTTP parameters.
            httpConn.setRequestProperty(HeroConstants.CONTENT_LENGTH,String.valueOf(b.length));
            httpConn.setRequestProperty(HeroConstants.CONTENT_TYPE, HeroConstants.CONTENT_TYPE_XML);
            httpConn.setRequestProperty(HeroConstants.SOAPACTION, SOAPAction);
            httpConn.setRequestMethod(HttpConstants.METHOD_POST);
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

            DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
            DocumentBuilder db = null;
            try {
                db = dbf.newDocumentBuilder();
                InputSource is = new InputSource();
                is.setCharacterStream(new StringReader(outputString));
                try {
                    Document doc = db.parse(is);
                    String message = doc.getDocumentElement().getTextContent();
                    String complaintNumber = " ";
                    String transactionStatus = "";
                    if(doc.getElementsByTagName("ns:ComplaintNum") != null) {
                        complaintNumber = doc.getElementsByTagName("ns:ComplaintNum").item(0).getTextContent();
                    }
                    if(doc.getElementsByTagName("ns:TransactionStatus") != null) {
                        transactionStatus = doc.getElementsByTagName("ns:TransactionStatus").item(0).getTextContent();
                    }
                    log.info(HeroConstants.MESSAGE+message);
                    JsonObject obj=new JsonObject();
                    obj.addProperty(HeroConstants.RESPONSE_STRING, message);
                    obj.addProperty("complaintNumber",complaintNumber);
                    if(transactionStatus.equalsIgnoreCase("Success")){
                        obj.addProperty(HeroConstants.MESSAGE, HeroConstants.SUCCESS);
                        obj.addProperty(HeroConstants.STATUS, HeroConstants.SUCCESS);
                    }
                    else {
                        obj.addProperty(HeroConstants.MESSAGE, HeroConstants.FAILURE);
                    }
                    return obj;
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

    public void SendSMS(String mobileNumber) throws IOException {
        StaticWrapper httpGetWrapper = new StaticWrapper();
        String templateID = "1707160041962898680";
        String msgText = "We have successfully received your feedback. Hero MotoCorp team will get back to you soon. For any further queries, please call us on 1800 266 0018";
        String apiUrl = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIURL);
        HttpGet httpGet = httpGetWrapper.getHttpGet(apiUrl);
        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
        try {
            messagingService.sendSMS(mobileNumber,msgText,templateID);
        } catch (IOException e) {
            log.error("....SMS servlet failed ......", e);
        } finally {
            httpClient.close();
        }
    }

}
