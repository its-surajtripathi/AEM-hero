package com.hero.aem.core.util;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;

import com.adobe.xfa.ut.StringUtils;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.commons.jcr.JcrUtil;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

public class StaticWrapper {

    public static final StaticWrapper SINGLETON = new StaticWrapper();

    public Node createPath(String path, Session session) throws RepositoryException {
        return JcrUtil.createPath(path, JcrResourceConstants.NT_SLING_ORDERED_FOLDER ,JcrConstants.NT_UNSTRUCTURED, session, false);
    }

    public HttpGet getHttpGet(String path) {
        return new HttpGet(path);
    }

    public HttpPost getHttpPost(String path) {
        return new HttpPost(path);
    }

    public CloseableHttpClient createDefaultHttpClient() {
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(10000)
                .setSocketTimeout(10000)
                .build();
        return HttpClientBuilder.create().setDefaultRequestConfig(requestConfig).useSystemProperties().build();
    }
    
    public CloseableHttpClient createDefaultGoodLifeHttpClient() {
        RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(30000)
                .setSocketTimeout(30000)
                .build();
        return HttpClientBuilder.create().setDefaultRequestConfig(requestConfig).useSystemProperties().build();
    }

    public JsonObject getJsonFromString(String jsonString) throws JsonSyntaxException {
        return new Gson().fromJson(jsonString, JsonObject.class);
    }

    public String createValidName(String name) {
        return JcrUtil.createValidName(StringUtils.trim(name));
    }
}
