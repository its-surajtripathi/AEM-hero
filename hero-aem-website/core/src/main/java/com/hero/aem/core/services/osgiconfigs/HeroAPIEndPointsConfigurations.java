package com.hero.aem.core.services.osgiconfigs;

import java.util.HashMap;
import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ConfigurationPolicy;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component(service = HeroAPIEndPointsConfigurations.class, configurationPolicy = ConfigurationPolicy.REQUIRE, immediate = true)
@Designate(ocd = HeroAPIEndPointsConfiguration.class)
public class HeroAPIEndPointsConfigurations {

    @SuppressWarnings("unused")
    private static final Logger LOGGER = LoggerFactory.getLogger(HeroAPIEndPointsConfigurations.class);
    
    private String apiValueAsString;
    
	public String getApiValueAsString() {
		return apiValueAsString;
	}

	public void setApiValueAsString(String apiValueAsString) {
		this.apiValueAsString = apiValueAsString;
	}
	
	private Map<String, Object> configProperties;

	@Activate
    public void activate(final HeroAPIEndPointsConfiguration config, final Map<String, Object> properties) throws JsonProcessingException {
    	LOGGER.info("inside activate");
    	this.configProperties = properties;
    	Map<String, Object> configProperties = new HashMap<>(properties);
    	configProperties.remove("service.pid");
    	configProperties.remove("osgi.ds.satisfying.condition.target");
    	configProperties.remove("component.id");
    	configProperties.remove("component.name");
    	this.apiValueAsString = new ObjectMapper().writeValueAsString(configProperties);
    }
    
    @Modified
    public void modified(HeroAPIEndPointsConfiguration config, final Map<String, Object> properties) throws JsonProcessingException {
        activate(config, properties);
    }
    
    public String getConfigProperty(String key) {
        return configProperties.get(key).toString();
    }

    @Deactivate
    public void deactivate() {
        if (apiValueAsString != null) {
        	apiValueAsString = null;
        }
    }

}
