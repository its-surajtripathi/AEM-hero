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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class GeoCodeServletTest {

    @InjectMocks
    GeoCodeServlet geoCodeServlet;

    @Mock
    APIConfigurations apiConfigurations;

    Map<String, Object> configProperties = new HashMap<>();

    Map<String, String> priceValues = new HashMap<>();

    @Mock
    CloseableHttpClient httpClient;

    @Mock
    HttpGet httpGet;

    @Mock
    CloseableHttpResponse clientResponse;

    @Mock
    StaticWrapper httpGetWrapper;

    @BeforeEach
    void init() throws IOException {
        MockitoAnnotations.openMocks(this);
        when(httpGetWrapper.getHttpGet("http://localhost:4502/api")).thenReturn(httpGet);
        when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
    }

    @Test
    void testDoGet(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
        MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("lat", "8903458657");
        request.addRequestParameter("long", HeroConstants.PAGE_TYPE_HOME);
        configProperties.put(HeroConstants.OSGI_GEOCODEAPIURL, "http://localhost:4502/api");
        configProperties.put(HeroConstants.OSGI_GEOCODEACCESSKEY, "aleznasdasdasd");
        when(apiConfigurations.getConfigProperties()).thenReturn(configProperties);
        when(apiConfigurations.getConfigProperty(HeroConstants.OSGI_GEOCODEAPIURL)).thenReturn("http://localhost:4502/api");
        when(httpGet.getURI()).thenReturn(new URI("http://localhost:4502/api"));
        when(httpClient.execute(any(HttpGet.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        JsonObject jobj = new JsonObject();
        jobj.addProperty("status", "OK");
        JsonArray typesArray = new JsonArray();
        typesArray.add("administrative_area_level_1");
        JsonObject addressObj = new JsonObject();
        addressObj.addProperty("long_name", "Hyderabad");
        addressObj.addProperty("short_name", "HD");
        addressObj.add("types", typesArray);
        typesArray.add("administrative_area_level_3");
        JsonObject addressObj1 = new JsonObject();
        addressObj1.addProperty("long_name", "Telangana");
        addressObj1.addProperty("short_name", "TLG");
        addressObj1.add("types", typesArray);
        JsonArray typesArray1 = new JsonArray();
        typesArray1.add(addressObj1);
        typesArray1.add(addressObj);
        JsonObject addressCompObj = new JsonObject();
        addressCompObj.add("address_components", typesArray1);
        JsonArray typesArray2 = new JsonArray();
        typesArray2.add(addressCompObj);
        jobj.add("results", typesArray2);
        priceValues.put("TLG", "Telangana");
        when(httpGetWrapper.getJsonFromString("{\"success\":\"200\"}")).thenReturn(jobj);
        geoCodeServlet.doGet(request, response);
    }

}
