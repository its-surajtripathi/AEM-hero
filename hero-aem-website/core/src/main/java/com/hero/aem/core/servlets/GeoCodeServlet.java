package com.hero.aem.core.servlets;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.ServletResolverConstants;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

@SuppressWarnings("serial")
@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Servlet to get the Geocode details",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=getlocation",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json" })
public class GeoCodeServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(GeoCodeServlet.class);

    @Reference
    transient APIConfigurations apiConfigurations;

    transient StaticWrapper httpGetWrapper = new StaticWrapper();

    /**
     * Logger
     */

    @Override
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        String latitude = req.getParameter("lat");
        String longitude = req.getParameter("long");
        String apiUrl = apiConfigurations.getConfigProperty(HeroConstants.OSGI_GEOCODEAPIURL);
        HttpGet httpGet = httpGetWrapper.getHttpGet(apiUrl);
        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
        try {
            URI url = new URIBuilder(httpGet.getURI()).addParameter("latlng", String.join(",", latitude, longitude))
                    .addParameter("key",
                            apiConfigurations.getConfigProperties().get(HeroConstants.OSGI_GEOCODEACCESSKEY).toString())
                    .addParameter("result_type", "administrative_area_level_3")
                    .build();
            ((HttpRequestBase) httpGet).setURI(url);
            CloseableHttpResponse smsAPIResponse = httpClient.execute(httpGet);
            JsonObject mapResponse = httpGetWrapper.getJsonFromString(EntityUtils.toString(smsAPIResponse.getEntity()));
            if (mapResponse.has("status") && mapResponse.get("status").getAsString().equals("OK")) {
                JsonArray asJsonArray = mapResponse.get("results").getAsJsonArray();
                JsonArray addressArray = asJsonArray.get(0).getAsJsonObject().get("address_components")
                        .getAsJsonArray();
                for (JsonElement addressData : addressArray) {
                    for (JsonElement type : addressData.getAsJsonObject().get("types").getAsJsonArray()) {
                        if (type.getAsString().equals("administrative_area_level_3")) {
                            responseObject.add("City", addressData.getAsJsonObject().get("long_name"));
                        }
                        if (type.getAsString().equals("administrative_area_level_1")) {
                            responseObject.add("State", addressData.getAsJsonObject().get("long_name"));
                        }
                    }
                }

                responseObject.add("Status", mapResponse.get("status"));
            } else {
                responseObject.add("Status", mapResponse.get("status"));
            }
            resp.getWriter().write(responseObject.toString());
        } catch (JsonSyntaxException e) {
            log.error("....error in getting geocode values ......", e);
        } catch (URISyntaxException e) {
            log.error("....error in getting geocode values ......", e);
        } finally {
            httpClient.close();
        }
    }

}