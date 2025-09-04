use(function () {
    var value = this.propValue;
    var propType = "String";
    var isInternalLink = false;
    if (this.propValue.constructor === String) {
        if (value.startsWith("/content/") && null != pageManager.getPage(value)) {
            value = resolver.map(value) + '';
            if (!value.startsWith("/content/dam/")) {
                isInternalLink = true; 
            }
        }
        value = value.replace(/[\n\r]+/g, '');
    } else if (this.propValue.constructor === Boolean || this.propValue.constructor === Number) {
        propType = "Boolean";
    } else if (this.propValue.constructor === Array) {
        propType = "Array";
    } else if (this.propValue.constructor === Calendar) {
        value = value.getTimeInMillis();
        propType = "Boolean";
    }
    return {
        validKey : !this.propName.startsWith("jcr:"),
        value : value,
        valueType : propType,
        isInternalLink 
    };
});