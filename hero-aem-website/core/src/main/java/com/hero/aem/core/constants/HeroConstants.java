package com.hero.aem.core.constants;

public class HeroConstants {

    final public static String REQ_PARAM_PHONE_NUMBER = "phoneNum";
    final public static String REQ_PARAM_PAGE_TYPE = "pageType";
    final public static String REQ_PARAM_VEHICLE_NAME = "vehicleName";

    final public static String EMPTY_STRING = "";

    final public static String PAGE_TYPE_HOME = "homepage";
    final public static String PAGE_TYPE_HARLEY = "Premia HD";
    final public static String ACAA = "ACAA";

    final public static String PARAM_NAME_CONFIG = "configName";
    final public static String PARAM_NAME_TEMP_ID = "templateId";
    final public static String PARAM_NAME_TEMP_MSG = "templateMsg";
    final public static String PARAM_NAME_API_URL = "apiUrl";
    final public static String PARAM_NAME_AUTH_HEADER = "Authorization";
    final public static String OSGI_AEM_PROXY_HOST = "aemProxyHost";
    final public static String OSGI_SENDSMSAPITEMPLATEIDHOME = "sendSMSAPITemplateIDHome";
    final public static String OSGI_SENDSMSAPIMSGHOME = "sendSMSAPIMsgHome";
    final public static String OSGI_SENDSMSAPITEMPLATEIDHARLEY = "sendSMSAPITemplateIDHarley";
    final public static String OSGI_SENDSMSAPIMSGHARLEY = "sendSMSAPIMsgPremiaHarley";
    final public static String OSGI_SENDSMSAPITEMPLATEIDPRODUCT = "sendSMSAPITemplateIDProduct";
    final public static String OSGI_SENDSMSAPIMSGPRODUCT = "sendSMSAPIMsgProduct";
    final public static String OSGI_SENDSMSAPITEMPLATEIDACAA = "sendSMSAPITemplateIDAcaa";
    final public static String OSGI_SENDSMSAPIMSGACAA = "sendSMSAPIMsgPremiaAcaa";
    final public static String OSGI_SENDSMSAPIURL = "sendSMSAPI";
    final public static String OSGI_SENDSMSAPIFROMNAME = "sendSMSAPIFromName";
    final public static String OSGI_SENDSMSAPIUSERNAME = "sendSMSAPIUsername";
    final public static String OSGI_SENDSMSAPIKEY = "sendSMSAPIPassword";
    final public static String OSGI_LEADGENTOKEN = "leadGenToken";
    final public static String OSGI_LEADGENSOURCE = "leadGenSource";
    final public static String OSGI_ACCEPTEDTIMEDIFFINMS = "acceptedTimeDifferenceInMs";
    final public static String SKIP_OTP_VALIDATION = "skipOTPValidation";
    final public static String OSGI_LEADGENAPI = "leadGenAPI";
    final public static String OSGI_NEW_LEADGENAPI = "newLeadGenAPI";
    final public static String OSGI_ROOTNODEPATH = "rootNodePath";
    final public static String OSGI_STATENAMES = "stateNames";
    final public static String OSGI_RUNMODE = "runMode";
    final public static String OSGI_GEOCODEAPIURL = "geocodeAPIURL";
    final public static String OSGI_GEOCODEACCESSKEY = "geocodeAccessKey";

    public static final String MIME_TYPE_CSV = "text/csv";

    public static final String VEHICLE_DETAILS_ROOT_PATH = "rootNodePath";
    public static final String REP_POLICY_NODE = "rep:policy";

    public static final String RUNMODE_AUTHOR = "author";

    public static final String TITLE = "title";
    public static final String DATE_FORMAT = "dd-MMMM-yyyy";
    public static final String PATH = "path";
    public static final String TYPE = "type";

    public static final String DATE_FORMAT_SLASH = "MM/dd/yyyy";
    public static final String CONTENT_TYPE = "Content-Type";
    public static final String CONTENT_LENGTH = "Content-Length";
    public static final String APPLICATION_JSON = "application/json";
    public static final String SIEBEL_WEB_SERVICES = "http://siebel.com/webservices";
    public static final String HHM = "hhm";
    public static final String SOAPACTION = "SOAPAction";
    public static final String USERNAME = "username";
    public static final String KEY = "password";
    public static final String TO = "to";
    public static final String FROM = "from";
    public static final String TEXT = "text";
    public static final String DLT_TEMPLATE = "dlt_templateid";
    public static final String MESSAGE = "message";
    public static final String STATUS = "status";
    public static final String SUCCESS = "success";
    public static final String FAILURE = "failure";
    public static final String CONTENT_TYPE_XML = "text/xml; charset=utf-8";
    public static final String RESPONSE_STRING = "responseString";

    public static final String GOODLIFE_CONSTANT = "{\r\n"
            + "  \"PWSESSIONRS\": {\r\n"
            + "    \"PWPROCESSRS\": {\r\n"
            + "      \"PWHEADER\": {\r\n"
            + "        \"IN_PROCESS_ID\": \"${pid}\", \r\n"
            + "        \"APP_ID\": \"ONEAPP\",\r\n"
            + "        \"ORG_ID\": \"ONEAPP\",\r\n"
            + "        \"OUT_PROCESS_ID\": \"GOODLIFE_API\",\r\n"
            + "        \"LOGIN_ID\": \"\"\r\n"
            + "      },\r\n"
            + "      \"PWDATA\": {\r\n"
            + "        \"ACTION\" : \"1\",\r\n"
            + "        \"GOODLIFE_API\": {\r\n"
            + "          \"Row\": [\r\n"
            + "            {\r\n"
            + "              \"0\":\"${enc_request}\",\r\n"
            + "              \"1\":\"eyJDb250ZW50LVR5cGUiOiJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQifQ==\", \r\n"
            + "              \"2\": \"${api_name}\", \r\n"
            + "              \"3\":\"${enc_key}\", \r\n"
            + "              \"4\":\"\"\r\n"
            + "            }\r\n"
            + "           \r\n"
            + "          ]\r\n"
            + "        }\r\n"
            + "      },\r\n"
            + "      \"PWERROR\": \"\"\r\n"
            + "    }\r\n"
            + "  }\r\n"
            + "}";

    public static final String LEADSQUARE_CONSTANT = "[\n{\n\"Attribute\": \"EmailAddress\",\n\"Value\": \"${email}\"\n},\n{\n\"Attribute\": \"mx_UTM_Campaign\",\n\"Value\": \"${utm_campaign}\"\n},\n{\n\"Attribute\": \"mx_UTM_Content\",\n\"Value\": \"${utm_content}\"\n},\n{\n\"Attribute\": \"mx_UTM_Medium\",\n\"Value\": \"${utm_medium}\"\n},\n{\n\"Attribute\": \"mx_UTM_Source\",\n\"Value\": \"${utmSource}\"\n},\n{\n\"Attribute\": \"mx_UTM_Term\",\n\"Value\": \"${utm_term}\"\n},\n{\n\"Attribute\": \"mx_Bike_Name\",\n\"Value\": \"${vehicleModel}\"\n},\n{\n\"Attribute\": \"mx_Customer_Name\",\n\"Value\": \"${customerName}\"\n},\n{\n\"Attribute\": \"Mobile\",\n\"Value\": ${mobile}\n},\n{\n\"Attribute\": \"mx_City\",\n\"Value\": \"${city}\"\n},\n{\n\"Attribute\": \"mx_State\",\n\"Value\": \"${state}\"\n},\n{\n\"Attribute\": \"mx_State2\",\n\"Value\": null\n},\n{\n\"Attribute\": \"Source\",\n\"Value\": \"${source}\"\n},\n{\n\"Attribute\": \"mx_Interested_In\",\n\"Value\": null\n},\n{\n\"Attribute\": \"mx_Preferred_Dealership\",\n\"Value\": null\n},\n{\n\"Attribute\": \"mx_Vehicle_Purchase_Plan\",\n\"Value\": null\n},\n{\n\"Attribute\": \"mx_Own_Vehicle\",\n\"Value\": null\n},\n{\n\"Attribute\": \"mx_Date\",\n\"Value\": null\n}\n]";

}
