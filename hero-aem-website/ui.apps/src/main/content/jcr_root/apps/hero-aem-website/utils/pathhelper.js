"use strict";

var global = this;
use(function() {
    if (currentPage.getDepth() > this.depth) {
        return currentPage.getAbsoluteParent(this.depth);
    }
    return currentPage;
});