package com.hero.aem.core.servlets;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.ServletException;

import com.day.cq.dam.api.Asset;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import com.google.gson.JsonObject;
import com.hero.aem.core.util.StaticWrapper;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class MediaServletTest {
    @InjectMocks
    MediaServlet mediaServlet;

    @Mock
    SlingHttpServletRequest request;

    @Mock
    SlingHttpServletResponse response;

    @Mock
    ResourceResolver resourceResolver;

    @Mock
    CloseableHttpClient httpClient;

    @Mock
    HttpPost httpPost;

    @Mock
    Resource resource;

    @Mock
    Asset asset;

    @Mock
    CloseableHttpResponse clientResponse;

    @Mock
    StaticWrapper httpGetWrapper;

    JsonObject jobj = new JsonObject();

    @Mock
    Query query;

    @Mock
    Session session;

    @Mock
    QueryBuilder queryBuilder;

    @Mock
    SearchResult result;

    @Mock
    Resource imageResource;

    @Mock
    ValueMap valueMap;

    @Mock
    PrintWriter out;

    private static final String JCR_CONTENT_METADATA = "/jcr:content/metadata";

    @BeforeEach
    void init() throws IOException {
        MockitoAnnotations.openMocks(this);
        when(httpGetWrapper.getHttpPost("http://localhost:4502")).thenReturn(httpPost);
        when(httpGetWrapper.createDefaultHttpClient()).thenReturn(httpClient);
        jobj.addProperty("test", "test");
    }
    private Hit mockHit(String path) throws RepositoryException {
        Hit hit = mock(Hit.class);
        when(hit.getPath()).thenReturn(path);
        when(hit.getResource()).thenReturn(resource);
        when(resource.adaptTo(Asset.class)).thenReturn(asset);
        when(asset.getPath()).thenReturn("/content");
        return hit;
    }

    @Test
//    @Disabled
    void testDoGet(AemContext aemContext)
            throws ServletException, IOException, RepositoryException {
        when(httpClient.execute(any(HttpPost.class))).thenReturn(clientResponse);
        HttpEntity httpEntity = new StringEntity("{\"success\":\"200\"}", "utf-8");
        when(clientResponse.getEntity()).thenReturn(httpEntity);
        when(httpGetWrapper.getJsonFromString(Mockito.anyString())).thenReturn(jobj);
        when(request.getParameter("mediatype")).thenReturn("inthepress");
        when(request.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(Session.class)).thenReturn(session);
        when(queryBuilder.createQuery(Mockito.any(PredicateGroup.class), Mockito.any(Session.class)))
                .thenReturn(query);
        when(query.getResult()).thenReturn(result);
        List<Hit> hits=new ArrayList<>();
        hits.add(mockHit("/content/page1"));
        when(result.getHits()).thenReturn(hits);
        when(imageResource.getValueMap()).thenReturn(valueMap);
        when(resourceResolver.getResource("/content/tests/abc"+JCR_CONTENT_METADATA)).thenReturn(imageResource);
        when(asset.getPath()).thenReturn("/content/tests/abc");
        when(response.getWriter()).thenReturn(out);
        mediaServlet.doGet(request,response);
    }
}