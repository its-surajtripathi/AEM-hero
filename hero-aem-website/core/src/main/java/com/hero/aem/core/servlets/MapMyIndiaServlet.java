package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.httpclient.NameValuePair;
import org.apache.http.HttpEntity;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
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
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

@SuppressWarnings("serial")
@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Map My India servlet",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=getMMIDetails",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class MapMyIndiaServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(MapMyIndiaServlet.class);

    @Reference
    transient APIConfigurations apiConfigurations;

    ObjectMapper objectMapper;

    transient StaticWrapper httpGetWrapper = new StaticWrapper();

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

        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
		try {

			String urlParameters = "?grant_type=" + apiConfigurations.getConfigProperty("getGrantType") + "&client_id="
					+ apiConfigurations.getConfigProperty("getMMIClientID") + "&client_secret="
					+ apiConfigurations.getConfigProperty("getMMIClientSecret");
			final HttpPost postReq = new HttpPost(
					apiConfigurations.getConfigProperties().get("getMMIEndPoint").toString().concat(urlParameters));

			postReq.setHeader("accept", "application/json");
			postReq.setHeader("Content-Type", "application/x-www-form-urlencoded");
			CloseableHttpResponse response = httpClient.execute(postReq);
			resp.getWriter().write(EntityUtils.toString(response.getEntity()));
		} finally {
            httpClient.close();
        }
    }

}