"use strict";  
  
use(function () {
    var vehiclePath = this.path;
    vehiclePath = vehiclePath.split("-plus").join("plus");
    vehiclePath = vehiclePath.split("-").join("_");
    return vehiclePath;
}); 