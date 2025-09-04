package com.hero.aem.core.services.osgiconfigs;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Hero Configurations OSGI Service")
public @interface APIConfiguration {

    @AttributeDefinition(name = "AEM Proxy", description = "This is set automatically by AEM in CS setup", type = AttributeType.STRING)
    String aemProxyHost();

    @AttributeDefinition(name = "Send SMS API URL", description = "Provide API URL for SMS Service", type = AttributeType.STRING)
    String sendSMSAPI();

    @AttributeDefinition(name = "Send SMS API Username", description = "API Username for SMS service", type = AttributeType.STRING)
    String sendSMSAPIUsername();

    @AttributeDefinition(name = "Send SMS API Password", description = "API Password for SMS service", type = AttributeType.STRING)
    String sendSMSAPIPassword();

    @AttributeDefinition(name = "Send SMS API From attribute", description = "From name of text message", type = AttributeType.STRING)
    String sendSMSAPIFromName();

    @AttributeDefinition(name = "Send SMS API Template ID for Homepage", description = "Template ID number for Homepage", type = AttributeType.STRING)
    String sendSMSAPITemplateIDHome();

    @AttributeDefinition(name = "Send SMS API Message format for Homepage", description = "Text message format for Homepage", type = AttributeType.STRING)
    String sendSMSAPIMsgHome();

    // Sample Value: {"apiUrl":"https://sample/url?q=v","Authorization":"Basic
    // XXXX","templateId":"12345", "templateMsg":"Sample Message"}
    @AttributeDefinition(name = "Details of ACAA", description = "Details", type = AttributeType.STRING)
    String configAcaa();

    @AttributeDefinition(name = "Send SMS API Template ID for ACAA", description = "Template ID number for ACAA brand", type = AttributeType.STRING)
    String sendSMSAPITemplateIDAcaa();

    @AttributeDefinition(name = "Send SMS API Message format for ACAA", description = "Text message format for ACAA brand", type = AttributeType.STRING)
    String sendSMSAPIMsgPremiaAcaa();

    @AttributeDefinition(name = "Send SMS API Template ID for Harley", description = "Template ID number for Harley brand", type = AttributeType.STRING)
    String sendSMSAPITemplateIDHarley();

    @AttributeDefinition(name = "Send SMS API Message format for Harley", description = "Text message format for Harley brand", type = AttributeType.STRING)
    String sendSMSAPIMsgPremiaHarley();

    @AttributeDefinition(name = "Send SMS API Template ID for Product page", description = "Template ID number for product page", type = AttributeType.STRING)
    String sendSMSAPITemplateIDProduct();

    @AttributeDefinition(name = "Send SMS API Message format for Product page", description = "Text message format for product page", type = AttributeType.STRING)
    String sendSMSAPIMsgProduct();

    @AttributeDefinition(name = "Delay time for each OTP API hit per user", description = "Delay time (in milliseconds) for each OTP API hit per user", type = AttributeType.INTEGER)
    int acceptedTimeDifferenceInMs() default 10000;

    @AttributeDefinition(name = "Lead Gen API URL", description = "API URL for Lead Gen service", type = AttributeType.STRING)
    String leadGenAPI();

    @AttributeDefinition(name = "Lead Gen API Token", description = "API Token for Lead Gen service", type = AttributeType.STRING)
    String leadGenToken();

    @AttributeDefinition(name = "Lead Gen API Source", description = "API Source for Lead Gen service", type = AttributeType.STRING)
    String leadGenSource();

    @AttributeDefinition(name = "GeoCode API URL", description = "Endpoint of the Google Maps API", type = AttributeType.STRING)
    String geocodeAPIURL();

    @AttributeDefinition(name = "GeoCode API Access Key", description = "Access key for Google Maps API", type = AttributeType.STRING)
    String geocodeAccessKey();

    @AttributeDefinition(name = "Skip OTP Validation", description = "Select to Skip the OTP Validation", type = AttributeType.STRING)
    String skipOTPValidation() default "false";

    @AttributeDefinition(name = "MMI API End point", description = "Map my India API end point to get access token", type = AttributeType.STRING)
    String getMMIEndPoint() default "https://outpost.mapmyindia.com/api/security/oauth/token";

    @AttributeDefinition(name = "get MMI Token grant Type", description = "Grant Type to get MMI Auth Token", type = AttributeType.STRING)
    String getGrantType() default "client_credentials";

    @AttributeDefinition(name = "MMI - Client ID", description = "Client ID to get MMI Auth Token", type = AttributeType.STRING)
    String getMMIClientID() default "33OkryzDZsIKL4FZTHMPqezq_pKvUoaVKdhiIAFjYQeqVkKygzgl-8Rb6MDMUaSpD8gq9xKDeKtq9b3pjNoTlg==";

    @AttributeDefinition(name = "MMI - Client Secret Key", description = "Client Secret key to get MMI Auth Token", type = AttributeType.STRING)
    String getMMIClientSecret() default "lrFxI-iSEg-3Z6bglg8uPtr2V_AFwqdB6jH-2q_6iZuHVwdjJ7j1XjTi5m9Njm2yBnlGueGhMJWx7RpMAv2lfhMDhsJCINTw";

    @AttributeDefinition(name = "Public Key for Good Life Encryption", description = "Public Key for Good Life Encryption", type = AttributeType.STRING)
    String goodLifeEncPublicKey() default "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiZDWMcT//3NKQBqLHp4Tk7cGPuxWl36A2ClGj2mMW2qSFnl/DowvexjAXvJBUOY+Y5rdjXwOADAJ4NEE346dFJyAHZJZbiLJiuA61xVcwoXFiESqI253/08VXv8/NBatJiG04XcnLUL2Sg4hIaW4Wh49akjyviQpdt0gybZmBy4pUUsJsSW9okBdu+4Wgq0zzRek29+PUHTpUxL6Ly/6rVOO1/uCoO4xbEj7DFHDRAi+HN++xnoceuil/X/ypf54HDUHoRVaNxa1hKYTUfTSlUeDj76N0yGZqEl2+bm1CDWN18voRb+cBFIN8fgC3av2y+L/OIW1f7k/N3FV6tBGBwIDAQAB";

    @AttributeDefinition(name = "Merchant ID for CC Avenue", description = "Merchant ID for CC Avenue integration", type = AttributeType.STRING)
    String ccAvenueMerchantID() default "168930";

    @AttributeDefinition(name = "Working key for CC Avenue", description = "Working key for CC Avenue Integration", type = AttributeType.STRING)
    String ccAvenueWorkingKey() default "D1C4B1EB94926938F6B211F0A6B0BF89";

    @AttributeDefinition(name = "Access Code for CC Avenue", description = "Access Code for CC Avenue Integration", type = AttributeType.STRING)
    String ccAvenueAccessCode() default "AVOC01FC54AO88COOA";

    @AttributeDefinition(name = "Payment Gateway Response Servlet path", description = "Servlet path for the Payment Gateway to return the transaction details", type = AttributeType.STRING)
    String servletPathPG() default "https://dev1.heromotocorp.com/content/hero-aem-website/in/en-in/homepage.postPaymentData.html";

    @AttributeDefinition(name = "API path for posting Transaction results to ONE APP", description = "API path for posting Transaction results to ONE APP", type = AttributeType.STRING)
    String getAPIForPostingTransaction() default "https://hero-one-app-uat.azurewebsites.net/api/ccav_resp?ORG_ID=ONEAPP";

    @AttributeDefinition(name = "Thank you page path", description = "Page path to which site should be re-directed", type = AttributeType.STRING)
    String thankYouPagePath() default "https://dev1.heromotocorp.com/content/hero-aem-website/in/en-in/my-account/thank-you.html";

    @AttributeDefinition(name = "Sorry page path", description = "Page path to which site should be re-directed", type = AttributeType.STRING)
    String sorryPagePath() default "https://dev1.heromotocorp.com/content/hero-aem-website/in/en-in/my-account/sorrypage.html";

    @AttributeDefinition(name = "Corporate Form URL", description = "Provide Corporate Enquiry Form End Point", type = AttributeType.STRING)
    String getCorporateAPIURL();

    @AttributeDefinition(name = "SCorporate Form Magic Token", description = "Provide Corporate Enquiry Form Magic Token", type = AttributeType.STRING)
    String getMagicToken();

    @AttributeDefinition(name = "Product Enquiry Form URL", description = "Provide Product Enquiry Form End Point", type = AttributeType.STRING)
    String getProductEnquiryAPIURL();

    @AttributeDefinition(name = "Corporate Form URL", description = "Provide Suggestions Form End Point", type = AttributeType.STRING)
    String getSuggestionsAPIURL();

    @AttributeDefinition(name = "Corporate Form URL", description = "Provide Suggestions Form End Point", type = AttributeType.STRING)
    String getSOAPUsername();

    @AttributeDefinition(name = "Corporate Form URL", description = "Provide Suggestions Form End Point", type = AttributeType.STRING)
    String getSOAPPassword();

    @AttributeDefinition(name = "Send SMS API Username", description = "API User for SMS service", type = AttributeType.STRING)
    String sendSMSAPIUser();

    @AttributeDefinition(name = "Send SMS API Password", description = "API Key for SMS service", type = AttributeType.STRING)
    String sendSMSAPIKey();

    @AttributeDefinition(name = "Send SMS API URL", description = "Provide API URL for SMS Service", type = AttributeType.STRING)
    String sendNEWSMSAPI();

    @AttributeDefinition(name = "Enter Login Page Path for Dealers Portal", description = "Login Page Path for Dealers Portal", type = AttributeType.STRING)
    String redirectLoginPagePath();

    @AttributeDefinition(name = "Enter Home Page Path for Dealers Portal", description = "Home Page Path for Dealers Portal", type = AttributeType.STRING)
    String dealerHomePagePath();

    @AttributeDefinition(name = "Dealers Portal API", description = "Dealers Portal API", type = AttributeType.STRING)
    String dealersPortalAPI();

    @AttributeDefinition(name = "Lead Gen API URL", description = "API URL for Lead Gen service", type = AttributeType.STRING)
    String newLeadGenAPI();

    @AttributeDefinition(name = "Lead Gen API Token", description = "API Token for Lead Gen service", type = AttributeType.STRING)
    String newleadGenAccessKey();

    @AttributeDefinition(name = "Lead Gen API Source", description = "API Source for Lead Gen service", type = AttributeType.STRING)
    String newLeadGenSecretKey();

}
