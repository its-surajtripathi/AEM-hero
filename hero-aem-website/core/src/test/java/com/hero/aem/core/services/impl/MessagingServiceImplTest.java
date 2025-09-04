package com.hero.aem.core.services.impl;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.day.cq.wcm.foundation.model.responsivegrid.ResponsiveGrid;

import java.util.HashMap;

import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.wrappers.ResourceResolverWrapper;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class MessagingServiceImplTest {

    @Test
    @Disabled("TODO: Complete this test")
    void testSendMail() {
        MessagingServiceImpl messagingServiceImpl = new MessagingServiceImpl();
        ResourceResolverWrapper resolver = new ResourceResolverWrapper(new ResourceResolverWrapper(
                new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(null)))));
        messagingServiceImpl.sendMail(resolver, new HashMap<>(), "Receipent", "jane.doe@example.org",
                "Hello from the Dreaming Spires");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendMail2() {
        MessagingServiceImpl messagingServiceImpl = new MessagingServiceImpl();
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolver.getResource((String) any())).thenReturn(new ResponsiveGrid());
        ResourceResolverWrapper resolver = new ResourceResolverWrapper(
                new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                        new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                                new ResourceResolverWrapper(new ResourceResolverWrapper(resourceResolver))))))))));
        messagingServiceImpl.sendMail(resolver, new HashMap<>(), "Receipent", "jane.doe@example.org",
                "Hello from the Dreaming Spires");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendMail3() {
        MessagingServiceImpl messagingServiceImpl = new MessagingServiceImpl();
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolver.getResource((String) any())).thenReturn(null);
        ResourceResolverWrapper resolver = new ResourceResolverWrapper(
                new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                        new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                                new ResourceResolverWrapper(new ResourceResolverWrapper(resourceResolver))))))))));
        messagingServiceImpl.sendMail(resolver, new HashMap<>(), "Receipent", "jane.doe@example.org",
                "Hello from the Dreaming Spires");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendMailWithAttachments() {
        MessagingServiceImpl messagingServiceImpl = new MessagingServiceImpl();
        ResourceResolverWrapper resolver = new ResourceResolverWrapper(new ResourceResolverWrapper(
                new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(null)))));
        messagingServiceImpl.sendMailWithAttachments(resolver, new HashMap<>(), "Receipent", "jane.doe@example.org",
                "Hello from the Dreaming Spires", "Resource Path");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendMailWithAttachments2() {
        MessagingServiceImpl messagingServiceImpl = new MessagingServiceImpl();
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolver.getResource((String) any())).thenReturn(new ResponsiveGrid());
        ResourceResolverWrapper resolver = new ResourceResolverWrapper(
                new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                        new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                                new ResourceResolverWrapper(new ResourceResolverWrapper(resourceResolver))))))))));
        messagingServiceImpl.sendMailWithAttachments(resolver, new HashMap<>(), "Receipent", "jane.doe@example.org",
                "Hello from the Dreaming Spires", "Resource Path");
    }

    @Test
    @Disabled("TODO: Complete this test")
    void testSendMailWithAttachments3() {
        MessagingServiceImpl messagingServiceImpl = new MessagingServiceImpl();
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        when(resourceResolver.getResource((String) any())).thenReturn(null);
        ResourceResolverWrapper resolver = new ResourceResolverWrapper(
                new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                        new ResourceResolverWrapper(new ResourceResolverWrapper(new ResourceResolverWrapper(
                                new ResourceResolverWrapper(new ResourceResolverWrapper(resourceResolver))))))))));
        messagingServiceImpl.sendMailWithAttachments(resolver, new HashMap<>(), "Receipent", "jane.doe@example.org",
                "Hello from the Dreaming Spires", "Resource Path");
    }
}

