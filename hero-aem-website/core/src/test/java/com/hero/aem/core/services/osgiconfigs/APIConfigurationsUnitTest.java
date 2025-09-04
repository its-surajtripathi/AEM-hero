package com.hero.aem.core.services.osgiconfigs;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import java.util.HashMap;
import java.util.Map;
import org.junit.jupiter.api.Test;
import com.hero.aem.core.services.osgiconfigs.APIConfigurations;

/**
 * APIConfigurationsUnitTest unit test.
 */
public class APIConfigurationsUnitTest {

    public static APIConfigurations mockApiConfigManager(boolean mockApiEnabled) {
        final APIConfigurations apiConfigurations = new APIConfigurations();
        final Map<String, Object> props = new HashMap<>();

        // prepare the properties for the service (mocked)
        props.put("sendSMSAPI", "sampleAPI");
        props.put("sendSMSAPIUsername", "username");
        props.put("sendSMSAPIPassword", "credential");
        props.put("leadGenAPI", "leadAPI");
        props.put("leadGenToken", "leadAPIToken");
        props.put("leadGenSource", "leadSource");

        // initiate the service manually
        apiConfigurations.activate(null, props);
        apiConfigurations.modified(null, props);
        return apiConfigurations;
    }

    @Test
    public void testNormalConfig() {

        final APIConfigurations apiConfigurations = mockApiConfigManager(true);
        final Map<String, Object> apiConfigs = apiConfigurations.getConfigProperties();
        // check key properties
        assertEquals("sampleAPI", apiConfigs.get("sendSMSAPI"));
        assertEquals("username", apiConfigs.get("sendSMSAPIUsername"));
        assertEquals("leadAPI", apiConfigs.get("leadGenAPI"));
        assertEquals("leadSource", apiConfigs.get("leadGenSource"));
        apiConfigurations.deactivate();
        assertNull(apiConfigurations.getConfigProperties());
        apiConfigurations.deactivate();
        assertNull(apiConfigurations.getConfigProperties());
    }

}
