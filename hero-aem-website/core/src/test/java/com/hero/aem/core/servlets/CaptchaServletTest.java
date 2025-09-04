package com.hero.aem.core.servlets;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.servlethelpers.MockSlingHttpServletRequest;
import org.apache.sling.servlethelpers.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import java.io.IOException;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
public class CaptchaServletTest {

    @InjectMocks
    CaptchaServlet captchaServlet;
    @Test
    void testDoPostSlingHttpServletRequestSlingHttpServletResponse(AemContext aemContext) throws IOException {
    	MockitoAnnotations.openMocks(this);
    	MockSlingHttpServletRequest request = aemContext.request();
        MockSlingHttpServletResponse response = aemContext.response();
        request.addRequestParameter("reqID", "request-id");
        captchaServlet.doPost(request, response);
        assertEquals("MDYxOT", Base64.getEncoder().encodeToString(String.format("%06d", Math.abs((request.getParameter("reqID")).hashCode()) % 1000000).getBytes()).substring(0,6));
    }
}
