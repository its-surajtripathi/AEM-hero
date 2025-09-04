"use strict";  
  
use(function () {
    var imagePath = this.path;
    var ext = this.extension || 'jpeg';
    if (imagePath && this.rendition) {
        var imageResource = resolver.getResource(this.path + '/jcr:content/renditions/' + this.rendition + '.' + ext);
        if (imageResource) {
            return imageResource.path;
        }
    }
    return imagePath;
}); 