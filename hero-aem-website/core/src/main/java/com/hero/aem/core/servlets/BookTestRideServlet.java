package com.hero.aem.core.servlets;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.xml.soap.SOAPException;

import com.hero.aem.core.services.SOAPServiceGen;
import org.apache.commons.text.StringSubstitutor;
import org.apache.http.ParseException;
import org.apache.http.client.utils.URIBuilder;
import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.ServletResolverConstants;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
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
import com.hero.aem.core.beans.LeadGenerationAPIBean;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;

@SuppressWarnings("serial")
@Component(service = Servlet.class, immediate = true, property = {
		Constants.SERVICE_DESCRIPTION + "=Lead Generation servlet",
		ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/booktestride",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=bookatestride",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=requestcallback",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=generatelead",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class BookTestRideServlet extends SlingAllMethodsServlet {

	/**
	 * Generated serialVersionUID
	 */
	private static final long serialVersionUID = 4438376868274173005L;

	private static final Logger log = LoggerFactory.getLogger(BookTestRideServlet.class);

	public static final String SERVICE_CAMPAIGN_CONSTANT = "{\r\n"
			+ "  \"PWSESSIONRS\": {\r\n"
			+ "    \"PWPROCESSRS\": {\r\n"
			+ "      \"PWHEADER\": {\r\n"
			+ "        \"IN_PROCESS_ID\": \"1\", \r\n"
			+ "        \"APP_ID\": \"GBC\",\r\n"
			+ "        \"ORG_ID\": \"GBC\",\r\n"
			+ "        \"OUT_PROCESS_ID\": \"oa_getCountryCode\",\r\n"
			+ "        \"LOGIN_ID\": \"\"\r\n"
			+ "      },\r\n"
			+ "      \"PWDATA\": {\r\n"
			+ "        \"oa_getCountryCode\": {\r\n"
			+ "          \"Row\": [\r\n"
			+ "            {\r\n"
			+ "              \"0\":\"${name}\",\r\n"
			+ "              \"1\":\"${mobile}\",\r\n"
			+ "              \"2\":\"${vehicleModel}\",\r\n"
			+ "              \"3\":\"${city}\",\r\n"
			+ "              \"4\":\"${state}\",\r\n"
			+ "              \"5\":\"${dealerCode}\",\r\n"
			+ "              \"6\":\"MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=\"\r\n"
			+ "            }\r\n"
			+ "          ]\r\n"
			+ "        }\r\n"
			+ "      },\r\n"
			+ "      \"PWERROR\": \"\"\r\n"
			+ "    }\r\n"
			+ "  }\r\n"
			+ "}";

	public static final String NDC_CAMPAIGN_CONSTANT = "{\r\n"
			+ "  \"PWSESSIONRS\": {\r\n"
			+ "    \"PWPROCESSRS\": {\r\n"
			+ "      \"PWHEADER\": {\r\n"
			+ "        \"IN_PROCESS_ID\": \"1\", \r\n"
			+ "        \"APP_ID\": \"GBC\",\r\n"
			+ "        \"ORG_ID\": \"GBC\",\r\n"
			+ "        \"OUT_PROCESS_ID\": \"Ndc_Campaign\",\r\n"
			+ "        \"LOGIN_ID\": \"\"\r\n"
			+ "      },\r\n"
			+ "      \"PWDATA\": {\r\n"
			+ "        \"Ndc_Campaign\": {\r\n"
			+ "          \"Row\": [\r\n"
			+ "            {\r\n"
			+ "              \"0\":\"${name}\",\r\n"
			+ "              \"1\":\"${mobile}\",\r\n"
			+ "              \"2\":\"${state}\",\r\n"
			+ "              \"3\":\"${city}\",\r\n"
			+ "              \"4\":\"${dealerName}\",\r\n"
			+ "              \"5\":\"${dealerCode}\",\r\n"
			+ "              \"6\":\"${topic}\",\r\n"
			+ "              \"7\":\"${suggestion}\",\r\n"
			+ "              \"8\":\"MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=\"\r\n"
			+ "            }\r\n"
			+ "          ]\r\n"
			+ "        }\r\n"
			+ "      },\r\n"
			+ "      \"PWERROR\": \"\"\r\n"
			+ "    }\r\n"
			+ "  }\r\n"
			+ "}";

	@Reference
	transient APIConfigurations apiConfigurations;

	@Reference
	transient SOAPServiceGen soapServiceGen;

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
		final LeadGenerationAPIBean leadGenerationAPIBean = objectMapper.readValue(input.toString(),
				LeadGenerationAPIBean.class);

		String phoneNum = leadGenerationAPIBean.getMobile();
		String requestID = leadGenerationAPIBean.getReqId();
		String variationType = leadGenerationAPIBean.getVariation_type();

		CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
		try {
			boolean skiprun = BooleanUtils.toBoolean(
					apiConfigurations.getConfigProperties().get(HeroConstants.SKIP_OTP_VALIDATION).toString());
			boolean validationFlag = false;
			if(variationType.equalsIgnoreCase("campaignpage") && StringUtils.isNotBlank(leadGenerationAPIBean.getDealer_code()) && leadGenerationAPIBean.getBike_model().equals("Passion+")){
				validationFlag = true;
				log.info("Inside OTP validation else if passion+");
			}
			else if(!variationType.equalsIgnoreCase("ndc-campaign-page") && !variationType.equalsIgnoreCase("harleycampaign")) {
				log.info("Inside OTP validation if");
				if (leadGenerationAPIBean.getOtp().equals(StringUtils.EMPTY)) {
					if (!skiprun && !StringUtils.equals(Base64.getEncoder().encodeToString(
									String.format("%06d", Math.abs((requestID).hashCode()) % 1000000).getBytes())
							.substring(0, 6), leadGenerationAPIBean.getCaptcha())) {
						resp.sendError(HttpServletResponse.SC_NOT_FOUND, "{invalidcaptcha: true}");
					} else {
						validationFlag = true;
					}
				} else if (leadGenerationAPIBean.getCaptcha().equals(StringUtils.EMPTY))
					if (!skiprun && null != leadGenerationAPIBean.getOtp()
							&& !StringUtils.equals(String.format("%06d", Math.abs((phoneNum + requestID).hashCode()) % 1000000),
							leadGenerationAPIBean.getOtp())) {
						resp.sendError(HttpServletResponse.SC_NOT_FOUND, "{invalidotp: true}");
					} else {
						validationFlag = true;
					}
			}

			else {
				validationFlag = true;
				log.info("Inside OTP validation else");
			}


			if(validationFlag) {
				log.info("Campaign Form Enhancement Variation Type {}", variationType);
				if(variationType.equalsIgnoreCase("harleycampaign")) {
					String xml = soapServiceGen.GenerateXML(leadGenerationAPIBean);
					log.info("Harley Campaign XML {}", xml);
					String harleyResp = soapServiceGen.ProcessSOAPRequest(xml);
					log.info("Harley Campaign Response {}" ,harleyResp);
					resp.getWriter().write(harleyResp);
				}
				else if(variationType.equalsIgnoreCase("campaignpage") && StringUtils.isNotBlank(leadGenerationAPIBean.getDealer_code())){
					if(leadGenerationAPIBean.getBike_model().equals("XOOM") || leadGenerationAPIBean.getBike_model().equals("Passion+")) {
						String xml = soapServiceGen.GenerateXML(leadGenerationAPIBean);
						log.info("XOOM South Region Campaign XML {}", xml);
						String xoomSouthRegionResp = soapServiceGen.ProcessSOAPRequest(xml);
						log.info("XOOM South Region Campaign Response {}", xoomSouthRegionResp);
						resp.getWriter().write(xoomSouthRegionResp);
					}
					else {
						try {
							HttpPost httpPost = new HttpPost("https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
							Map<String, String> requestMap = new HashMap<String, String>();
							requestMap.put("name", leadGenerationAPIBean.getName());
							requestMap.put("mobile", leadGenerationAPIBean.getMobile());
							requestMap.put("vehicleModel", leadGenerationAPIBean.getBike_model());
							requestMap.put("city", leadGenerationAPIBean.getCity());
							requestMap.put("state", leadGenerationAPIBean.getState());
							requestMap.put("dealerCode", leadGenerationAPIBean.getDealer_code());
							StringSubstitutor sub = new StringSubstitutor(requestMap);
							String finalReq = sub.replace(SERVICE_CAMPAIGN_CONSTANT);
							log.debug("New Campaign Leads Request Sent-- {}" , finalReq);
							StringEntity entity = new StringEntity(finalReq);
							httpPost.setEntity(entity);
							httpPost.setHeader("Content-type", "application/json");
							CloseableHttpResponse response = httpClient.execute(httpPost);
							String jsonVal = EntityUtils.toString(response.getEntity());
							log.info("New Lead Campaign Response {}" , jsonVal);
							JsonObject obj = new JsonObject();
							obj.addProperty("login", "true");
							obj.addProperty("response", HeroConstants.MESSAGE);
							if (jsonVal.contains(HeroConstants.SUCCESS)) {
								obj.addProperty(HeroConstants.MESSAGE, HeroConstants.SUCCESS);
							} else {
								obj.addProperty(HeroConstants.MESSAGE, HeroConstants.FAILURE);
							}
							resp.getWriter().write(obj.toString());
						} catch (IOException e) {
							log.error("Exception in BookTestRide Servlet {}" , e.getMessage(), e);
						} finally {
							httpClient.close();
						}
					}
				}
				else if(variationType.equalsIgnoreCase("ndc-campaign-page") ){
					try {
						HttpPost httpPost = new HttpPost("https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC");
						Map<String, String> requestMap = new HashMap<String, String>();
						requestMap.put("name", leadGenerationAPIBean.getName());
						requestMap.put("mobile", leadGenerationAPIBean.getMobile());
						requestMap.put("topic", leadGenerationAPIBean.getTopic()+"|"+leadGenerationAPIBean.getSection());
						requestMap.put("suggestion", leadGenerationAPIBean.getSuggestion());
						requestMap.put("city", leadGenerationAPIBean.getCity());
						requestMap.put("state", leadGenerationAPIBean.getState());
						requestMap.put("dealerCode", leadGenerationAPIBean.getDealer_code());
						requestMap.put("dealerName", leadGenerationAPIBean.getDealer_name());
						StringSubstitutor sub = new StringSubstitutor(requestMap);
						String finalReq = sub.replace(NDC_CAMPAIGN_CONSTANT);
						log.debug("New Campaign Leads Request Sent-- {}", finalReq);
						StringEntity entity = new StringEntity(finalReq);
						httpPost.setEntity(entity);
						httpPost.setHeader("Content-type", "application/json");
						CloseableHttpResponse response = httpClient.execute(httpPost);
						String jsonVal = EntityUtils.toString(response.getEntity());
						log.info("New NDC Campaign Response {}", jsonVal);
						JsonObject obj=new JsonObject();
						obj.addProperty("login", "true");
						obj.addProperty("response", HeroConstants.MESSAGE);
						if(jsonVal.contains(HeroConstants.SUCCESS)){
							obj.addProperty(HeroConstants.MESSAGE, HeroConstants.SUCCESS);
						}
						else {
							obj.addProperty(HeroConstants.MESSAGE, HeroConstants.FAILURE);
						}
						resp.getWriter().write(obj.toString());
					}
					catch (IOException e) {
						log.error("Exception in NDC Service campaign Servlet {}", e.getMessage(), e);
					}
					finally {
						httpClient.close();
					}
				}
				else {
					log.info("Book a Test Ride  Lead Response");
					leadGenerationAPIBean.setToken(
							apiConfigurations.getConfigProperties().get(HeroConstants.OSGI_LEADGENTOKEN).toString());
					final HttpPost postReq = new HttpPost(
							apiConfigurations.getConfigProperties().get(HeroConstants.OSGI_LEADGENAPI).toString());
					postReq.setHeader("Content-Type", "application/json");
					postReq.setEntity(new StringEntity(objectMapper.writeValueAsString(leadGenerationAPIBean)));
					CloseableHttpResponse response = httpClient.execute(postReq);
					CloseableHttpClient httpClient1 = httpGetWrapper.createDefaultHttpClient();
					try {
						// LEAD SQUARE_ API
						HttpPost httpPost = new HttpPost(apiConfigurations.getConfigProperties().get("newLeadGenAPI").toString());
						httpPost.setHeader("Content-Type", "application/json");
						URI uri = new URIBuilder(httpPost.getURI())
								.addParameter("accessKey", apiConfigurations.getConfigProperties().get("newleadGenAccessKey").toString())
								.addParameter("secretKey", apiConfigurations.getConfigProperties().get("newLeadGenSecretKey").toString())
								.build();
						httpPost.setURI(uri);
						Map<String, String> requestMap = new HashMap<String, String>();
						String source = StringUtils.isNotBlank(leadGenerationAPIBean.getSource()) ? leadGenerationAPIBean.getSource():"CWS";
						requestMap.put("customerName", leadGenerationAPIBean.getName());
						requestMap.put("utmSource", source);
						requestMap.put("source", source);
						requestMap.put("email", leadGenerationAPIBean.getEmail());
						requestMap.put("mobile", leadGenerationAPIBean.getMobile());
						requestMap.put("vehicleModel", leadGenerationAPIBean.getBike_model());
						requestMap.put("city", leadGenerationAPIBean.getCity());
						requestMap.put("state", leadGenerationAPIBean.getState());
						requestMap.put("utm_content", StringUtils.isNotBlank(leadGenerationAPIBean.getUtm_content()) ? leadGenerationAPIBean.getUtm_content() : source);
						requestMap.put("utm_term", StringUtils.isNotBlank(leadGenerationAPIBean.getUtm_term()) ? leadGenerationAPIBean.getUtm_term() : source);
						requestMap.put("utm_campaign", StringUtils.isNotBlank(leadGenerationAPIBean.getUtm_campaign()) ? leadGenerationAPIBean.getUtm_campaign() : source);
						requestMap.put("utm_medium", StringUtils.isNotBlank(leadGenerationAPIBean.getUtm_medium()) ? leadGenerationAPIBean.getUtm_medium() : source);
						StringSubstitutor sub = new StringSubstitutor(requestMap);
						String finalReq = sub.replace(HeroConstants.LEADSQUARE_CONSTANT);
						log.debug("New Lead Square Request Sent-- {}" , finalReq);
						StringEntity entity = new StringEntity(finalReq);
						httpPost.setEntity(entity);
						CloseableHttpResponse response1 = httpClient1.execute(httpPost);
						String jsonVal = EntityUtils.toString(response1.getEntity());
						log.info("New Lead SQUARE Response {}" , jsonVal);
						JsonObject obj = new JsonObject();
						obj.addProperty("login", "true");
						obj.addProperty("response", HeroConstants.MESSAGE);
						if (jsonVal.toLowerCase().contains(HeroConstants.SUCCESS)) {
							obj.addProperty(HeroConstants.MESSAGE, HeroConstants.SUCCESS);
						} else {
							obj.addProperty(HeroConstants.MESSAGE, HeroConstants.FAILURE);
						}
						resp.getWriter().write(obj.toString());
					} catch (URISyntaxException | ParseException | IOException e) {
						log.error("Exception in Book a test servlet", e);
					} 
					finally{
						httpClient1.close();
					}
				}
			}
		} catch (SOAPException e) {
			log.error("Exception in SOAP Harley Form", e);
		} finally {
			httpClient.close();
		}
	}

}