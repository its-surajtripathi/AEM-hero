package com.hero.aem.core.services;

import org.apache.sling.api.resource.ResourceResolver;

import java.io.IOException;
import java.util.Map;

public interface MessagingService {
    void sendMail(ResourceResolver resolver, Map emailParams,String receipt,String emailTemplate,String subject);
    void sendMailWithAttachments(ResourceResolver resolver, Map emailParams,String receipt,String emailTemplate,String subject,String path);
    String sendSMS(String phoneNum,String msgText, String templateID) throws IOException;
}
