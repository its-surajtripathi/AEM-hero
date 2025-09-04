package com.hero.aem.core.models;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import com.day.cq.wcm.api.components.ComponentContext;

@Model(adaptables = SlingHttpServletRequest.class)
public class UnwrapWrapperClasses {

    @Self
    private SlingHttpServletRequest request;

    @PostConstruct
    public void initModel() {

        request.setAttribute(ComponentContext.BYPASS_COMPONENT_HANDLING_ON_INCLUDE_ATTRIBUTE, true);

    }

}
