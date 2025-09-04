package com.hero.aem.core.beans;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@SuppressWarnings("squid:S2384")
public class ProductAccordionDetailsBean {
     
    private String productTitle;

    private List<String> productThumbImages = Collections.emptyList();
    
    private List<String> productLargeImages = Collections.emptyList();

	public String getProductTitle() {
		return productTitle;
	}

	public void setProductTitle(String productTitle) {
		this.productTitle = productTitle;
	}

	public List<String> getProductThumbImages() {
		return productThumbImages;
	}

	public void setProductThumbImages(List<String> productThumbImages) {
		productThumbImages = new ArrayList<>(productThumbImages);
	    this.productThumbImages = Collections.unmodifiableList(productThumbImages);
	}

	public List<String> getProductLargeImages() {
		return productLargeImages;
	}

	public void setProductLargeImages(List<String> productLargeImages) {
		productLargeImages = new ArrayList<>(productLargeImages);
	    this.productLargeImages = Collections.unmodifiableList(productLargeImages);
	}
    
}
