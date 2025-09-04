package com.hero.aem.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.RequestAttribute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class StateCityModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(StateCityModel.class);

    @Inject
    private ResourceResolver res;

    @RequestAttribute(name="contentPath")
    String contentPath;
    String state = null;
    ArrayList<String> cityList;
    ArrayList<String> statesList = new ArrayList<String>();
    HashMap<String, ArrayList<String>> stateCityMap = new HashMap<>();

    @PostConstruct
    protected void init() {
        try {
            Resource statesRes = res.getResource(contentPath);
            Node node = statesRes.adaptTo(Node.class);
            final NodeIterator it = node.getNodes();

            while (it.hasNext()) {
                Node childNode = it.nextNode();
                NodeIterator childIt = childNode.getNodes();
                cityList = new ArrayList<String>();
                state = childNode.getProperty("state_name").getString();
                statesList.add(state);
                while (childIt.hasNext()) {
                    Node cityNode = childIt.nextNode();
                    cityList.add(cityNode.getProperty("city").getString());
                }
                Collections.sort(cityList);
                stateCityMap.put(state, cityList);
            }
        } catch (RepositoryException e) {
            LOGGER.error("EXCEPTION OCCURRED:", e.getMessage());
        }
    }

    public ArrayList<String> getStatesList() {
        Collections.sort(statesList);
        return statesList;
    }

    public HashMap<String, ArrayList<String>> getStateCityMap() {
        return stateCityMap;
    }
}