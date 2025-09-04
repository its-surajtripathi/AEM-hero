package com.hero.aem.core.services.impl;

import com.hero.aem.core.beans.ProductEnquiryBean;
import com.hero.aem.core.constants.HeroConstants;
import com.google.gson.JsonObject;
import com.hero.aem.core.services.MessagingService;
import com.hero.aem.core.services.ProductEnquiryForm;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.FormsUtils;
import com.hero.aem.core.util.StaticWrapper;
import org.apache.commons.lang3.RandomStringUtils;
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
import java.text.SimpleDateFormat;
import java.util.Date;

@Component(service = ProductEnquiryForm.class, immediate = true)
@ServiceDescription("SOAP Service for Suggestions Form")
public class ProductEnquiryFormImpl implements ProductEnquiryForm {

    private static final Logger log = LoggerFactory.getLogger(ProductEnquiryFormImpl.class);

    @Reference
    transient APIConfigurations apiConfigurations;

    @Reference
    transient MessagingService messagingService;

    @Override
    public String GenerateXML(ProductEnquiryBean productEnquiryBean)  {
        try {

            MessageFactory factory = MessageFactory.newInstance();
            SOAPMessage soapMsg = factory.createMessage();
            SOAPPart part = soapMsg.getSOAPPart();
            SOAPEnvelope envelope = part.getEnvelope();
            SOAPHeader header = envelope.getHeader();

            envelope.addNamespaceDeclaration("hhm", "http://siebel.com/HHMLEnqMobApp/");

            QName qNameUsername = new QName(HeroConstants.SIEBEL_WEB_SERVICES, "UsernameToken");
            SOAPHeaderElement username = header.addHeaderElement(qNameUsername);
            username.addTextNode(apiConfigurations.getConfigProperty("getSOAPUsername"));
            QName qNamePassword = new QName(HeroConstants.SIEBEL_WEB_SERVICES, "PasswordText");
            SOAPHeaderElement password = header.addHeaderElement(qNamePassword);
            password.addTextNode(apiConfigurations.getConfigProperty("getSOAPPassword"));
            QName qNameSessionType = new QName(HeroConstants.SIEBEL_WEB_SERVICES, "SessionType");
            SOAPHeaderElement sessionType = header.addHeaderElement(qNameSessionType);
            sessionType.addTextNode("Stateless");

            SOAPBody body = envelope.getBody();

            SOAPElement soapBodyElem = body.addChildElement("HMCLEnqApp_Input",HeroConstants.HHM);
            soapBodyElem.setPrefix("hhm");
            SOAPElement firstName = soapBodyElem.addChildElement( "FirstName",HeroConstants.HHM);
            firstName.addTextNode(productEnquiryBean.getFirstName());

            SOAPElement lastName = soapBodyElem.addChildElement( "LastName",HeroConstants.HHM);
            lastName.addTextNode(productEnquiryBean.getLastName());

            SOAPElement homePhone = soapBodyElem.addChildElement( "HomePhone",HeroConstants.HHM);
            homePhone.addTextNode(productEnquiryBean.getTel());

            SOAPElement cellularPhone = soapBodyElem.addChildElement( "CellularPhone",HeroConstants.HHM);
            cellularPhone.addTextNode(productEnquiryBean.getMobile());

            SOAPElement emailAddress = soapBodyElem.addChildElement( "EmailAddress",HeroConstants.HHM);
            emailAddress.addTextNode(productEnquiryBean.getEmail());

            SOAPElement customerAddress = soapBodyElem.addChildElement( "AddressName",HeroConstants.HHM);
            customerAddress.addTextNode(RandomStringUtils.random(15, false, true) );

            SOAPElement process = soapBodyElem.addChildElement( "Process",HeroConstants.HHM);
            process.addTextNode("Enquiry");

            SOAPElement hMCLCampId1 = soapBodyElem.addChildElement( "HMCLCampId1",HeroConstants.HHM);
            hMCLCampId1.addTextNode("");

            SOAPElement hMCLAsliHeroName = soapBodyElem.addChildElement( "HMCLAsliHeroName",HeroConstants.HHM);
            hMCLAsliHeroName.addTextNode("");

            SOAPElement enquirySource = soapBodyElem.addChildElement( "EnquirySource",HeroConstants.HHM);
            enquirySource.addTextNode("Web Site");

            SOAPElement pointOfContact = soapBodyElem.addChildElement( "PointOfContact",HeroConstants.HHM);
            pointOfContact.addTextNode("");

            SOAPElement occupation = soapBodyElem.addChildElement( "Occupation",HeroConstants.HHM);
            occupation.addTextNode(productEnquiryBean.getOccupation());

            SOAPElement hHMLAge = soapBodyElem.addChildElement( "HHMLAge",HeroConstants.HHM);
            hHMLAge.addTextNode(productEnquiryBean.getAge());

            SOAPElement hHMLExchangeRequired = soapBodyElem.addChildElement( "HHMLExchangeRequired",HeroConstants.HHM);
            hHMLExchangeRequired.addTextNode("N");

            SOAPElement hHMLTehsilTaluka = soapBodyElem.addChildElement( "HHMLTehsilTaluka",HeroConstants.HHM);
            hHMLTehsilTaluka.addTextNode(productEnquiryBean.getDistrict());

            SOAPElement hHMLEnquirySource = soapBodyElem.addChildElement( "HHMLEnquirySource",HeroConstants.HHM);
            hHMLEnquirySource.addTextNode("Web Site");

            SOAPElement personalPostalCode = soapBodyElem.addChildElement( "PersonalPostalCode",HeroConstants.HHM);
            personalPostalCode.addTextNode("");

            SOAPElement model = soapBodyElem.addChildElement( "Model",HeroConstants.HHM);
            model.addTextNode(productEnquiryBean.getVehicleModel().toUpperCase());

            SOAPElement mF = soapBodyElem.addChildElement( "MF",HeroConstants.HHM);
            mF.addTextNode("");

            SOAPElement hHMLContactType = soapBodyElem.addChildElement( "HHMLContactType",HeroConstants.HHM);
            hHMLContactType.addTextNode("");

            SOAPElement hMCLCampId5 = soapBodyElem.addChildElement( "HMCLCampId5",HeroConstants.HHM);
            hMCLCampId5.addTextNode("");

            SOAPElement hHMLAwarenessSource = soapBodyElem.addChildElement( "HHMLAwarenessSource",HeroConstants.HHM);
            hHMLAwarenessSource.addTextNode("News Paper");

            SOAPElement oTPVerified = soapBodyElem.addChildElement( "OTPVerified",HeroConstants.HHM);
            oTPVerified.addTextNode("");

            SOAPElement hHMLActualEnquiryDate = soapBodyElem.addChildElement( "HHMLActualEnquiryDate",HeroConstants.HHM);
            SimpleDateFormat formatter = new SimpleDateFormat(HeroConstants.DATE_FORMAT_SLASH);
            Date date = new Date();
            hHMLActualEnquiryDate.addTextNode(formatter.format(date));

            SOAPElement type = soapBodyElem.addChildElement( "Type",HeroConstants.HHM);
            type.addTextNode("");

            SOAPElement hMCLCampId2 = soapBodyElem.addChildElement( "HMCLCampId2",HeroConstants.HHM);
            hMCLCampId2.addTextNode("");

            SOAPElement testRideTaken = soapBodyElem.addChildElement( "TestRideTaken",HeroConstants.HHM);
            testRideTaken.addTextNode("");

            SOAPElement personalStreetAddress2 = soapBodyElem.addChildElement( "PersonalStreetAddress2",HeroConstants.HHM);
            personalStreetAddress2.addTextNode("");

            SOAPElement personalState = soapBodyElem.addChildElement( "PersonalState",HeroConstants.HHM);
            personalState.addTextNode(productEnquiryBean.getState());

            SOAPElement personalCity = soapBodyElem.addChildElement( "PersonalCity",HeroConstants.HHM);
            personalCity.addTextNode(productEnquiryBean.getCity());

            SOAPElement hMCLCampId3 = soapBodyElem.addChildElement( "HMCLCampId3",HeroConstants.HHM);
            hMCLCampId3.addTextNode("");

            SOAPElement enqRowIdToUpdate = soapBodyElem.addChildElement( "EnqRowIdToUpdate",HeroConstants.HHM);
            enqRowIdToUpdate.addTextNode("");

            SOAPElement startDate2 = soapBodyElem.addChildElement( "StartDate2",HeroConstants.HHM);
            startDate2.addTextNode(formatter.format(date));

            SOAPElement personalStreetAddress = soapBodyElem.addChildElement( "PersonalStreetAddress",HeroConstants.HHM);
            personalStreetAddress.addTextNode("");

            SOAPElement hHMLModelInterestedIn = soapBodyElem.addChildElement( "HHMLModelInterestedIn",HeroConstants.HHM);
            hHMLModelInterestedIn.addTextNode(productEnquiryBean.getVehicleModel().toUpperCase());

            SOAPElement make = soapBodyElem.addChildElement( "Make",HeroConstants.HHM);
            make.addTextNode(productEnquiryBean.getVehicleModel().toUpperCase());

            SOAPElement intendedUsage = soapBodyElem.addChildElement( "IntendedUsage",HeroConstants.HHM);
            intendedUsage.addTextNode(productEnquiryBean.getIntendedUse());

            SOAPElement hMCLCampId4 = soapBodyElem.addChildElement( "HMCLCampId4",HeroConstants.HHM);
            hMCLCampId4.addTextNode("");

            SOAPElement hHMLFinanceRequired = soapBodyElem.addChildElement( "HHMLFinanceRequired",HeroConstants.HHM);
            hHMLFinanceRequired.addTextNode("N");

            SOAPElement hHMLExistingVehicleDetails = soapBodyElem.addChildElement( "HHMLExistingVehicleDetails",HeroConstants.HHM);
            hHMLExistingVehicleDetails.addTextNode("Two Wheeler");

            SOAPElement hHMLDistrict = soapBodyElem.addChildElement( "HHMLDistrict",HeroConstants.HHM);
            hHMLDistrict.addTextNode(productEnquiryBean.getDistrict());

            SOAPElement hHMLTestRideRequired = soapBodyElem.addChildElement( "HHMLTestRideRequired",HeroConstants.HHM);
            hHMLTestRideRequired.addTextNode(productEnquiryBean.getTestRideRequired());

            SOAPElement hHMLEnquiry = soapBodyElem.addChildElement( "HHMLEnquiry",HeroConstants.HHM);
            hHMLEnquiry.addTextNode("TXN"+RandomStringUtils.random(15, false, true));

            SOAPElement hMCLAsliHeroCode = soapBodyElem.addChildElement( "HMCLAsliHeroCode",HeroConstants.HHM);
            hMCLAsliHeroCode.addTextNode("");

            SOAPElement hHMLExpectedDateofPurchase = soapBodyElem.addChildElement( "HHMLExpectedDateofPurchase",HeroConstants.HHM);
            hHMLExpectedDateofPurchase.addTextNode(FormsUtils.formatDate(productEnquiryBean.getExpectedDateOfPurchase()));

            SOAPElement hHMLDealerCode = soapBodyElem.addChildElement( "HHMLDealerCode",HeroConstants.HHM);
            hHMLDealerCode.addTextNode(productEnquiryBean.getDealerCode());

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
    public String ProcessSOAPRequest(String xmlInput) {
        try{
            FormsUtils.ValidateHostName();
            String responseString = "";
            String outputString = "";
            String wsURL = apiConfigurations.getConfigProperty("getProductEnquiryAPIURL");
            log.info("Product enquiry api"+ wsURL);
            URL url = new URL(wsURL);
            URLConnection connection = url.openConnection();
            HttpURLConnection httpConn = (HttpURLConnection) connection;
            ByteArrayOutputStream bout = new ByteArrayOutputStream();
            bout.write(xmlInput.getBytes());
            byte[] b = bout.toByteArray();
            String SOAPAction = "\"document/http://siebel.com/HHMLEnqMobApp/:HMCLEnqApp\"";

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
                    log.info(HeroConstants.MESSAGE+message);
                    JsonObject obj=new JsonObject();
                    obj.addProperty(HeroConstants.RESPONSE_STRING, message);
                    if(message.contains("Success") || message.contains("already exist")){
                        obj.addProperty(HeroConstants.MESSAGE, HeroConstants.SUCCESS);
                        obj.addProperty(HeroConstants.STATUS, HeroConstants.SUCCESS);
                    }
                    else {
                        obj.addProperty(HeroConstants.MESSAGE, HeroConstants.FAILURE);
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

    public void SendSMS(String mobileNumber, String vehicleModel) throws IOException {
        StaticWrapper httpGetWrapper = new StaticWrapper();
        String templateID = "1707160041954385355";
        String msgText = "Thank you for showing interest in "+vehicleModel+". Hero MotoCorp team will get back to you soon. For any further queries, please call us on 1800 266 0018";
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
