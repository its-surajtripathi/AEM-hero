package com.hero.aem.core.servlets;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.google.gson.JsonObject;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;

@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=State City List",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=statecitylist",
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET })
public class StateCityListServlet extends SlingAllMethodsServlet {

    private static Logger log = LoggerFactory.getLogger(StateCityListServlet.class);

    /**
     * Generated serialVersionUID
     */
    private static final long serialVersionUID = 4438376868274173005L;

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
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServletException, IOException {
        try {
            JsonObject obj = new JsonObject();
            ArrayList<String> cityList;
            String state = null;
            ResourceResolver res = req.getResourceResolver();
            Resource statesRes = res.getResource("/content/hmc/dealers/in/dlr");
            Node node = statesRes.adaptTo(Node.class);
            final NodeIterator it = node.getNodes();
            while (it.hasNext()) {
                Node childNode = it.nextNode();
                NodeIterator childIt = childNode.getNodes();
                cityList = new ArrayList<>();
                state = childNode.getProperty("state_name").getString();
                while (childIt.hasNext()) {
                    Node cityNode = childIt.nextNode();
                    cityList.add(cityNode.getProperty("city").getString());

                }
                obj.addProperty(state, cityList.toString());
            }

            log.debug("State City Response {}", obj);
            resp.getWriter().write(obj.toString());
        } catch (IOException e) {
            log.error("IOException in BookTestRide Servlet {}", e.getMessage());
        } catch (RepositoryException e) {
            log.error("RepositoryException in BookTestRide Servlet {}", e.getMessage());
        } catch (Exception e) {
            log.error("Exception in BookTestRide Servlet {}", e.getMessage());
        }
    }

}
