"use strict";  
  
use(["/libs/sightly/js/3rd-party/q.js"], function (Q) {  
    var nodeProperties = Q.defer();
    granite.resource.resolve(this.parentPath).then(function (currentResource) { 
		nodeProperties.resolve(currentResource); 
	});  
    return nodeProperties.promise;  
}); 