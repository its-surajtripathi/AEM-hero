package com.hero.aem.core.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class StateCityModelTest {

    AemContext context = new AemContext();
    MockSlingHttpServletRequest request = context.request();
    ResourceResolver resResolver = context.resourceResolver();
    Resource res = mock(Resource.class);
    StateCityModel model;

    @BeforeEach
    void setup() {
        model = new StateCityModel();
    }

    @Test
    void testGetStatesList() {
        assertEquals(new ArrayList<String>(), model.getStatesList());
    }

    @Test
    void testGetStateCityMap() {
        assertEquals(new HashMap<String, ArrayList<String>>(), model.getStateCityMap());
    }

    @Test
    void testInit() {
        assertEquals(new HashMap<String, ArrayList<String>>(), model.getStateCityMap());
        assertEquals(new ArrayList<String>(), model.getStatesList());
    }
}
