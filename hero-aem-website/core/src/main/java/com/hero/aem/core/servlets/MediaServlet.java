package com.hero.aem.core.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import org.osgi.framework.Constants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.DamConstants;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import com.day.crx.JcrConstants;
import com.google.gson.Gson;
import com.hero.aem.core.beans.QuerySearchResult;
import com.hero.aem.core.constants.HeroConstants;

@Component(service = Servlet.class, immediate = true, property = {
        Constants.SERVICE_DESCRIPTION + "=Servlet to get the Media Images",
        ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES + "=hero-aem-website/components/content/media",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=inthepress",
        ServletResolverConstants.SLING_SERVLET_SELECTORS + "=pressreleases",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=newsletters",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=annualreports",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json" })
public class MediaServlet extends SlingSafeMethodsServlet {

	@Reference
	private transient QueryBuilder queryBuilder;
    
	private static final Logger LOGGER = LoggerFactory.getLogger(MediaServlet.class);
	private static final String RELEASE_DATE = "releaseDate";
	private static final String PRESSNAME = "pressName";
	private static final String PROPERTY = "property";	
	private static final String PROPERTY_VALUE = "@jcr:content/metadata/releaseDate";
	private static final String PROPERTY_OPERATION = "property.operation";
	private static final String EXISTS = "exists";
	private static final String P_LIMIT = "p.limit";
	private static final String P_LIMIT_VALUE = "-1";
	private static final String JCR_CONTENT_METADATA = "/jcr:content/metadata";
	
	
    @Override
    protected void doGet(final SlingHttpServletRequest req, final SlingHttpServletResponse resp)
            throws ServletException, IOException {
    	String MediaType = req.getParameter("mediatype");
    	String MediaPath = "";
    	if(MediaType.equalsIgnoreCase("inthepress")) {
    		MediaPath = "/content/dam/hero-aem-website/in/media-center/in-the-press";
    	}
    	else if(MediaType.equalsIgnoreCase("pressreleases")) {
    		MediaPath = "/content/dam/hero-aem-website/in/media-center/press-release";
    	}
		else if(MediaType.equalsIgnoreCase("newsletters")) {
    		MediaPath = "/content/dam/hero-aem-website/in/media-center/csr/news-letters";
    	}
		else if(MediaType.equalsIgnoreCase("annualreports")) {
    		MediaPath = "/content/dam/hero-aem-website/in/media-center/csr/annual-reports";
    	}
		Boolean csrAnnualReport  = MediaType.equalsIgnoreCase("annualreports");
		Boolean csrNewsletter  = MediaType.equalsIgnoreCase("newsletters");
    	List<QuerySearchResult> querySearchResults = new ArrayList<>();
    	  Gson gsonObj = new Gson();
          ResourceResolver resourceResolver = req.getResourceResolver();
          if(null!=resourceResolver && MediaPath!=null && !(csrNewsletter) && !(csrAnnualReport)){
        		Map<String, String> map = new HashMap<>();
        		map.put(HeroConstants.PATH, MediaPath);
        		map.put(HeroConstants.TYPE, DamConstants.NT_DAM_ASSET);
        		map.put(PROPERTY, PROPERTY_VALUE);
        		map.put(PROPERTY_OPERATION, EXISTS);
        		map.put(P_LIMIT, P_LIMIT_VALUE);
        		try {
        			Query query = queryBuilder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
        			SearchResult result = query.getResult();

        			for (final Hit hit : result.getHits()) {
        				  String ImageTitle="";
        				  Object ImageReleaseDateObject=null;
        				  String ImagePressName="";
        				  String ImageReleaseDate="";
        				  Asset asset = hit.getResource().adaptTo( Asset.class );	
        				  QuerySearchResult queryresult = new QuerySearchResult();
        				  queryresult.setName( asset.getName() );
        				  queryresult.setPath( asset.getPath() );
        				  Resource imageResource = resourceResolver.getResource(asset.getPath()+JCR_CONTENT_METADATA);
        				  if (imageResource.getValueMap().containsKey(HeroConstants.TITLE)) {
        					  ImageTitle = imageResource.getValueMap().get(HeroConstants.TITLE).toString();
        				  }
        				  if (imageResource.getValueMap().containsKey(RELEASE_DATE)) {
        					  ImageReleaseDateObject = imageResource.getValueMap().get(RELEASE_DATE);
        					  GregorianCalendar calendar=(GregorianCalendar) ImageReleaseDateObject;
        					  SimpleDateFormat fmt = new SimpleDateFormat(HeroConstants.DATE_FORMAT);
        					  fmt.setCalendar(calendar);
        					  ImageReleaseDate = fmt.format(calendar.getTime());
        				  }
        				  if (imageResource.getValueMap().containsKey(PRESSNAME)) {
        					  ImagePressName = imageResource.getValueMap().get(PRESSNAME).toString();
        				  }
        				  queryresult.setTitle(ImageTitle);
        				  queryresult.setReleaseDate(ImageReleaseDate);
        				  queryresult.setPressName(ImagePressName);
        				  querySearchResults.add(queryresult);       		            
        			}
        		} catch (RepositoryException e) {
        			LOGGER.error("Exception: {} ", e);
        		}
          }
          if(null!=resourceResolver && MediaType.equalsIgnoreCase("pressreleases")){
        	Map<String, String> map = new HashMap<>();
      		map.put(HeroConstants.PATH, "/content/dam/hero-aem-website/in/media-center/press-releases/olddata");
      		map.put(HeroConstants.TYPE,JcrConstants.NT_UNSTRUCTURED);
      		map.put(PROPERTY, "releasedate");
      		map.put(PROPERTY_OPERATION, EXISTS);
      		map.put(P_LIMIT, P_LIMIT_VALUE);
      		try {
    			Query query = queryBuilder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
    			SearchResult result = query.getResult();

    			for (final Hit hit : result.getHits()) {
    				  String pdfTitle="";
    				  String pdfPressName="";
    				  String pdfReleaseDate="";
    				  String pdfDescription="";
    				  Node asset = hit.getResource().adaptTo(Node.class );	
    				  QuerySearchResult queryresult = new QuerySearchResult();
    				  queryresult.setName( asset.getName() );
    				  Resource pdfResource = resourceResolver.getResource(asset.getPath());
    				  if (pdfResource.getValueMap().containsKey("title")) {
    					  pdfTitle = pdfResource.getValueMap().get("title").toString();
    				  }
    				  if (pdfResource.getValueMap().containsKey("releasedate")) {
    					  pdfReleaseDate = pdfResource.getValueMap().get("releasedate").toString();
    				  }
    				  if (pdfResource.getValueMap().containsKey("pressname")) {
    					  pdfPressName = pdfResource.getValueMap().get("pressname").toString();
    				  }
    				  if (pdfResource.getValueMap().containsKey("description")) {
    					  pdfDescription = pdfResource.getValueMap().get("description").toString();
    				  }
    				  queryresult.setTitle(pdfTitle);
    				  queryresult.setReleaseDate(pdfReleaseDate);
    				  queryresult.setPressName(pdfPressName);
    				  queryresult.setPath( pdfDescription );
    				  querySearchResults.add(queryresult);       		            
    			}
    		} catch (RepositoryException e) {
    			LOGGER.error("Exception: {} ", e);
    		}
          }
          
		  if(null!=resourceResolver && (csrNewsletter || csrAnnualReport)){
			Map<String, String> map = new HashMap<>();
			map.put(HeroConstants.PATH, MediaPath);
			map.put(HeroConstants.TYPE,DamConstants.NT_DAM_ASSET);
			map.put(PROPERTY, "@jcr:content/metadata/year");
			map.put(PROPERTY_OPERATION, EXISTS);
			map.put(P_LIMIT, P_LIMIT_VALUE);
			try {
    			Query query = queryBuilder.createQuery(PredicateGroup.create(map), resourceResolver.adaptTo(Session.class));
    			SearchResult result = query.getResult();

    			for (final Hit hit : result.getHits()) {
    				  String pdfTitle="";
    				  String pdfYear="";
					  String pdfQuarter="";
    				  String pdfDescription="";
					  String pdfIcon="";
    				  Node asset = hit.getResource().adaptTo(Node.class );	
    				  QuerySearchResult queryresult = new QuerySearchResult();
    				  queryresult.setName( asset.getName() );
    				  Resource pdfResource = resourceResolver.getResource(asset.getPath()+JCR_CONTENT_METADATA);
    				  if (pdfResource.getValueMap().containsKey(HeroConstants.TITLE)) {
    					  pdfTitle = pdfResource.getValueMap().get(HeroConstants.TITLE).toString();
    				  }
    				  if (pdfResource.getValueMap().containsKey("year")) {
						  pdfYear = pdfResource.getValueMap().get("year").toString();
    				  }
    				  if (csrNewsletter && pdfResource.getValueMap().containsKey("quarter") ) {
						  pdfQuarter = pdfResource.getValueMap().get("quarter").toString();
    				  }
    				  if (pdfResource.getValueMap().containsKey("description")) {
    					  pdfDescription = pdfResource.getValueMap().get("description").toString();
    				  }
					  if (pdfResource.getValueMap().containsKey("iconPath")) {
						pdfIcon = pdfResource.getValueMap().get("iconPath").toString();
					}
    				  queryresult.setTitle(pdfTitle);
					  queryresult.setDescription(pdfDescription);
					  queryresult.setYear(pdfYear);
					  if(csrNewsletter){
						queryresult.setQuater(pdfQuarter);
					  }
					  queryresult.setIconPath(pdfIcon);
    				  queryresult.setPath( asset.getPath() );
    				  querySearchResults.add(queryresult);       		            
    			}
    		} catch (RepositoryException e) {
    			LOGGER.error("Exception: {} ", e.getMessage());
    		}
		  }
		  if(!(csrNewsletter) && !(csrAnnualReport)){
			querySearchResults.sort((o1, o2) -> {			 
					try {
					Date date2 = new SimpleDateFormat("dd-MMMM-yyyy").parse(o2.getReleaseDate());				
					Date date1=new SimpleDateFormat("dd-MMMM-yyyy").parse(o1.getReleaseDate());			 
					int cmp = date2.compareTo(date1);
					if (cmp != 0) {
						return cmp;
					}
					} catch (ParseException e) {
						LOGGER.error("Exception: {} ", e.getMessage());
					}			  
					return (o1.getPressName()).compareTo(o2.getPressName());	            
				});
			}
          String resultsList = gsonObj.toJson(querySearchResults);
          PrintWriter out = resp.getWriter();
          out.write(resultsList);
          out.flush();   	
    }
}