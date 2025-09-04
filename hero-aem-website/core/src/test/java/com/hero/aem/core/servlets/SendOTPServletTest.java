package com.hero.aem.core.servlets;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.apache.sling.servlethelpers.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@Disabled
@ExtendWith(AemContextExtension.class)
class SendOTPServletTest {

    @InjectMocks
    SendOTPServlet sendOTPServlet;

    @Mock
    APIConfigurations apiConfigurations;

    @Mock
    CloseableHttpClient httpClient;

    @Mock
    HttpGet httpGet;

    @Mock
    CloseableHttpResponse smsAPIResponse;

    @Mock
    StaticWrapper httpGetWrapper;

    Map<String, Object> configProperties = new HashMap<>();

    @BeforeEach
    void init() throws IOException {
        MockitoAnnotations.openMocks(this);
        when(httpGetWrapper.getHttpGet("http://localhost:4502/smss")).thenReturn(httpGet);
        when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
    }

    @Test
    void testDoPostSlingHttpServletRequestSlingHttpServletResponse(AemContext aemContext)
            throws ServletException, IOException, URISyntaxException {
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter(HeroConstants.REQ_PARAM_PHONE_NUMBER, "8903458657");
        request.addRequestParameter(HeroConstants.REQ_PARAM_PAGE_TYPE, HeroConstants.PAGE_TYPE_HOME);
        request.addRequestParameter(HeroConstants.REQ_PARAM_VEHICLE_NAME, "x-pulse");
        request.addRequestParameter("reqID", "random-string");
        // OTP that will be sent - 295338
        configProperties.put(HeroConstants.OSGI_AEM_PROXY_HOST, "http://localhost");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDHOME, "234234234");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIMSGHOME, "{otp} for your enquiry");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIURL, "http://localhost:4502/smss");
        configProperties.put("sendSMSAPIUsername", "hero");
        configProperties.put("sendSMSAPIPassword", "234234234");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIFROMNAME, "Hero");

        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_AEM_PROXY_HOST)).thenReturn("http://localhost:4502");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDHOME)).thenReturn("234234234");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGHOME)).thenReturn("{otp} for your enquiry");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIURL)).thenReturn("http://localhost:4502/smss");
        when(apiConfigurations.getConfigProperty("sendSMSAPIUsername")).thenReturn("hero");
        when(apiConfigurations.getConfigProperty("sendSMSAPIPassword")).thenReturn("234234234");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIFROMNAME)).thenReturn("Hero");

        when(httpGetWrapper.getHttpGet("http://localhost:4502/smss")).thenReturn(httpGet);
        when(httpGet.getURI()).thenReturn(new URI("http://localhost:4502/smss"));
        when(httpClient.execute(any(HttpGet.class))).thenReturn(smsAPIResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(smsAPIResponse.getEntity()).thenReturn(httpEntity);
        sendOTPServlet.doPost(request, response);

    }

    @Test
    void testDoPostProduct(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter(HeroConstants.REQ_PARAM_PHONE_NUMBER, "8903458657");
        request.addRequestParameter(HeroConstants.REQ_PARAM_PAGE_TYPE, "product");
        request.addRequestParameter(HeroConstants.REQ_PARAM_VEHICLE_NAME, "x-pulse");
        request.addRequestParameter("reqID", "random-string");

        configProperties.put(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDHOME, "234234234");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIMSGHOME, "{otp} for your enquiry");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDPRODUCT, "1234");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIMSGPRODUCT, "{otp} for your enquiry");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIURL, "http://localhost:4502/smss");
        configProperties.put("sendSMSAPIUsername", "hero");
        configProperties.put("sendSMSAPIPassword", "234234234");
        configProperties.put(HeroConstants.OSGI_SENDSMSAPIFROMNAME, "Hero");

        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDPRODUCT)).thenReturn("234234234");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGPRODUCT)).thenReturn("{otp} for your enquiry");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGHOME)).thenReturn("{otp} for your enquiry");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIURL)).thenReturn("http://localhost:4502/smss");
        when(apiConfigurations.getConfigProperty("sendSMSAPIUsername")).thenReturn("hero");
        when(apiConfigurations.getConfigProperty("sendSMSAPIPassword")).thenReturn("234234234");
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIFROMNAME)).thenReturn("Hero");

        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        when(httpGet.getURI()).thenReturn(new URI("http://localhost:4502/smss"));
        when(httpClient.execute(any(HttpGet.class))).thenReturn(smsAPIResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(smsAPIResponse.getEntity()).thenReturn(httpEntity);
        sendOTPServlet.doPost(request, response);

    }

}
