package com.hero.aem.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

import com.day.cq.commons.jcr.JcrConstants;
import com.hero.aem.core.beans.ProductAccordionBean;
import com.hero.aem.core.beans.ProductAccordionDetailsBean;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = "jackson", extensions = "json")
@SuppressWarnings("squid:S2384")
public class ProductAccordionModel {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ProductAccordionModel.class);

	@Self
	private Resource resource;

    @Inject
    private Resource multiproduct;
	
	private List<ProductAccordionDetailsBean> productList = new ArrayList<>();
	
	@PostConstruct
	protected void init() {
		if(multiproduct!=null) {
		Resource multifieldRes=multiproduct;
		getProductMultifieldItems( multifieldRes );
		}			
	}

	private void getProductMultifieldItems( Resource resource ) {
	LOGGER.info("In ProductAccordionModel getProductMultifieldItems method");
		if ( resource != null ) {     	
			Iterator<Resource> linkResource = resource.listChildren();
			while ( linkResource.hasNext() ) {
				ProductAccordionDetailsBean productAccordionDetails = new ProductAccordionDetailsBean();
				List<String> productThumbImages = new ArrayList<>();
				List<String> productLargeImages = new ArrayList<>();
				String productName ="";
				Resource linkrec = linkResource.next();
				ProductAccordionBean productDetails = (ProductAccordionBean) linkrec.adaptTo( ProductAccordionBean.class );
				if(productDetails != null) {
				    productName = productDetails.getProductname();
					String productThumbPath = productDetails.getProductthumbpath();
					String productLargePath = productDetails.getProductlargepath();
					if (StringUtils.isNotBlank(productThumbPath)) {
						productThumbImages =	getProductImages(productThumbPath);
					}
					if (StringUtils.isNotBlank(productThumbPath)) {
					    productLargeImages =	getProductImages(productLargePath);
					}					
				}
				productAccordionDetails.setProductTitle(productName);
				Collections.sort(productThumbImages, new Comparator<String>() {
				    public int compare(String o1, String o2) {
				        return extractInt(o1) - extractInt(o2);
				    }
				    int extractInt(String s) {
				        String num = s.replaceAll("\\D", "");
				        return num.isEmpty() ? 0 : Integer.parseInt(num);
				    }
				});Collections.sort(productLargeImages, new Comparator<String>() {
				    public int compare(String o1, String o2) {
				        return extractInt(o1) - extractInt(o2);
				    }
				    int extractInt(String s) {
				        String num = s.replaceAll("\\D", "");
				        return num.isEmpty() ? 0 : Integer.parseInt(num);
				    }
				});
				productAccordionDetails.setProductThumbImages(productThumbImages);
				productAccordionDetails.setProductLargeImages(productLargeImages);
				productList.add(productAccordionDetails);				
			}
		}
	}
	
	private List<String> getProductImages(String productFolderPath) {
		List<String> productImages = new ArrayList<>();
		Resource productPatheJcrContentResource = this.resource.getResourceResolver().getResource(productFolderPath);
		if (productPatheJcrContentResource != null) {
			Iterator<Resource> children = productPatheJcrContentResource.listChildren();
			while (children.hasNext()) {								
				Resource childRes = children.next();
				String productImage = childRes.getPath();	
				if(!productImage.contains(JcrConstants.JCR_CONTENT))
				productImages.add(productImage);
			}			
		}
		return productImages;
	}

	public List<ProductAccordionDetailsBean> getProductList() {
		return productList;
	}

	public void setProductList(List<ProductAccordionDetailsBean> productList) {
		productList = new ArrayList<>(productList);
	    this.productList = Collections.unmodifiableList(productList);
	}
	
}
