package com.hero.aem.core.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.text.StringSubstitutor;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.hero.aem.core.services.osgiconfigs.HeroAPIEndPointsConfigurations;

public class BookServiceUtils {

	private static final Logger log = LoggerFactory.getLogger(BookServiceUtils.class);

	/**
	 * Method to make calls which is needed to make job card creation call
	 * 
	 * @param input
	 * 
	 * @return Base64 encoded JSON request for API call
	 * @throws IOException
	 */
	public static String wsCallSoapApi(String soapEnvelopeFileName, JsonObject input) throws IOException {
		return generateSoapEnvelope(soapEnvelopeFileName, input);
	}

	/**
	 * Method to create a soap envelop with json data which needs to be replaced
	 * with keys
	 * 
	 * @param input
	 * 
	 * @return
	 * @throws IOException
	 */
	private static String generateSoapEnvelope(String soapEnvelopeFileName, JsonObject input) throws IOException {
		/** Call if JSON Data needs to be loaded from file on disk */
		// String jsonData = loadJSONData();
		/**
		 * Call if JSON Data fetched from loadJSONData() method needs to be converted in
		 * map
		 */
		// Map<String, String> jsonDataMap = loadJSONToMap(jsonData);
		Gson gson = new Gson();
		@SuppressWarnings("unchecked")
		Map<String, String> jsonDataMap = gson.fromJson(input, Map.class);
		/** Call to load raw XML template and converting to String */
		String soapXMLString = loadSoapEnvelopeTemplate(soapEnvelopeFileName);
		/**
		 * Call to replace keys in loaded file from loadSoapEnvelopeTemplate() with map
		 * values
		 */
		String base64XMLString = mapJSonDataToSoapXML(soapXMLString, jsonDataMap);

		return base64XMLString;
	}

	/**
	 * Method to load SOAP template from disk
	 * 
	 * @return
	 * @throws IOException
	 */
	public static String loadSoapEnvelopeTemplate(String soapEnvelopeFileName) throws IOException {
		InputStream inputStream = null;
		inputStream = BookServiceUtils.class.getResourceAsStream(soapEnvelopeFileName);
		InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
		BufferedReader br = new BufferedReader(streamReader);
		String line;
		StringBuilder sb = new StringBuilder();

		while ((line = br.readLine()) != null) {
			sb.append(line.trim());
		}
		br.close();
		return sb.toString();
	}

	/**
	 * Method to patch json-map data in soap template
	 * 
	 * @param soapXMLString
	 * @param map
	 * @return
	 */
	private static String mapJSonDataToSoapXML(String soapXMLString, Map<String, String> map) {
		if (map == null) {
			return convertToBase64(soapXMLString);
		}
		StringSubstitutor sub = new StringSubstitutor(map);
		String result = sub.replace(soapXMLString.toString());
		return convertToBase64(result);
	}

	/**
	 * Method to Map final JSON API request with data which needs to be replaced
	 * according to placeholder
	 * 
	 * @param requestMap Map with key-value pair to replace placeholder in request
	 *                   json
	 * @return Final json ready to be send for API call
	 * @throws IOException
	 * 
	 */
	public static String wsCallloadRequestJSON(Map<String, String> requestMap, String fileName) throws IOException {
		InputStream inputStream = null;
		inputStream = BookServiceUtils.class.getResourceAsStream(fileName);

		InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
		BufferedReader br = new BufferedReader(streamReader);
		String line;
		StringBuilder sb = new StringBuilder();

		while ((line = br.readLine()) != null) {
			sb.append(line.trim());
		}
		StringSubstitutor sub = new StringSubstitutor(requestMap);
		String result = sub.replace(sb.toString());

		br.close();
		return result;

	}

	/**
	 * Method which makes API call
	 * 
	 * @param jsonRequest JSON request with replaced keys with base64 values
	 * @param token       access token
	 * @param apiConfigurations 
	 * @return Returns Status of the job card service number creation
	 * @throws ClientProtocolException
	 * @throws IOException
	 */
	public static String makeAPICall(String jsonRequest, String token, StaticWrapper httpGetWrapper, HeroAPIEndPointsConfigurations apiConfigurations)
			throws ClientProtocolException, IOException {
		CloseableHttpClient client = httpGetWrapper.createDefaultHttpClient();
		try {

			HttpPost httpPost = new HttpPost(apiConfigurations.getConfigProperty("middleWareAPI").toString());
			StringEntity entity = new StringEntity(jsonRequest);
			httpPost.setEntity(entity);
			httpPost.setHeader("Accept", "application/json");
			httpPost.setHeader("Content-type", "application/json");
			httpPost.setHeader("Authorization", token);
			CloseableHttpResponse response = client.execute(httpPost);
			String jsonVal = EntityUtils.toString(response.getEntity());
			log.debug("response from API ----" + jsonVal);
			return jsonVal;
		} finally {
			client.close();
		}

	}
	
	public static String convertToBase64(String xmlValue) {
		byte[] bytesEncoded = Base64.encodeBase64(xmlValue.getBytes());
		return new String(bytesEncoded);
	}

	public static String revertToString(String byteValue) {
		byte[] bytesDecoded = Base64.decodeBase64(byteValue);
		return new String(bytesDecoded);
	}

	public static String getJobCardNumber(SlingHttpServletRequest request, StaticWrapper httpGetWrapper,
			ObjectMapper objectMapper, JsonObject input, HeroAPIEndPointsConfigurations apiConfigurations) throws IOException {
		String loadWSSoapCall = BookServiceUtils.wsCallSoapApi("WSCALLSoap.xml", input);
		log.debug("Request call sent to WSCALL API ----" + revertToString(loadWSSoapCall));
		String loadSoapContentTypeXML = BookServiceUtils.loadSoapEnvelopeTemplate("WSCALLSoapContentTypeApi.xml");
		Map<String, String> requestMap = new HashMap<String, String>();
		requestMap.put("wscall_soap_request", loadWSSoapCall);
		requestMap.put("wscall_soap_content_type", convertToBase64(loadSoapContentTypeXML));
		String finalJsonRequest = BookServiceUtils.wsCallloadRequestJSON(requestMap, "WSCALLRequestJson.json");
		log.debug("Request call sent to WSCALL API ----" + finalJsonRequest);

		String jobCardNumber = BookServiceUtils.makeAPICall(finalJsonRequest, request.getHeader("Authorization"),
				httpGetWrapper, apiConfigurations);
		JsonNode nodeTree = objectMapper.readTree(jobCardNumber);
		JsonNode jsonNode = nodeTree
		.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWDATA").get("WSCALL").get("SOAP-ENV:Envelope")
		.get("SOAP-ENV:Body").get("ns:ServiceBooking_Output");
		if (nodeTree.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWERROR").asText().isEmpty()
				&& !jsonNode.get("ns:Seq_spcNum").toPrettyString().equals("")) {
			return nodeTree.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWDATA").get("WSCALL")
					.get("SOAP-ENV:Envelope").get("SOAP-ENV:Body").get("ns:ServiceBooking_Output").get("ns:Seq_spcNum")
					.asText();
		} else {
			return null;
		}

	}

	public static String getSRID(SlingHttpServletRequest request, StaticWrapper httpGetWrapper,
			ObjectMapper objectMapper, String jobCardNumber, HeroAPIEndPointsConfigurations apiConfigurations) throws IOException {
		String requestJson = BookServiceUtils.loadSoapEnvelopeTemplate("SRIDJsonRequest.json");
		Map<String, String> jsonDataMap = new HashMap<String, String>();
		jsonDataMap.put("job_card_number", jobCardNumber);
		StringSubstitutor sub = new StringSubstitutor(jsonDataMap);
		String result = sub.replace(requestJson.toString());
		log.debug("Request call sent to getSRID API ----" + result);
		String getSRID = BookServiceUtils.makeAPICall(result, request.getHeader("Authorization"), httpGetWrapper, apiConfigurations);
		JsonNode nodeTree = objectMapper.readTree(getSRID);
		if (nodeTree.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWERROR").asText().isEmpty()
				&& !nodeTree.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWDATA").get("oa_getSRID").get("Row")
						.get(0).get("SR_ID").toPrettyString().equals("")) {
			return nodeTree.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWDATA").get("oa_getSRID").get("Row")
					.get(0).get("SR_ID").asText();
		} else {
			return null;
		}
	}

	public static String getBookingStatus(final SlingHttpServletRequest request, JsonObject input, ObjectMapper objectMapper, StaticWrapper httpGetWrapper, HeroAPIEndPointsConfigurations apiConfigurations)
			throws IOException, ClientProtocolException, JsonProcessingException, JsonMappingException {
		JsonNode nodeTree;
		String loadJobCardSoapXML = BookServiceUtils.wsCallSoapApi("JobCardSoap.xml", input);
		String loadJobCardContentXML = BookServiceUtils.loadSoapEnvelopeTemplate("JobCardSoapContentType.xml");
		Map<String, String> requestMap = new HashMap<String, String>();
		requestMap.put("jobcard_soap_request", loadJobCardSoapXML);
		requestMap.put("jobcard_soap_content_type", convertToBase64(loadJobCardContentXML));

		String finalJsonRequest = BookServiceUtils.wsCallloadRequestJSON(requestMap, "JobCardRequestJson.json");
		log.debug("Request call sent to WS JOB card API ----" + finalJsonRequest);
		String getJobCardStatus = BookServiceUtils.makeAPICall(finalJsonRequest, request.getHeader("Authorization"),
				httpGetWrapper, apiConfigurations);
		nodeTree = objectMapper.readTree(getJobCardStatus);
		
		if (nodeTree.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWERROR").asText().isEmpty() && !nodeTree
				.get("PWSESSIONRS").get(0).get("PWPROCESSRS").get("PWDATA").get("WSCALL").get("SOAP-ENV:Envelope")
				.get("SOAP-ENV:Body").get("ns:HMCL_spcJob_spcCard_spcProcess_spcfrom_spcCustomer_Output")
				.get("ns:SRStatus").toPrettyString().equals("")) {
			
			return getJobCardStatus;
		} else {
			return null;
		}
	}

	public static String submitFeedback(SlingHttpServletRequest request, StaticWrapper httpGetWrapper,
			ObjectMapper objectMapper, JsonObject input) throws IOException {
		String encodedFeedbackData = BookServiceUtils.wsCallSoapApi("WSCALLFeedback.xml", input);
		log.debug("encoded String "+revertToString(encodedFeedbackData));
		return encodedFeedbackData;

	}
}
