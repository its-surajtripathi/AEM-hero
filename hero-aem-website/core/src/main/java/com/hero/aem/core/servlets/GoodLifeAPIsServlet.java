package com.hero.aem.core.servlets;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.text.StringSubstitutor;
import org.apache.http.ParseException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.jackrabbit.oak.commons.PropertiesUtil;
import org.apache.poi.util.StringUtil;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.granite.crypto.CryptoException;
import com.adobe.granite.crypto.CryptoSupport;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.services.osgiconfigs.HeroAPIEndPointsConfigurations;
import com.hero.aem.core.util.AesCryptUtil;
import com.hero.aem.core.util.GoodlifeUtils;
import com.hero.aem.core.util.StaticWrapper;

@SuppressWarnings("serial")
@Component(service = Servlet.class, immediate = true, property = {
		Constants.SERVICE_DESCRIPTION + "=Good Life and Xclan servlet",
		ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=" + ServletResolverConstants.DEFAULT_RESOURCE_TYPE,
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=getGoodLifeResponse",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })
public class GoodLifeAPIsServlet extends SlingAllMethodsServlet {

	/**
	 * Generated serialVersionUID
	 */
	private static final long serialVersionUID = 4438376868274173005L;

	private static final Logger log = LoggerFactory.getLogger(GoodLifeAPIsServlet.class);

	@Reference
	transient HeroAPIEndPointsConfigurations apiEndpointConfigurations;

	@Reference
	transient APIConfigurations apiConfigurations;

	transient StaticWrapper httpGetWrapper = new StaticWrapper();
	
	transient AesCryptUtil aesUtil;

	
	

	/**
	 * Logger
	 */

	@Override
	protected void doPost(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
			throws ServletException, IOException {

		try {
			JsonObject input = httpGetWrapper
					.getJsonFromString(IOUtils.toString(req.getInputStream(), StandardCharsets.UTF_8));

			String apiName = input.get("apiName").getAsString();

			String request = input.get("requestBody").getAsString();
			
			String pid = input.has("processID") ? input.get("processID").getAsString() : "32";

			String randomKey = GoodlifeUtils.generateRandomKey(12);

			String encryptedReq = GoodlifeUtils.getEncrptedRequest(request, randomKey);

			String encryptedAesKey;
			encryptedAesKey = GoodlifeUtils.getEncrptedAesKey(randomKey, apiConfigurations);
			String response = makeAPICall(encryptedReq, encryptedAesKey, req.getHeader("Authorization"), apiName,
					apiEndpointConfigurations, httpGetWrapper, pid);
			
			if(apiName.equals("RideDetail")) {
				JsonObject output =  httpGetWrapper
						.getJsonFromString(response);
				JsonObject asJsonObject = output.getAsJsonArray("PWSESSIONRS").get(0).getAsJsonObject().get("PWPROCESSRS").getAsJsonObject().get("PWDATA").getAsJsonObject().get("GOODLIFE_API").getAsJsonObject().get("Data").getAsJsonObject().get("Table").getAsJsonArray().get(0).getAsJsonObject();
				aesUtil = new AesCryptUtil(apiConfigurations.getConfigProperty("ccAvenueWorkingKey"));
				output.addProperty("encodedxclanFees", aesUtil.encrypt(asJsonObject.get("XclanFee").toString()));
				output.addProperty("encodednonxclanFees", aesUtil.encrypt(asJsonObject.get("NonXclanFee").toString()));
				resp.getWriter().write(output.toString());
			}else {
				resp.getWriter().write(response.toString());
			}

		} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException
				| BadPaddingException | InvalidKeySpecException e) {
			log.error("Exception Occured---", e);
		}

	}

	public static String makeAPICall(String encryptedReq, String encryptedAesKey, String token, String apiName,
			HeroAPIEndPointsConfigurations apiConfigurations2, StaticWrapper httpGetWrapper2, String pid)
			throws ParseException, IOException {

		CloseableHttpClient httpClient = httpGetWrapper2.createDefaultGoodLifeHttpClient();
		try {
			HttpPost httpPost = new HttpPost(apiConfigurations2.getConfigProperty("middleWareAPI").toString());

			String finalReq = mapRequestBodywithJSON(encryptedReq, encryptedAesKey, apiName, pid);
			log.debug("Request Sent--"+finalReq);
			StringEntity entity = new StringEntity(finalReq);
			httpPost.setEntity(entity);
			httpPost.setHeader("Content-type", "application/x-www-form-urlencoded");
			httpPost.setHeader("Authorization", token);
			CloseableHttpResponse response = httpClient.execute(httpPost);

			String jsonVal = EntityUtils.toString(response.getEntity());
			return jsonVal;
		} finally {
			httpClient.close();
		}
	}

	private static String mapRequestBodywithJSON(String encryptedReq, String encryptedAesKey, String apiName, String pid) {

		Map<String, String> requestMap = new HashMap<String, String>();
		requestMap.put("enc_request", encryptedReq);
		requestMap.put("api_name", apiName);
		requestMap.put("enc_key", encryptedAesKey);
		requestMap.put("pid", pid);

		StringSubstitutor sub = new StringSubstitutor(requestMap);
		String finalReq = sub.replace(HeroConstants.GOODLIFE_CONSTANT);
		return finalReq;
	}

}