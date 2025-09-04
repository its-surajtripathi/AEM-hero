package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import com.hero.aem.core.beans.XPulseBean;
import com.hero.aem.core.beans.XtrackBean;
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
        Constants.SERVICE_DESCRIPTION + "=Xpulse Form servlet",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/xtrack-form",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=xpulse",
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class XPulseFormServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(XtrackFormServlet.class);

    @Reference
    transient MessagingService messagingService;

    public static final String XPULSE_CONSTANT = "{\n" +
            "        PWSESSIONRS: {\n" +
            "          PWPROCESSRS: {\n" +
            "            PWHEADER: {\n" +
            "              IN_PROCESS_ID: \"1\",\n" +
            "              APP_ID: \"GBC\",\n" +
            "              ORG_ID: \"GBC\",\n" +
            "              OUT_PROCESS_ID: \"Xpulse_Xperience_Registration\",\n" +
            "              LOGIN_ID: \"\",\n" +
            "            },\n" +
            "            PWDATA: {\n" +
            "              Xpulse_Xperience_Registration: {\n" +
            "                Row: [\n" +
            "                  {\n" +
            "                    0: ${name},\n" +
            "                    1: ${mobile},\n" +
            "                    2: ${address},\n" +
            "                    3: ${city},\n" +
            "                    4: ${selectProgram},\n" +
            "                    5: ${selectDate},\n" +
            "                    6: \"\",\n" +
            "                    7: \"\",\n" +
            "                    8: \"\",\n" +
            "                    9: \"\",\n" +
            "                    10: \"\",\n" +
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
        final XPulseBean xPulseBean = objectMapper.readValue(input.toString(),
                XPulseBean.class);
        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
        try {
            HttpPost httpPost = new HttpPost("https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
            Map<String, String> requestMap = new HashMap<String, String>();
            requestMap.put("name", xPulseBean.getName());
            requestMap.put("mobile", xPulseBean.getMobile());
            requestMap.put("address", xPulseBean.getAddress());
            requestMap.put("city", xPulseBean.getCity());
            requestMap.put("selectProgram", xPulseBean.getSelectProgram());
            requestMap.put("selectDate", xPulseBean.getSelectDate());

            StringSubstitutor sub = new StringSubstitutor(requestMap);
            String finalReq = sub.replace(XPULSE_CONSTANT);
            log.debug("Xpulse Request Sent--"+finalReq);
            StringEntity entity = new StringEntity(finalReq);
            httpPost.setEntity(entity);
            httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
            CloseableHttpResponse response = httpClient.execute(httpPost);
            String jsonVal = EntityUtils.toString(response.getEntity());
            log.info("Xpulse Response"+jsonVal);
            resp.getWriter().write(jsonVal);
        }
        catch (IOException e) {
            log.error("Exception in Xpulse Servlet"+e.getMessage());
        }
        finally {
            httpClient.close();
        }
    }
}