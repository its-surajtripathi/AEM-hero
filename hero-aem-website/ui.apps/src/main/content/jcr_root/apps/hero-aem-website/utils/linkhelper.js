use(function () {
    var value = this.linkUrl || "";
    var isExternal = true;
    var linkResource = null;
    linkType = "external";
    if (value.startsWith("/")) {
        isExternal = false;
    }
    if (value.startsWith("#")) {
        isExternal = false;
        linkType = "internal";
    }
    if (value.startsWith("/content/dam/")) {
        isExternal = false;
        linkType = "damAsset";
        linkResource = resolver.getResource(value);
    } else if (value.startsWith("/content/")) {
        isExternal = false;
        linkType = "internal";
        linkResource = resolver.getResource(value);
        value = value + '.html';
    }
    return {
        value : value,
        isExternal : isExternal,
        linkType : linkType,
        linkResource : linkResource
    };
});