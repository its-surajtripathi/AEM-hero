package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.xml.soap.SOAPException;
import javax.xml.ws.http.HTTPException;

import com.hero.aem.core.beans.CorporateEnquiryBean;
import com.hero.aem.core.beans.ProductEnquiryBean;
import com.hero.aem.core.beans.SuggestionSoapAPIBean;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.MessagingService;
import com.hero.aem.core.services.ProductEnquiryForm;
import com.hero.aem.core.services.SuggestionsForm;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.ServletResolverConstants;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

@SuppressWarnings("serial")
@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Lead Generation servlet",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/media-forms",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=suggestions",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=productEnquiry",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=corporateEnquiry",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class ReachUsServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(ReachUsServlet.class);
    private static final String suggestionsEmailTemplate = "/content/dam/hero-aem-website/in/media-center/email-templates/hero/suggestions.txt";
    private static final String suggestionsSubject = "Thank You For Your Feedback.";
    private static final String enquiryEmailTemplate = "/content/dam/hero-aem-website/in/media-center/email-templates/hero/enquiry.txt";
    private static final String productImagesPath = "https://heromotocorp.com/content/dam/hero-aem-website/in/documents/productimages/";
    private static final String enquirySubject = "Hero MotoCorp Enquiry.";

    @Reference
    transient APIConfigurations apiConfigurations;

    @Reference
    transient SuggestionsForm suggestionsForm;

    @Reference
    transient ProductEnquiryForm productEnquiryForm;

    @Reference
    transient MessagingService messagingService;

    ObjectMapper objectMapper;

    final transient StaticWrapper httpGetWrapper = new StaticWrapper();

    @Activate
    public void activate() {
        objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    /**
     * Logger
     */

    @Override
    protected void doPost(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServletException, IOException {

        String[] selectors = req.getRequestPathInfo().getSelectors();
        if (selectors[0].equals("suggestions")) {

            JsonObject input = httpGetWrapper
                    .getJsonFromString(IOUtils.toString(req.getInputStream(), StandardCharsets.UTF_8));
            final SuggestionSoapAPIBean suggestionSoapAPIBean = objectMapper.readValue(input.toString(),
                    SuggestionSoapAPIBean.class);

            try {
                String soapXML = suggestionsForm.GenerateXML(suggestionSoapAPIBean);
                JsonObject response = suggestionsForm.ProcessSOAPRequest(soapXML);
                String responseString = "";
                String complaintNumber = "";
                if(response != null){
                    complaintNumber = response.get("complaintNumber").getAsString();
                    responseString = response.toString();
                }
                if (responseString.contains("success")) {
                    log.info("Suggestions Form Mobile Number " + suggestionSoapAPIBean.getCellularPhone());
                    suggestionsForm.SendSMS(suggestionSoapAPIBean.getCellularPhone());
                }
                if(responseString.contains("success") && StringUtils.isNotBlank(suggestionSoapAPIBean.getEmail())){
                    final Map<String, String> parameters = new HashMap<String, String>();
                    parameters.put("txtFname", suggestionSoapAPIBean.getFirstName());
                    parameters.put("txtLname", suggestionSoapAPIBean.getLastName());
                    parameters.put("sComplaintNumber", complaintNumber);
                    messagingService.sendMail(req.getResourceResolver(),parameters,suggestionSoapAPIBean.getEmail(),suggestionsEmailTemplate,suggestionsSubject);
                }
                log.info("response" + response);
                resp.getWriter().write(responseString);
            } catch (SOAPException e) {
                log.error("SOAP Exception"+ e );
            }
        }
        else if(selectors[0].equals("productEnquiry")){
            JsonObject input = httpGetWrapper
                    .getJsonFromString(IOUtils.toString(req.getInputStream(), StandardCharsets.UTF_8));
            final ProductEnquiryBean productEnquiryBean = objectMapper.readValue(input.toString(),
                    ProductEnquiryBean.class);
            try {
                String soapXML = productEnquiryForm.GenerateXML(productEnquiryBean);
                log.info("Product Enquiry soapXML" + soapXML);
                String response = productEnquiryForm.ProcessSOAPRequest(soapXML);
                if (response.contains("success")) {
                    productEnquiryForm.SendSMS(productEnquiryBean.getMobile(),productEnquiryBean.getVehicleModel());
                }
                if(response.contains("success") && StringUtils.isNotBlank(productEnquiryBean.getEmail())){
                    final String productBrochurePath = "/content/dam/hero-aem-website/in/documents/product-brochures/";
                    final Map<String, String> parameters = new HashMap<String, String>();
                    parameters.put("txtFname", productEnquiryBean.getFirstName());
                    parameters.put("txtLname", productEnquiryBean.getLastName());
                    parameters.put("model", productEnquiryBean.getVehicleModel());
                    parameters.put("bikeImage",productImagesPath+productEnquiryBean.getVehicleModel().replaceAll("\\s", "")+".jpg");
                    messagingService.sendMailWithAttachments(req.getResourceResolver(),parameters,productEnquiryBean.getEmail(),enquiryEmailTemplate,enquirySubject,productBrochurePath+productEnquiryBean.getVehicleModel()+".pdf");
                }
                log.info("Product Enquiry response" + response);
                resp.getWriter().write(response);
            } catch (SOAPException e) {
                log.error("SOAP Exception"+ e);
            }
        }
        else if(selectors[0].equals("corporateEnquiry")){
            JsonObject input = httpGetWrapper
                    .getJsonFromString(IOUtils.toString(req.getInputStream(), StandardCharsets.UTF_8));
            final CorporateEnquiryBean corporateEnquiryBean = objectMapper.readValue(input.toString(),
                    CorporateEnquiryBean.class);
            JsonObject obj = new JsonObject();
            SimpleDateFormat formatter = new SimpleDateFormat(HeroConstants.DATE_FORMAT_SLASH);
            Date date = new Date();
            corporateEnquiryBean.setEnquiryDate(formatter.format(date));
            obj.addProperty("Name",corporateEnquiryBean.getName());
            obj.addProperty("Designation",corporateEnquiryBean.getDesignation());
            obj.addProperty("Company Name",corporateEnquiryBean.getCompanyName());
            obj.addProperty("Mobile Number",corporateEnquiryBean.getMobile());
            obj.addProperty("Phone Number",corporateEnquiryBean.getTel());
            obj.addProperty("requirements",corporateEnquiryBean.getRequirements());
            obj.addProperty("enquiry_date",corporateEnquiryBean.getEnquiryDate());
            obj.addProperty("countryid",corporateEnquiryBean.getCountryId());
            obj.addProperty("email",corporateEnquiryBean.getEmail());
            obj.addProperty("stateId",corporateEnquiryBean.getState());
            obj.addProperty("city",corporateEnquiryBean.getCity());
            obj.addProperty("category",corporateEnquiryBean.getCategory());
            obj.addProperty("address",corporateEnquiryBean.getAddress());
            obj.addProperty("otherinfo",corporateEnquiryBean.getOtherInfo());

            CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();

            try {
                int CONNECTION_TIMEOUT_MS = 50 * 1000;
                log.info("Corporate API"+apiConfigurations.getConfigProperty("getCorporateAPIURL"));
                RequestConfig requestConfig = RequestConfig.custom()
                        .setConnectionRequestTimeout(CONNECTION_TIMEOUT_MS)
                        .setConnectTimeout(CONNECTION_TIMEOUT_MS)
                        .setSocketTimeout(CONNECTION_TIMEOUT_MS)
                        .build();

                final HttpPost postReq = new HttpPost(apiConfigurations.getConfigProperty("getCorporateAPIURL"));
                postReq.setHeader(HeroConstants.CONTENT_TYPE, HeroConstants.APPLICATION_JSON);
                postReq.setHeader("magic_token",apiConfigurations.getConfigProperty("getMagicToken"));
                postReq.setConfig(requestConfig);
                log.info("HTTP Corporate Enquiry Request Object" + obj);
                postReq.setEntity(new StringEntity(obj.toString()));
                CloseableHttpResponse response = httpClient.execute(postReq);
                JsonObject message=new JsonObject();
                if(EntityUtils.toString(response.getEntity()).contains("Success")){
                    message.addProperty(HeroConstants.MESSAGE, HeroConstants.SUCCESS);
                    message.addProperty(HeroConstants.STATUS, HeroConstants.SUCCESS);
                }
                else{
                    message.addProperty(HeroConstants.MESSAGE, HeroConstants.FAILURE);
                }
                resp.getWriter().write(message.toString());

            } catch (HTTPException e) {
                log.error("HTTP Exception"+ e);
            } finally {
                httpClient.close();
            }
        }
    }
}