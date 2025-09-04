package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.hero.aem.core.beans.SafetyProgramBean;
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
        Constants.SERVICE_DESCRIPTION + "=Safety Program Form servlet",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/serviceform",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=safetyprogram",
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class ServiceSafetyprogramServlet extends SlingAllMethodsServlet {
    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(ServiceSafetyprogramServlet.class);

    @Reference
    transient MessagingService messagingService;

    public static final String SAFETYPROGRAM_CONSTANT = "{\n" +
            "        PWSESSIONRS: {\n" +
            "          PWPROCESSRS: {\n" +
            "            PWHEADER: {\n" +
            "              IN_PROCESS_ID: \"1\",\n" +
            "              APP_ID: \"GBC\",\n" +
            "              ORG_ID: \"GBC\",\n" +
            "              OUT_PROCESS_ID: \"insert_Service_Statics\",\n" +
            "              LOGIN_ID: \"\",\n" +
            "            },\n" +
            "            PWDATA: {\n" +
            "              insert_Service_Statics: {\n" +
            "                Row: [\n" +
            "                  {\n" +
            "                    0: ${enrolltype},\n" +
            "                    1: ${fullname},\n" +
            "                    2: ${mobileno},\n" +
            "                    3: ${email},\n" +
            "                    4: ${enrollmentNameVal},\n" +
            "                    5: ${dateEnroll},\n" +
            "                    6: ${ttcenterNameVal},\n" +
            "                    7: ${drive-radio},\n" +
            "                    8: ${license-radio},\n" +
            "                    9: ${organisationfullname},\n" +
            "                    10: ${participantsNo},\n" +
            "                    11: \"MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=\",\n" +
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
        final SafetyProgramBean safetyProgramBean = objectMapper.readValue(input.toString(),
                SafetyProgramBean.class);
        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
        try {
            HttpPost httpPost = new HttpPost(
                    "https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
            Map<String, String> requestMap = new HashMap<String, String>();
            requestMap.put("enrolltype", safetyProgramBean.getEnrolltype());
            requestMap.put("fullname", safetyProgramBean.getFullName());
            requestMap.put("mobileno", safetyProgramBean.getMobile());
            requestMap.put("email", safetyProgramBean.getEmail());
            requestMap.put("enrollmentNameVal", safetyProgramBean.getEnrollprogram());
            requestMap.put("dateEnroll", safetyProgramBean.getDate());
            requestMap.put("ttcenterNameVal", safetyProgramBean.getLocation());
            requestMap.put("drive-radio", safetyProgramBean.getRidetwowheeler());
            requestMap.put("license-radio", safetyProgramBean.getValidLicense());
            requestMap.put("organisationfullname",
                    safetyProgramBean.getEnrolltype().equalsIgnoreCase("Group") ? safetyProgramBean.getOrgName()
                            : "\"\"");
            requestMap.put("participantsNo",
                    safetyProgramBean.getEnrolltype().equalsIgnoreCase("Group")
                            ? safetyProgramBean.getParticipantCount()
                            : "\"\"");

            StringSubstitutor sub = new StringSubstitutor(requestMap);
            String finalReq = sub.replace(SAFETYPROGRAM_CONSTANT);
            log.debug("SafetyProgram Form Request Sent--" + finalReq);
            StringEntity entity = new StringEntity(finalReq);
            httpPost.setEntity(entity);
            httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
            CloseableHttpResponse response = httpClient.execute(httpPost);
            String jsonVal = EntityUtils.toString(response.getEntity());
            log.info("SafetyProgram Form Response" + jsonVal);
            resp.getWriter().write(jsonVal);
        } catch (IOException e) {
            log.error("Exception in ServiceSafetyProgram Servlet" + e.getMessage());
        } finally {
            httpClient.close();
        }
    }
}
