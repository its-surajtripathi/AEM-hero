package com.hero.aem.core.servlets;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.AesCryptUtil;
import com.hero.aem.core.util.StaticWrapper;

@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Initiate Payment Gateway servlet",
		ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=getPaymentUrl",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=postPaymentData",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class InitiatePaymentServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(InitiatePaymentServlet.class);

    @Reference
    transient APIConfigurations apiConfigurations;

    ObjectMapper objectMapper;
    
    transient AesCryptUtil aesUtil; 


    transient StaticWrapper httpGetWrapper = new StaticWrapper();

	private transient Resource resource;


    @Activate
    public void activate() throws UnsupportedEncodingException, NoSuchAlgorithmException {
        objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        aesUtil = new AesCryptUtil(apiConfigurations.getConfigProperty("ccAvenueWorkingKey"));
    }

    /**
     * Logger
     */

    @Override
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
		JsonObject input;
		JsonObject outputObj = new JsonObject();
		outputObj.addProperty("status", "fail");
		
		if (request.getRequestPathInfo().getSelectorString().equals("getPaymentUrl")) {

		try {
			input = httpGetWrapper
					.getJsonFromString(IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8));
			resource = request.getResourceResolver().getResource(request.getRequestPathInfo().getResourcePath());
			String amount = null;
			if(resource.getValueMap().containsKey("amount")) {
				amount = resource.getValueMap().get("amount").toString();
			}else {
				amount = aesUtil.decrypt(input.get("rideValue").getAsString()).replace("\"", "");
			}
			String requestURL = "merchant_id="+apiConfigurations.getConfigProperty("ccAvenueMerchantID")+
					"&order_id="+input.get("orderID").getAsString()
					+"&redirect_url="+apiConfigurations.getConfigProperty("servletPathPG")+
					"&cancel_url="+apiConfigurations.getConfigProperty("servletPathPG")+
					"&amount="+amount+
					"&currency=INR";
			String	result = aesUtil.encrypt(requestURL);
			outputObj.addProperty("status", "success");
			outputObj.addProperty("encryptedValue", result);
			response.getWriter().write(outputObj.toString());
		} catch (JsonSyntaxException | IOException  e) {
			log.error("Exception Occurred",e);
		}
		
		}else if(request.getRequestPathInfo().getSelectorString().equals("postPaymentData")) {


        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
		try {
			
		    
			log.info("Decrypted value---"+aesUtil.decrypt(request.getParameter("encResp")));
		    String decryptedValue = aesUtil.decrypt(request.getParameter("encResp"));
		    decryptedValue = decryptedValue.substring(decryptedValue.indexOf("order_status=")+13, decryptedValue.indexOf("&", decryptedValue.indexOf("order_status=")));
		    if(decryptedValue.equals("Success")) {
		    	final HttpPost postReq = new HttpPost(apiConfigurations.getConfigProperty("getAPIForPostingTransaction"));
				log.info("Request value---"+postReq.toString());
				List<BasicNameValuePair> postParameters =  new ArrayList<BasicNameValuePair>();
			    postParameters.add(new BasicNameValuePair("encResp", request.getParameter("encResp")));
			    postParameters.add(new BasicNameValuePair("orderNo", request.getParameter("orderNo")));
			    postParameters.add(new BasicNameValuePair("crossSellUrl", request.getParameter("crossSellUrl")));
			    postReq.setEntity(new UrlEncodedFormEntity(postParameters, "UTF-8"));
				postReq.setHeader("accept", "application/json");
				postReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
				CloseableHttpResponse resp= httpClient.execute(postReq);
				resp.getEntity();
				log.info("Response value---"+resp.toString());
				StatusLine statusLine = resp.getStatusLine();
				if(statusLine.getStatusCode() == 200) {
					response.sendRedirect(apiConfigurations.getConfigProperty("thankYouPagePath").toString());  
				}else {
			    	response.sendRedirect(apiConfigurations.getConfigProperty("sorryPagePath").toString()); 
				}
		    }else {
		    	response.sendRedirect(apiConfigurations.getConfigProperty("sorryPagePath").toString()); 
		    }
		    
			
		} finally {
            httpClient.close();
        }
		}
	}

}