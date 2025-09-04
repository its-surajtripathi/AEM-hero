package com.hero.aem.core.servlets;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.hero.aem.core.beans.XtrackBean;
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
        Constants.SERVICE_DESCRIPTION + "=Xtrack Form servlet",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/xtrack-form",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=xtrack",
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class XtrackFormServlet extends SlingAllMethodsServlet {

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger log = LoggerFactory.getLogger(XtrackFormServlet.class);

    @Reference
    transient MessagingService messagingService;

    public static final String XTRACK_CONSTANT = "{\n" +
            "        PWSESSIONRS: {\n" +
            "          PWPROCESSRS: {\n" +
            "            PWHEADER: {\n" +
            "              IN_PROCESS_ID: \"1\",\n" +
            "              APP_ID: \"GBC\",\n" +
            "              ORG_ID: \"GBC\",\n" +
            "              OUT_PROCESS_ID: \"MB_User_RegistrationV2\",\n" +
            "              LOGIN_ID: \"\",\n" +
            "            },\n" +
            "            PWDATA: {\n" +
            "              MB_User_RegistrationV2: {\n" +
            "                Row: [\n" +
            "                  {\n" +
            "                    0: ${event},\n" +
            "                    1: ${name},\n" +
            "                    2: ${age},\n" +
            "                    3: ${email},\n" +
            "                    4: ${mobile},\n" +
            "                    5: ${vehicle},\n" +
            "                    6: ${address},\n" +
            "                    7: ${data_rider},\n" +
            "                    8: ${rider_community_name},\n" +
            "                    9: ${fb_handle},\n" +
            "                    10: ${tweet_handle},\n" +
            "                    11: ${insta_handle},\n" +
            "                    12: \"MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=\",\n" +
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
        final XtrackBean xtrackBean = objectMapper.readValue(input.toString(),
                XtrackBean.class);
      CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
      try {
            HttpPost httpPost = new HttpPost("https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
            Map<String, String> requestMap = new HashMap<String, String>();
          requestMap.put("event", xtrackBean.getEvent());
            requestMap.put("name", xtrackBean.getName());
            requestMap.put("age", xtrackBean.getAge());
            requestMap.put("email", xtrackBean.getEmail());
            requestMap.put("mobile", xtrackBean.getMobile());
            requestMap.put("vehicle", xtrackBean.getVehicle());
            requestMap.put("address", xtrackBean.getAddress());
            requestMap.put("data_rider", xtrackBean.getDataRider());
            requestMap.put("rider_community_name", xtrackBean.getRiderCommunityName() == null ? xtrackBean.getRiderCommunityName():"\"\"");
            requestMap.put("fb_handle", xtrackBean.getFbHandle() == null ? xtrackBean.getFbHandle():"\"\"");
            requestMap.put("tweet_handle", xtrackBean.getTweetHandle() == null ? xtrackBean.getTweetHandle(): "\"\"");
            requestMap.put("insta_handle", xtrackBean.getInstaHandle() == null ? xtrackBean.getInstaHandle() : "\"\"");
            StringSubstitutor sub = new StringSubstitutor(requestMap);
            String finalReq = sub.replace(XTRACK_CONSTANT);
            log.debug("Xtrack Request Sent--"+finalReq);
            StringEntity entity = new StringEntity(finalReq);
            httpPost.setEntity(entity);
            httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
            CloseableHttpResponse response = httpClient.execute(httpPost);
            String jsonVal = EntityUtils.toString(response.getEntity());
            if(jsonVal.contains("success")) {
                String msgTxt = xtrackBean.getSmsText();
            messagingService.sendSMS(xtrackBean.getMobile(),msgTxt,"1707168017332249697");
            }
            log.info("Xtrack Response"+jsonVal);
            resp.getWriter().write(jsonVal);
        }
        catch (IOException e) {
            log.error("Exception in BookTestRide Servlet"+e.getMessage());
        }
        finally {
            httpClient.close();
        }
    }
}