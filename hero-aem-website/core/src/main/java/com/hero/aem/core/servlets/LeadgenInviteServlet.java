package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;

import com.hero.aem.core.services.MessagingService;
import org.apache.http.ParseException;
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
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

@Component(service = Servlet.class, immediate = true, property = {
		Constants.SERVICE_DESCRIPTION + "=Lead Generation servlet",
		ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES
				+ "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=premiainvite",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=generatelead",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class LeadgenInviteServlet extends SlingAllMethodsServlet {

	/**
	 * Generated serialVersionUID
	 */
	private static final long serialVersionUID = 4438376868274173005L;

	private static final Logger log = LoggerFactory.getLogger(LeadgenInviteServlet.class);

	@Reference
	transient APIConfigurations apiConfigurations;

	@Reference
	transient MessagingService messagingService;

	transient StaticWrapper httpGetWrapper = new StaticWrapper();

	/**
	 * Logger
	 */

	@Override
	protected void doPost(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {
		// String body = req.getReader().lines()
		// .reduce("", (accumulator, actual) -> accumulator + actual);
		// log.debug("Leadgen Invite - Request body:" + body);
		CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
		try {
			JsonObject input = httpGetWrapper
					.getJsonFromString(IOUtils.toString(req.getInputStream(), StandardCharsets.UTF_8));

			String reqFormat = (input.get("REQ_FORMAT") != null) ? input.get("REQ_FORMAT").getAsString() : null;

			// Reading the `configName` value which will the OSGI config property to look up
			String configName = input.get(HeroConstants.PARAM_NAME_CONFIG) != null
					? input.get(HeroConstants.PARAM_NAME_CONFIG).getAsString()
					: "configAcaa";
			JsonObject configInput = httpGetWrapper.getJsonFromString(apiConfigurations.getConfigProperty(configName));
			if (reqFormat == null || configInput == null) {
				resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				resp.getWriter()
						.write("'REQ_FORMAT' is missing in body,  or 'configName' value is Invalid");
				log.warn("'REQ_FORMAT' is missing in body,  or 'configName' value is Invalid");
				return;
			}

			/**
			 * Getting the details from OSGI config.
			 * The OSGI config property need to be added/available as per below JSON format.
			 * {"apiUrl":"https://sample/url?q=v","Authorization":"Basic XXXX",
			 * "templateId":"12345", "templateMsg":"Sample Message"}
			 * 
			 */
			final String TEMPL_MSG_TXT = configInput.get(HeroConstants.PARAM_NAME_TEMP_MSG).getAsString();
			final String TEMPL_ID = configInput.get(HeroConstants.PARAM_NAME_TEMP_ID).getAsString();

			// LEAD SQUARE_API
			HttpPost httpPost = new HttpPost(configInput.get(HeroConstants.PARAM_NAME_API_URL).getAsString());
			log.debug("Leadgen Invite- apiUrl" + configInput.get(HeroConstants.PARAM_NAME_API_URL).getAsString());
			httpPost.setHeader("Content-Type", "application/json");
			httpPost.setHeader("Authorization", configInput.get(HeroConstants.PARAM_NAME_AUTH_HEADER).getAsString());

			String finalReq = reqFormat;
			log.debug("Leadgen Invite- Lead Square Request Prepared--" + finalReq);
			StringEntity entity = new StringEntity(finalReq);
			httpPost.setEntity(entity);
			CloseableHttpResponse response1 = httpClient.execute(httpPost);
			String jsonVal = EntityUtils.toString(response1.getEntity());
			log.info("Leadgen Invite - Lead SQUARE Response" + jsonVal);
			JsonObject obj = new JsonObject();
			obj.addProperty("login", "true");
			obj.addProperty("response", "message");
			if (jsonVal.toLowerCase().contains("success")) {
				obj.addProperty("message", "success");
			} else {
				obj.addProperty("message", "failure");
			}
			if (input.get("MOBILE_NO") != null) {
				String tyResponseMsg = messagingService.sendSMS(input.get("MOBILE_NO").getAsString(),
						TEMPL_MSG_TXT, TEMPL_ID);
				log.debug("Thankyou response:" + tyResponseMsg);
				if (tyResponseMsg != null) {
					obj.addProperty("thankYouMessage", tyResponseMsg.contains("OK") ? "Success" : "Fail");
				} else {
					obj.addProperty("thankYouMessage", "Fail");
				}
			} else {
				log.warn("Required property is missing in body: 'MOBILE_NO' ");
				obj.addProperty("thankYouMessage", "Could not send thank u msg as 'MOBILE_NO' is missing in body.");
			}
			resp.getWriter().write(obj.toString());
		} catch (IOException | ParseException e) {
			log.error("Premia - Exception in servlet" + e);
		} catch (JsonParseException e) {
			resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			resp.getWriter().write("Invalid JSON. Check the request JSON or JSON config from backend.");
			log.error("Error in Leadgen servlet:" + e.getMessage(), e);
		} finally {
			httpClient.close();
		}
	}
}