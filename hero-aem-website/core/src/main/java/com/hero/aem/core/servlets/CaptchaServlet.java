package com.hero.aem.core.servlets;

import java.io.IOException;
import java.util.Base64;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Send Captcha",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES +"=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=captcha",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
    public class CaptchaServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 4438376868274173005L;
    private static final Logger log = LoggerFactory.getLogger(CaptchaServlet.class);
    @Override
    protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws IOException {
    	String requestID = request.getParameter("reqID");
        String captcha = Base64.getEncoder().encodeToString(String.format("%06d", Math.abs((requestID).hashCode()) % 1000000).getBytes()).substring(0,6);
        log.debug(captcha);
        response.getWriter().write(captcha);
    }
}