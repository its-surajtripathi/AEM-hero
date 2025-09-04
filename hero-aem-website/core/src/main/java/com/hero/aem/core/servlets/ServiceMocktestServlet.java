package com.hero.aem.core.servlets;


import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.hero.aem.core.beans.ServiceMockTestBean;
import com.hero.aem.core.services.MessagingService;
import org.apache.commons.text.StringSubstitutor;
import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.ServletResolverConstants;

import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
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

@Component(service = Servlet.class, immediate = true, property = {
    Constants.SERVICE_DESCRIPTION + "=Service Mock Test servlet",
    ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/mocktest",
    ServletResolverConstants.SLING_SERVLET_SELECTORS + "=mocktest",
    ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
    ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class ServiceMocktestServlet extends SlingAllMethodsServlet {
    
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(ServiceMocktestServlet.class);

    @Reference
    transient MessagingService messagingService;

    public static final String MOCKTEST_CONSTANT = "{\n" +
            "        PWSESSIONRS: {\n" +
            "          PWPROCESSRS: {\n" +
            "            PWHEADER: {\n" +
            "              IN_PROCESS_ID: \"1\",\n" +
            "              APP_ID: \"GBC\",\n" +
            "              ORG_ID: \"GBC\",\n" +
            "              OUT_PROCESS_ID: \"mock_test_data\",\n" +
            "              LOGIN_ID: \"\",\n" +
            "            },\n" +
            "            PWDATA: {\n" +
            "              mock_test_data: {\n" +
            "                Row: [\n" +
            "                  {\n" +
            "                    0: ${mockTestFullName},\n" +
            "                    1: ${mockTestEmail},\n" +
            "                    2: \"MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=\",\n" +
            "                  },\n" +
            "                ],\n" +
            "              },\n" +
            "            },\n" +
            "            PWERROR: \"\",\n" +
            "          },\n" +
            "        },\n" +
            "      };";
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
        
                JsonObject input = httpGetWrapper
                        .getJsonFromString(IOUtils.toString(req.getInputStream(), StandardCharsets.UTF_8));
                final ServiceMockTestBean mockTestBean = objectMapper.readValue(input.toString(),
                ServiceMockTestBean.class);
                CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
                try {
                    HttpPost httpPost = new HttpPost("https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
                    Map<String, String> requestMap = new HashMap<String, String>();
                    requestMap.put("mockTestFullName", mockTestBean.getMockTestFullName());
                    requestMap.put("mockTestEmail", mockTestBean.getMockTestEmail());
        
                    StringSubstitutor sub = new StringSubstitutor(requestMap);
                    String finalReq = sub.replace(MOCKTEST_CONSTANT);
                    log.debug("MockTest Request Sent--"+finalReq);
                    StringEntity entity = new StringEntity(finalReq);
                    httpPost.setEntity(entity);
                    httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
                    CloseableHttpResponse response = httpClient.execute(httpPost);
                    String jsonVal = EntityUtils.toString(response.getEntity());
                    log.info("MockTest Response"+jsonVal);
                    resp.getWriter().write(jsonVal);
                }
                catch (IOException e) {
                    log.error("Exception in ServiceSafetyProgram Servlet"+e.getMessage());
                }
                finally {
                    httpClient.close();
                }
            }

}
