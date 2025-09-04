package com.hero.aem.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

@Component(service = Servlet.class, immediate = true, property = {
                Constants.SERVICE_DESCRIPTION + "= Servlet to get the client IP Address",
                ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
                // ServletResolverConstants.DEFAULT_ERROR_HANDLER_RESOURCE_TYPE
                // + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
                ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/structure/page",
                ServletResolverConstants.SLING_SERVLET_SELECTORS + "=ip",
                ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=html",
})
public class IPAddressServlet extends SlingSafeMethodsServlet {
        @Override
        protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
                        throws ServletException, IOException {
                String ipAddress = request.getRemoteAddr();
                response.setContentType("application/json");
                response.getWriter().write("{\"Client_IP\":\"" + ipAddress + "\"}");
        }
}