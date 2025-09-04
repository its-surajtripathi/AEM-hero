package com.hero.aem.core.models;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.servlet.http.Cookie;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;

@Model(adaptables = SlingHttpServletRequest.class)
public class DealersLoginModel {

    @SlingObject
    SlingHttpServletRequest request;

    @SlingObject
    SlingHttpServletResponse response;

    @Inject
    APIConfigurations apiConfigurations;

    private static final Logger LOGGER = LoggerFactory.getLogger(DealersLoginModel.class);

    @PostConstruct
    void init() throws IOException {
        String currentPage = request.getRequestPathInfo().getResourcePath();
        Cookie userLoginCookie = request.getCookie("sessionStat");
        Cookie userDetails = request.getCookie("respData");
        LOGGER.info("Current PAge Path is {}", currentPage);
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");

        if(userLoginCookie != null && userDetails != null){
            String decodedUserLoginCookie = new String(Base64.getDecoder().decode(userLoginCookie.getValue()));
            String decodedUserDetails = new String(Base64.getDecoder().decode(userDetails.getValue()));
            Gson gson = new Gson();
            JsonObject jsonUserDetails = gson.fromJson(decodedUserDetails, JsonObject.class);
            String dealerCode = jsonUserDetails.get("dealer_code").getAsString();
            String dealerToken = jsonUserDetails.get("token").getAsString();
            String dealerOfficeCode = jsonUserDetails.get("area_office_code").getAsString();

            ArrayList<String> loginDetails = new ArrayList<>(Arrays.asList(decodedUserLoginCookie.split(",")));
            if(!loginDetails.get(0).equals(dealerCode) || !loginDetails.get(1).equals(dealerToken) || !loginDetails.get(2).equals(dealerOfficeCode)) {
                if (!currentPage.toLowerCase().contains("login")) {
                    response.sendRedirect(apiConfigurations.getConfigProperties().get("redirectLoginPagePath").toString());
                }
            }
            else {
                String homePagePath = apiConfigurations.getConfigProperties().get("dealerHomePagePath").toString().trim();

                if (homePagePath.endsWith("/")) {
                    homePagePath = homePagePath.substring(0, homePagePath.length() - 1).concat(".html");
                } else if (!homePagePath.endsWith(".html")) {
                    homePagePath = homePagePath.concat(".html");
                }
                if (currentPage.toLowerCase().contains("login")) {
                    response.sendRedirect(homePagePath);
                }
            }
        }
        else {
            if(!currentPage.toLowerCase().contains("login")) {
                LOGGER.info("Cookie Value is null, redirecting to login");
                response.sendRedirect(apiConfigurations.getConfigProperties().get("redirectLoginPagePath").toString());
            }
        }
    }

    public String getDealersAPI(){
        String dealersAPI = apiConfigurations.getConfigProperties().get("dealersPortalAPI").toString();
        return dealersAPI;
    }
}
