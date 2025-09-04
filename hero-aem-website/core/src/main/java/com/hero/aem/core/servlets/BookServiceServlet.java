package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import javax.servlet.Servlet;

import org.apache.commons.io.IOUtils;
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

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;
import com.hero.aem.core.services.osgiconfigs.HeroAPIEndPointsConfigurations;
import com.hero.aem.core.util.BookServiceUtils;
import com.hero.aem.core.util.StaticWrapper;

@Component(service = Servlet.class, immediate = true, property = {
		Constants.SERVICE_DESCRIPTION + "=Book Service based on user selection",
		ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=bookservice",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=submitFeedback",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class BookServiceServlet extends SlingAllMethodsServlet {
	private static final long serialVersionUID = 4438376868274173005L;

	private static final Logger log = LoggerFactory.getLogger(BookServiceServlet.class);

	@Reference
	transient HeroAPIEndPointsConfigurations apiConfigurations;

	transient StaticWrapper httpGetWrapper = new StaticWrapper();

	ObjectMapper objectMapper;

	@Activate
	public void activate() {
		objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	}

	@Override
	protected void doPost(final SlingHttpServletRequest request, final SlingHttpServletResponse response) {
		log.info(getServletName());

		JsonObject input;
		JsonObject outputObj = new JsonObject();
		outputObj.addProperty("status", "fail");
		
		try {
			input = httpGetWrapper
					.getJsonFromString(IOUtils.toString(request.getInputStream(), StandardCharsets.UTF_8));
			if (request.getRequestPathInfo().getSelectorString().equals("bookservice")) {

			String jobCardNumber = BookServiceUtils.getJobCardNumber(request, httpGetWrapper, objectMapper, input, apiConfigurations);

			if (jobCardNumber != null) {
				String getSRID = BookServiceUtils.getSRID(request, httpGetWrapper, objectMapper, jobCardNumber, apiConfigurations);
				if (getSRID != null) {
					input.addProperty("SR_ID", getSRID);
					String bookingDetails = BookServiceUtils.getBookingStatus(request, input, objectMapper,
							httpGetWrapper, apiConfigurations);
					if(bookingDetails != null) {
						outputObj.addProperty("status", "success");
						outputObj.addProperty("message", bookingDetails);
					}else {
						outputObj.addProperty("message", "unable to get Booking Details from WSCALL Job Card API");
					}
					
				} else {
					outputObj.addProperty("message", "unable to get SRID from getSRID API");
				}

			} else {
				outputObj.addProperty("message", "unable to get JobCard Number from WSCall API");
			}

			response.getWriter().write(outputObj.toString());
			}
			else if (request.getRequestPathInfo().getSelectorString().equals("submitFeedback")) {
				String encodedData = BookServiceUtils.submitFeedback(request, httpGetWrapper, objectMapper, input);
				outputObj.addProperty("message", encodedData);
				outputObj.addProperty("status", "success");
				response.getWriter().write(outputObj.toString());
				
			}
		} catch (JsonSyntaxException | IOException e) {
			log.error("Exception Occurred",e);
		}

	}

}
