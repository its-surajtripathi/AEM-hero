package com.hero.aem.core.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicRequestLine;
import org.apache.http.params.BasicHttpParams;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class StaticWrapperTest {

    /**
     * Method under test: {@link StaticWrapper#getHttpGet(String)}
     */
    @Test
    void testGetHttpGet() {
        HttpGet actualHttpGet = (new StaticWrapper()).getHttpGet("https://example.org/example");
        assertEquals(0, actualHttpGet.getAllHeaders().length);
        assertFalse(actualHttpGet.isAborted());
        assertTrue(actualHttpGet.getRequestLine() instanceof BasicRequestLine);
        assertTrue(actualHttpGet.getParams() instanceof BasicHttpParams);
    }

    @Test
    void testGetHttpPost() {
        HttpPost actualHttpPost = (new StaticWrapper()).getHttpPost("https://example.org/example");
        assertEquals(0, actualHttpPost.getAllHeaders().length);
        assertFalse(actualHttpPost.isAborted());
        assertTrue(actualHttpPost.getRequestLine() instanceof BasicRequestLine);
        assertTrue(actualHttpPost.getParams() instanceof BasicHttpParams);
    }

    /**
     * Method under test: {@link StaticWrapper#createValidName(String)}
     */
    @Test
    void testCreateValidName() {
        assertEquals("name", (new StaticWrapper()).createValidName("Name"));
        assertEquals("", (new StaticWrapper()).createValidName(""));
    }
}

