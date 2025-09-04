package com.hero.aem.core.services.impl;

import com.day.cq.commons.mail.MailTemplate;
import com.day.cq.mailer.MessageGateway;
import com.day.cq.mailer.MessageGatewayService;
import com.google.gson.JsonObject;
import com.hero.aem.core.constants.HeroConstants;
import com.hero.aem.core.services.MessagingService;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;
import com.hero.aem.core.util.StaticWrapper;
import org.apache.commons.lang.text.StrLookup;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.mail.MessagingException;
import javax.mail.util.ByteArrayDataSource;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;

import static com.day.crx.JcrConstants.JCR_DATA;
import static com.day.cq.commons.jcr.JcrConstants.JCR_CONTENT;

@Component(service = MessagingService.class, immediate = true)
@ServiceDescription("Messaging Service for SMS and Email")
public class MessagingServiceImpl implements MessagingService {

    @Reference
    transient MessageGatewayService messageGatewayService;

    @Reference
    transient APIConfigurations apiConfigurations;

    transient StaticWrapper httpGetWrapper = new StaticWrapper();

    private static final Logger log = LoggerFactory.getLogger(MessagingService.class);

    @Override
    @SuppressWarnings("Deprecation: Suppress warning as this StrLookup is being used in OOTB adobe code")
    public void sendMail(ResourceResolver resolver, Map emailParams, String receipent, String emailTemplate, String subject) {
        try{
            Node templateNode = resolver.getResource(emailTemplate).adaptTo(Node.class);
            final MailTemplate mailTemplate = MailTemplate.create(emailTemplate, templateNode.getSession());
            HtmlEmail email = mailTemplate.getEmail(StrLookup.mapLookup(emailParams), HtmlEmail.class);
            email.setSubject(subject);
            email.addTo(receipent);
            MessageGateway<HtmlEmail> messageGateway = messageGatewayService.getGateway(HtmlEmail.class);
            messageGateway.send(email);
        } catch (MessagingException e) {
            log.error("Messaging Exception", e);
        } catch (EmailException e) {
            log.error("EmailException", e);
        } catch (RepositoryException e) {
            log.error("RepositoryException", e);
        } catch (IOException e) {
            log.error("IOException", e);
        }
    }

    @Override
    @SuppressWarnings("Deprecation: Suppress warning as this StrLookup is being used in OOTB adobe code")
    public void sendMailWithAttachments(ResourceResolver resolver, Map emailParams, String receipent, String emailTemplate, String subject, String resourcePath) {
        try{
            Node templateNode = resolver.getResource(emailTemplate).adaptTo(Node.class);
            final MailTemplate mailTemplate = MailTemplate.create(emailTemplate, templateNode.getSession());
            HtmlEmail email = mailTemplate.getEmail(StrLookup.mapLookup(emailParams), HtmlEmail.class);
            email.setSubject(subject);
            email.addTo(receipent);
            Resource csvResource = resolver.getResource(resourcePath);
            if (csvResource != null) {
                Resource resourceOriginal = resolver.getResource(resourcePath+"/jcr:content/renditions/original");
                ByteArrayDataSource imageDS = getByteArrayDataSource(resourceOriginal);
                if (imageDS != null) {
                    email.attach(imageDS, csvResource.getName(), StringUtils.EMPTY);
                }
            }
            MessageGateway<HtmlEmail> messageGateway = messageGatewayService.getGateway(HtmlEmail.class);
            messageGateway.send(email);
        } catch (MessagingException e) {
            log.error("Messaging Exception", e);
        } catch (EmailException e) {
            log.error("EmailException", e);
        } catch (RepositoryException e) {
            log.error("RepositoryException", e);
        } catch (IOException e) {
            log.error("IOException", e);
        }
    }

    @Override
    public String sendSMS(String phoneNum,String msgText, String templateID) throws IOException {
        String apiUrl = apiConfigurations.getConfigProperty("sendNEWSMSAPI");
        HttpGet httpGet = httpGetWrapper.getHttpGet(apiUrl);
        CloseableHttpClient httpClient = httpGetWrapper.createDefaultHttpClient();
        try {
            URI uri = new URIBuilder(httpGet.getURI())
                    .addParameter("user", apiConfigurations.getConfigProperty("sendSMSAPIUser"))
                    .addParameter("authkey", apiConfigurations.getConfigProperty("sendSMSAPIKey"))
                    .addParameter("mobile", phoneNum)
                    .addParameter("sender", apiConfigurations.getConfigProperty(HeroConstants.OSGI_SENDSMSAPIFROMNAME))
                    .addParameter("text", msgText)
                    .addParameter("templateid", templateID).build();
            ((HttpRequestBase) httpGet).setURI(uri);
            CloseableHttpResponse smsAPIResponse = httpClient.execute(httpGet);
            JsonObject output = new JsonObject();
            output.addProperty("New smsResult", EntityUtils.toString(smsAPIResponse.getEntity()));
            log.info("New smsResult {}", output);
            return output.toString();
        } catch (URISyntaxException | IOException e) {
            log.error("....New SMS Service failed ......", e);
        } finally {
            httpClient.close();
        }
        return null;
    }

    private ByteArrayDataSource getByteArrayDataSource(Resource resourceOriginal) throws RepositoryException, IOException {
        if (resourceOriginal != null) {
            Node csvNode = resourceOriginal.adaptTo(Node.class);
            if (csvNode != null) {
                Node contentNode = csvNode.getNode(JCR_CONTENT);
                if (contentNode.hasProperty(JCR_DATA)) {
                    Binary imageBinary = contentNode.getProperty(JCR_DATA).getBinary();
                    InputStream imageStream = imageBinary.getStream();
                    return new ByteArrayDataSource(imageStream, "application/pdf");
                }
            }
        }
        return null;
    }

}
