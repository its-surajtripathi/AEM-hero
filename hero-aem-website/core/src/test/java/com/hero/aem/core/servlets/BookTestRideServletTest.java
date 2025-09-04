package com.hero.aem.core.servlets;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.apache.sling.servlethelpers.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;


@ExtendWith(AemContextExtension.class)
class BookTestRideServletTest {

    @InjectMocks
    BookTestRideServlet bookTestRideServlet;

    @Mock
    SlingHttpServletRequest request;

    @Mock
    SlingHttpServletResponse response;

    @Mock
    CloseableHttpClient httpClient;

    @Mock
    HttpPost httpPost;

    @Mock
    CloseableHttpResponse clientResponse;

    @Mock
    StaticWrapper httpGetWrapper;

    ObjectMapper objectMapper;

    @Mock
    APIConfigurations apiConfigurations;

    Map<String, Object> configProperties = new HashMap<>();
    
    JsonObject jobj = new JsonObject();

    @BeforeEach
    void init() throws IOException {
    	HeroConstants hero = new HeroConstants();
        MockitoAnnotations.openMocks(this);
        when(httpGetWrapper.getHttpPost("http://localhost:4502")).thenReturn(httpPost);
        when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
        configProperties.put(HeroConstants.OSGI_LEADGENTOKEN, "adasdasdtokenasdas");
        configProperties.put(HeroConstants.OSGI_LEADGENSOURCE, "testSource");
        configProperties.put(HeroConstants.SKIP_OTP_VALIDATION, "false");
        configProperties.put(HeroConstants.OSGI_LEADGENAPI, "http://localhost:4502");
        configProperties.put(HeroConstants.OSGI_NEW_LEADGENAPI, "http://localhost:4502");
        configProperties.put("newleadGenAccessKey", "http://localhost:4502");
        configProperties.put("newLeadGenSecretKey", "http://localhost:4502");
        jobj.addProperty("bike_model", "New Maestro Edge 110");
        jobj.addProperty("name", "Aamod Joshi");
        jobj.addProperty("mobile", "9857585858");
        jobj.addProperty("city", "Mumbai");
        jobj.addProperty("state", "Maharastra");
        jobj.addProperty("source", "source");
        jobj.addProperty("reqID", "test");
        jobj.addProperty("utm_medium", "utm_medium");
        jobj.addProperty("utm_term", "utm_term");
        jobj.addProperty("utm_content", "utm_content");
        jobj.addProperty("utm_campaign", "utm_campaign");
        jobj.addProperty("utm_source", "utm_source");
        jobj.addProperty("email", "test@test.com");
        jobj.addProperty("ip", "127.0.0.1");
        jobj.addProperty("agent", "chrome");
        jobj.addProperty("insert_date","10-10-10");
        jobj.addProperty("postal_code", "560037");
        jobj.addProperty("interested_in", "xpulse");
        jobj.addProperty("preferred_dealership", "nearby");
        jobj.addProperty("vehicle_purchase_plan", "noplan");
        jobj.addProperty("own_vehicle", "yes");
        
    }
    
    @Test
    void testDoPostInCorrectOTP(AemContext aemContext)
            throws ServletException, IOException {
    	jobj.addProperty("otp", "123456");
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        bookTestRideServlet.activate();
        bookTestRideServlet.doPost(request, response);

    }
    @Test
    void testDoPostCorrectOTP(AemContext aemContext)
            throws ServletException, IOException {
        jobj.addProperty("otp", "938620");
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        bookTestRideServlet.activate();
        bookTestRideServlet.doPost(request, response);

    }
    
    @Test
    void testDoPostCaptchaCorrect(AemContext aemContext)
            throws ServletException, IOException {
        jobj.addProperty("captcha", "NTU2ND");
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        bookTestRideServlet.activate();
        bookTestRideServlet.doPost(request, response);

    }
    @Test
    void testDoPostCaptchaInCorrect(AemContext aemContext)
            throws ServletException, IOException {
        jobj.addProperty("captcha", "NTU2ND1");
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        bookTestRideServlet.activate();
        bookTestRideServlet.doPost(request, response);

    }

    @Test
    void testDoPostVariationType(AemContext aemContext)
            throws ServletException, IOException {
        jobj.addProperty("variation_type", "ndc-campaign-page");
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        bookTestRideServlet.activate();
        bookTestRideServlet.doPost(request, response);

    }

}