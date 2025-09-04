package com.hero.aem.core.services.caconfigs;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(label = "PageCaConfig", description = "Additional configurations that would be required in page")
public @interface PageCaConfig {

    @Property(label = "Site Root Page", description = "", order = 1)
    String siteRoot() default "/content/hero-aem-website/in/en-in";

    @Property(label = "Dealer Data Root Path", description = "", order = 1)
    String dealerRootPath() default "/content/hmc/dealers/in";

    @Property(label = "State Data Root Path", description = "", order = 1)
    String stateRootPath() default "/content/hmc/cities/in";

    @Property(label = "Currency Symbol", description = "Currency Symbol for the current Country", order = 2)
    String currencyUnit() default "₹";

    @Property(label = "Country Code", description = "Currency Code for dial-in", order = 2)
    String countryCode() default "+91";
}
