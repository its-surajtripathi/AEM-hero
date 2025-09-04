package com.hero.aem.core.models;

import static org.junit.jupiter.api.Assertions.*;

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
class RemoveUnwrapClassesTest {

    @InjectMocks
    RemoveUnwrapClasses removeUnwrapClasses;

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
        removeUnwrapClasses.initModel();
    }

}
