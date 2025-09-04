package com.hero.aem.core.models;

import java.io.IOException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class UnwrapWrapperClassesTest {

    @InjectMocks
    UnwrapWrapperClasses unwrapWrapperClasses;

    @Mock
    SlingHttpServletRequest request;

    public final AemContext context = new AemContext();

    @BeforeEach
    void init() throws IOException {
        this.request = context.request();
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testInitModel() {
        unwrapWrapperClasses.initModel();
    }

}
