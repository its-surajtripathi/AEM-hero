package com.hero.aem.core.beans;

import javax.inject.Inject;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

@Model( adaptables = Resource.class )
public class ProductAccordionBean {

    @Inject
    private String productname;

    @Inject
    private String productthumbpath;
    
    @Inject
    private String productlargepath;

	public String getProductname() {
		return productname;
	}

	public void setProductname(String productname) {
		this.productname = productname;
	}

	public String getProductthumbpath() {
		return productthumbpath;
	}

	public void setProductthumbpath(String productthumbpath) {
		this.productthumbpath = productthumbpath;
	}

	public String getProductlargepath() {
		return productlargepath;
	}

	public void setProductlargepath(String productlargepath) {
		this.productlargepath = productlargepath;
	}

}
