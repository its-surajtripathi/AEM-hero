package com.hero.aem.core.servlets;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.URISyntaxException;

import javax.servlet.ServletException;

import org.apache.http.HttpEntity;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.apache.sling.servlethelpers.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.google.gson.JsonObject;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.AesCryptUtil;
import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class InitiatePaymentServletTest {

	@InjectMocks
	InitiatePaymentServlet initiatePaymentServlet;

	@Mock
	APIConfigurations apiConfigurations;

	@Mock
	CloseableHttpClient httpClient;

	@Mock
	HttpPost httpPost;

	@Mock
	CloseableHttpResponse clientResponse;

	@Mock
	StaticWrapper httpGetWrapper;

	@Mock
	AesCryptUtil aesUtil;

	@Mock
	StatusLine statusLine;

	@BeforeEach
	void init() throws IOException {
		MockitoAnnotations.openMocks(this);

	}

	@Test
	void testDoPostPayment(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
		MockSlingHttpServletRequest request = aemContext.request();
		MockSlingHttpServletResponse response = aemContext.response();
		aemContext.requestPathInfo().setResourcePath("/content/aem/hero");
		aemContext.requestPathInfo().setSelectorString("getPaymentUrl");

		request.addRequestParameter("merchant_id", "8903458657");
		JsonObject jobj = new JsonObject();
		jobj.addProperty("orderID", "GL438");
		jobj.addProperty("amount", "2000");

		when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
		when(apiConfigurations.getConfigProperty("ccAvenueWorkingKey"))
				.thenReturn("akjhsdbajs bcjahbsj a sjhdbajhsbdjhabsd");
		when(apiConfigurations.getConfigProperty("ccAvenueMerchantID")).thenReturn("2342342342");
		//initiatePaymentServlet.doPost(request, response);
	}

	@Test
	void testDoPostData(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
		MockSlingHttpServletRequest request = aemContext.request();
		MockSlingHttpServletResponse response = aemContext.response();
		aemContext.requestPathInfo().setResourcePath("/content/aem/hero");
		aemContext.requestPathInfo().setSelectorString("postPaymentData");
		request.addRequestParameter("encResp", "abacasdasdasdasdasd");
		request.addRequestParameter("orderNo", "GL438");
		request.addRequestParameter("crossSellUrl", "abcd");

		when(aesUtil.decrypt("abacasdasdasdasdasd")).thenReturn("asdefghjklpoiorder_status=Success&merchantid=asdasd");
		when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
		when(httpGetWrapper.getHttpPost("http://localhost:4502")).thenReturn(httpPost);
		when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
		HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
		when(clientResponse.getEntity()).thenReturn(httpEntity);
		when(clientResponse.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(200);
		when(apiConfigurations.getConfigProperty("getAPIForPostingTransaction"))
				.thenReturn("http://localhost:4502/api");
		when(apiConfigurations.getConfigProperty("thankYouPagePath")).thenReturn("http://localhost:4502/thankyou.html");
		initiatePaymentServlet.doPost(request, response);
	}

	@Test
	void testDoPostDataFail(AemContext aemContext) throws ServletException, IOException, URISyntaxException {
		MockSlingHttpServletRequest request = aemContext.request();
		MockSlingHttpServletResponse response = aemContext.response();
		aemContext.requestPathInfo().setResourcePath("/content/aem/hero");
		aemContext.requestPathInfo().setSelectorString("postPaymentData");
		request.addRequestParameter("encResp", "abacasdasdasdasdasd");
		request.addRequestParameter("orderNo", "GL438");
		request.addRequestParameter("crossSellUrl", "abcd");

		when(aesUtil.decrypt("abacasdasdasdasdasd")).thenReturn("asdefghjklpoiorder_status=Success&merchantid=asdasd");
		when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
		when(httpGetWrapper.getHttpPost("http://localhost:4502")).thenReturn(httpPost);
		when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
		HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
		when(clientResponse.getEntity()).thenReturn(httpEntity);
		when(clientResponse.getStatusLine()).thenReturn(statusLine);
		when(statusLine.getStatusCode()).thenReturn(404);
		when(apiConfigurations.getConfigProperty("getAPIForPostingTransaction"))
				.thenReturn("http://localhost:4502/api");
		when(apiConfigurations.getConfigProperty("sorryPagePath")).thenReturn("http://localhost:4502/thankyou.html");
		initiatePaymentServlet.doPost(request, response);
	}

	@Test
	void testDoPostDataSkip(AemContext aemContext) throws ServletException, IOException, URISyntaxException {

		MockSlingHttpServletRequest request = aemContext.request();
		MockSlingHttpServletResponse response = aemContext.response();
		aemContext.requestPathInfo().setResourcePath("/content/aem/hero");
		aemContext.requestPathInfo().setSelectorString("postPaymentData");
		when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);

		request.addRequestParameter("encResp", "abacasdasdasdasdasd");
		request.addRequestParameter("orderNo", "GL438");
		request.addRequestParameter("crossSellUrl", "abcd");
		when(aesUtil.decrypt("abacasdasdasdasdasd")).thenReturn("asdefghjklpoiorder_status=Failed&merchantid=asdasd");
		when(apiConfigurations.getConfigProperty("sorryPagePath")).thenReturn("http://localhost:4502/thankyou.html");
		initiatePaymentServlet.doPost(request, response);

	}
}
