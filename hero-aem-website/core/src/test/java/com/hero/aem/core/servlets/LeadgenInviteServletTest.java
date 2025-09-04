package com.hero.aem.core.servlets;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;

import com.google.gson.JsonObject;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.apache.sling.servlethelpers.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class LeadgenInviteServletTest {

    @InjectMocks
    LeadgenInviteServlet leadgenInviteServlet;

    @Mock
    CloseableHttpClient httpClient;

    @Mock
    HttpGet httpGet;

    @Mock
    CloseableHttpResponse clientResponse;

    @Mock
    APIConfigurations apiConfigurations;

    Map<String, Object> configProperties = new HashMap<>();

    @Mock
    StaticWrapper httpGetWrapper;
    JsonObject jobj = new JsonObject();

    JsonObject configInput = new JsonObject();

    @BeforeEach
    void init() throws IOException {
        MockitoAnnotations.openMocks(this);
        when(httpGetWrapper.getHttpGet("http://localhost:4502/api")).thenReturn(httpGet);
        when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
        configInput.addProperty("configAcaa","testConfig");
        configInput.addProperty(HeroConstants.PARAM_NAME_TEMP_MSG,"template");
        configInput.addProperty(HeroConstants.PARAM_NAME_TEMP_ID,"tempId");
        configInput.addProperty(HeroConstants.PARAM_NAME_API_URL,"url");
        configInput.addProperty(HeroConstants.PARAM_NAME_AUTH_HEADER,"header");

    }

    @Test
    void testDoPost(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        jobj.addProperty("REQ_FORMAT", "test");
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(httpGetWrapper.getJsonFromString(apiConfigurations.getConfigProperty("configAcaa"))).thenReturn(configInput);
        configProperties.put(HeroConstants.PARAM_NAME_CONFIG, "config");
        when(apiConfigurations.getConfigProperty(HeroConstants.PARAM_NAME_CONFIG)).thenReturn("test");
        leadgenInviteServlet.doPost(request, response);
    }

    @Test
    void testDoPostIfReqFormalNull(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        jobj.addProperty("REQ_FORMAT", "test");
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        leadgenInviteServlet.doPost(request, response);
    }
}