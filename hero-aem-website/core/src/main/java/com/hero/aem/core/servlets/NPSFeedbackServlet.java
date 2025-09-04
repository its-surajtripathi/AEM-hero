package com.hero.aem.core.servlets;


import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.hero.aem.core.beans.NpsBean;
import com.hero.aem.core.services.MessagingService;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;
import org.apache.commons.io.IOUtils;
import org.apache.commons.text.StringSubstitutor;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
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

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component(service = Servlet.class, immediate = true, property = {
    Constants.SERVICE_DESCRIPTION + "=NPS Feedback servlet",
    ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/nps-feedback",
    ServletResolverConstants.SLING_SERVLET_SELECTORS + "=npsfeedback",
    ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
    ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class NPSFeedbackServlet extends SlingAllMethodsServlet {
    
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(NPSFeedbackServlet.class);

    @Reference
    transient MessagingService messagingService;

    public static final String NPS_CONSTANT = "{\n" +
            "        PWSESSIONRS: {\n" +
            "          PWPROCESSRS: {\n" +
            "            PWHEADER: {\n" +
            "              IN_PROCESS_ID: \"1\",\n" +
            "              APP_ID: \"GBC\",\n" +
            "              ORG_ID: \"GBC\",\n" +
            "              OUT_PROCESS_ID: \"websiteFeedback\",\n" +
            "              LOGIN_ID: \"\",\n" +
            "            },\n" +
            "            PWDATA: {\n" +
            "              websiteFeedback: {\n" +
            "                Row: [\n" +
            "                  {\n" +
            "                    0: ${rating},\n" +
            "                    1: ${feedback1},\n" +
            "                    2: ${feedback2},\n" +
            "                    3: ${feedback3},\n" +
            "                    4: ${feedback4},\n" +
            "                    5: ${source},\n" +
            "                    6: \"MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=\",\n" +
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
                final NpsBean npsFeedback = objectMapper.readValue(input.toString(),
                        NpsBean.class);
                CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
                try {
                    HttpPost httpPost = new HttpPost("https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
                    Map<String, String> requestMap = new HashMap<String, String>();
                    requestMap.put("rating", npsFeedback.getRating());
                    requestMap.put("feedback1", npsFeedback.getFeedback1());
                    requestMap.put("feedback2", npsFeedback.getFeedback2().isEmpty()?"\"\"":npsFeedback.getFeedback2());
                    requestMap.put("feedback3", npsFeedback.getFeedback3().isEmpty()?"\"\"":npsFeedback.getFeedback3());
                    requestMap.put("feedback4", npsFeedback.getFeedback4().isEmpty()?"\"\"":npsFeedback.getFeedback4());
                    requestMap.put("source", npsFeedback.getSource());
        
                    StringSubstitutor sub = new StringSubstitutor(requestMap);
                    String finalReq = sub.replace(NPS_CONSTANT);
                    log.debug("NPS Feedback Request Sent--"+finalReq);
                    StringEntity entity = new StringEntity(finalReq);
                    httpPost.setEntity(entity);
                    httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
                    CloseableHttpResponse response = httpClient.execute(httpPost);
                    String jsonVal = EntityUtils.toString(response.getEntity());
                    log.info("NPS Feedback Response"+jsonVal);
                    resp.getWriter().write(jsonVal);
                }
                catch (IOException e) {
                    log.error("Exception in NPS Feedback Servlet"+e.getMessage());
                }
                finally {
                    httpClient.close();
                }
            }

}
