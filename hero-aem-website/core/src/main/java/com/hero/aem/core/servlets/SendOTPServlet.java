package com.hero.aem.core.servlets;

import java.io.IOException;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;

import com.hero.aem.core.services.MessagingService;
import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Send OTP based on random session_id",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=sendotp",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class SendOTPServlet extends SlingAllMethodsServlet {
    private static final long serialVersionUID = 4438376868274173005L;

    private static final Logger LOGGER = LoggerFactory.getLogger(SendOTPServlet.class);

    @Reference
    transient APIConfigurations apiConfigurations;

    @Reference
    transient MessagingService messagingService;

    transient StaticWrapper httpGetWrapper = new StaticWrapper();

    @Override
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws ServletException, IOException {
        String phoneNum = request.getParameter(HeroConstants.REQ_PARAM_PHONE_NUMBER);
        String pageType = request.getParameter(HeroConstants.REQ_PARAM_PAGE_TYPE);
        String vehicleName = request.getParameter(HeroConstants.REQ_PARAM_VEHICLE_NAME);
        String requestID = request.getParameter("reqID");
        String otp = String.format("%06d", Math.abs((phoneNum + requestID).hashCode()) % 1000000);
        String templateID = "";
        String msgText = "";

        long current = System.currentTimeMillis();
        long incoming = -1;
        String key = String.format("%09d", Math.abs((phoneNum).hashCode()) % 10000000);
        int timeDiffInMs = Integer
                .parseInt(apiConfigurations.getConfigProperty(HeroConstants.OSGI_ACCEPTEDTIMEDIFFINMS));

        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(key)) {
                incoming = Long.parseLong(cookie.getValue());
            }
        }

        Cookie respCookie = new Cookie(key, String.valueOf(current));
        respCookie.setMaxAge((timeDiffInMs / 1000) + 30);
        response.addCookie(respCookie);

        if (current - incoming < timeDiffInMs && incoming != -1) {
            response.setStatus(429);
            response.getWriter().write("Too many concurrent requests from your session.");
        } else {
            switch (pageType) {
                case HeroConstants.PAGE_TYPE_HOME:
                    templateID = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDHOME);
                    msgText = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGHOME).replace("{otp}",
                            otp);
                    break;
                case HeroConstants.PAGE_TYPE_HARLEY:
                    templateID = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDHARLEY);
                    msgText = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGHARLEY).replace(
                            "{otp}",
                            otp);
                    break;
                case HeroConstants.ACAA:
                    templateID = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDACAA);
                    msgText = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGACAA).replace("{otp}",
                            otp);
                    msgText = msgText.replace("{vehicleName}", vehicleName);
                    break;

                default:
                    templateID = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPITEMPLATEIDPRODUCT);
                    msgText = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIMSGPRODUCT).replace(
                            "{otp}",
                            otp);
                    msgText = msgText.replace("{vehicleName}", vehicleName);
                    break;
            }
            String apiUrl = apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIURL);
            LOGGER.debug("OTP Template for Page type: {}", pageType);
            httpGetWrapper.getHttpGet(apiUrl);
            try (CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient()) {
                String msg = messagingService.sendSMS(phoneNum, msgText, templateID);
                response.getWriter().write(msg);
            }
        }
    }
}
