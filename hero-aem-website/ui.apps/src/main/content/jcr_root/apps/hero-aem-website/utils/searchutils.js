
"use strict";

var global = this;

/**
 * List foundation component JS backing script
 */
use(["/libs/sightly/js/3rd-party/q.js"], function (Q) {

    var productList = null;
    if (global.Packages) {
        var resourceResolver = resource.getResourceResolver();
        var search = resource.adaptTo(global.Packages.com.day.cq.search.SimpleSearch);
        
        var pagePredicate = new global.Packages.com.day.cq.search.Predicate("type", "type");
        pagePredicate.set("type", "cq:Page");
        var propPredicate = new global.Packages.com.day.cq.search.Predicate("1_property", "property");
		propPredicate.set("property", "@jcr:content/sling:resourceType");
		propPredicate.set("value", "hero-aem-website/components/structure/productpage");
        var orderPredicate = new global.Packages.com.day.cq.search.Predicate("orderby", "orderby");
		orderPredicate.set("orderby", "@jcr:content/pagerank");
		orderPredicate.set("orderby.sort", "asc");
        search.addPredicate(pagePredicate);
		search.addPredicate(propPredicate);
		search.addPredicate(orderPredicate);
        search.setHitsPerPage(30);
        search.setSearchIn(this.path);
        var searchResult = search.getResult();
        if (searchResult && searchResult.getResources) {
            productList = searchResult.getResources();
        }
    }
    return productList;
});