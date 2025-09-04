"use strict";  
  
use(function () {
    var hyphenReplace = this.path;
    hyphenReplace = hyphenReplace.split(" ").join("-");
    return hyphenReplace;
}); 