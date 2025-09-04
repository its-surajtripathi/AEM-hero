package com.hero.aem.core.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import javax.jcr.Session;

import com.adobe.granite.asset.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.google.gson.Gson;
import org.apache.sling.api.resource.Resource;
import org.osgi.framework.Constants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;

import com.hero.aem.core.beans.InvestorsSearchResult;
import com.hero.aem.core.constants.HeroConstants;

@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Servlet to get the Investors Details",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/structure/page",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=investors",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json" })
public class InvestorsServlet extends SlingAllMethodsServlet {

    @Reference
    private transient QueryBuilder queryBuilder;
    private static final Logger LOGGER = LoggerFactory.getLogger(MediaServlet.class);
    private static final String JCR_CONTENT_METADATA = "/jcr:content/metadata";
    private static final String P_LIMIT = "p.limit";
    private static final String P_LIMIT_VALUE = "-1";
    // private static final String INVESTOR_PATH =
    // "/content/dam/hero-aem-website/in/investors/financial-results/";
    private static final String PROPERTY_VALUE = "@jcr:content/metadata/years";
    private static final String PROPERTY_OPERATION = "property.operation";
    private static final String PROPERTY = "property";
    private static final String EXISTS = "exists";

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {

        String investorsCategory = request.getParameter("investorsCategory");
        String[] categoryName = request.getParameterValues("categoryName");
        String categoryPath = "/content/dam/hero-aem-website/in/investors/financial-results/";
        if (null != investorsCategory) {
            categoryPath = investorsCategory;
        }
        List<InvestorsSearchResult> querySearchResults = new ArrayList<>();
        Gson gsonObj = new Gson();
        ResourceResolver resourceResolver = request.getResourceResolver();
        if (null != resourceResolver) {
            Map<String, String> map = new HashMap<>();
            map.put(HeroConstants.PATH, categoryPath);
            map.put(HeroConstants.TYPE, DamConstants.NT_DAM_ASSET);
            map.put(PROPERTY, PROPERTY_VALUE);
            map.put(PROPERTY_OPERATION, EXISTS);
            map.put(P_LIMIT, P_LIMIT_VALUE);
            try {
                Query query = queryBuilder.createQuery(PredicateGroup.create(map),
                        resourceResolver.adaptTo(Session.class));
                SearchResult result = query.getResult();

                for (final Hit hit : result.getHits()) {
                    String assetTitle = "";
                    String years = "";
                    String folderName = "";
                    String description = "";
                    String quarter ="";
                    Float size = null;
                    Asset asset = hit.getResource().adaptTo(Asset.class);
                    InvestorsSearchResult queryresult = new InvestorsSearchResult();
                    queryresult.setPath(asset.getPath());
                    Resource imageResource = resourceResolver.getResource(asset.getPath() + JCR_CONTENT_METADATA);
                    if (imageResource.getValueMap().containsKey("name")) {
                        assetTitle = imageResource.getValueMap().get("name").toString();
                    }
                    if (null != categoryName) {
                        folderName = folderName(asset.getPath(), categoryName);
                    }
                    if (imageResource.getValueMap().containsKey("years")) {
                        years = imageResource.getValueMap().get("years").toString();
                    }
                    if (imageResource.getValueMap().containsKey(DamConstants.DAM_SIZE)) {
                        size = (Float.parseFloat(imageResource.getValueMap().get(DamConstants.DAM_SIZE).toString())
                                / 1024) / 1024;
                    }
                    if(imageResource.getValueMap().containsKey("description")){
                        description = imageResource.getValueMap().get("description").toString();
                    }
                    if(imageResource.getValueMap().containsKey("quarter")){
                        quarter = imageResource.getValueMap().get("quarter").toString();
                    }
                    queryresult.setTitle(assetTitle);
                    queryresult.setYear(years);
                    queryresult.setFolderName(folderName);
                    queryresult.setSize(size);
                    queryresult.setDescription(description);
                    queryresult.setQuarter(quarter);
                    querySearchResults.add(queryresult);

                }
            } catch (RepositoryException e) {
                LOGGER.error("Exception in Media Servlet: {} ", e);
            }
        }
        String resultsList = gsonObj.toJson(querySearchResults);
        response.getWriter().write(resultsList);
    }

    private String folderName(String assetPath, String[] categoryName) {
        String names = "";
        for (String element : categoryName) {
            if (assetPath.contains(element)) {
                names = element;
                break;
            }
        }
        return names;
    }
}
