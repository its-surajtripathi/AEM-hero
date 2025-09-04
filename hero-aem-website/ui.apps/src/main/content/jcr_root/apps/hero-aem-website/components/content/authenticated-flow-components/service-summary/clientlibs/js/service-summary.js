$(document).ready(function () {
   if($('.servicesummary').length>0){
	   let selectedVehData = JSON.parse(atob(getCookie('selectedVehicleData')));
	var serviceSummaryData = [{
	   "0": selectedVehData.vinNO,
	   "1": selectedVehData.SRID
    }]
	var serviceSummaryDataRequest = requestParam("oa_getSRserviceDetail", serviceSummaryData, "2");
	synchronousAjax(window.aemConfigs.apiEndpoints.middleWareAPI, serviceSummaryDataRequest, serviceSummaryData).then(function (data) {
	   getServiceSummaryData = data.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getSRserviceDetail.Row[0];
	  vehicleCallbackSucess(getServiceSummaryData, $('.servicesummary'), $('.getServiceSummaryTemplate'));
	  $('.servicesummary .serviceSummaryVehicleImage').append('<img src="'+selectedVehData.imagePath+'" alt="bikeImage"/>')
	})
    /*var jobCardCloseDate = getServiceData.jobCardCloseDate;
    var currentDate = new Date().toISOString().slice(0, 10);
    jobCardCloseDate = jobCardCloseDate.split(' ')[0];
      var totalAmount;
      var currentDate = new Date().toISOString().slice(0, 10);
      var jobCardCloseDate = getServiceSummaryData.jobCardCloseDate.split(' ')[0];
      var orderTotal = getServiceSummaryData.orderTotal;
      var estimatedPrice = getServiceSummaryData.estimatedPrice;
        if(jobCardCloseDate < currentDate ) {
            totalAmount = orderTotal;
          document.getElementById("totalAmount").text = orderTotal;
      } else {
            totalAmount = estimatedPrice;
           document.getElementById("totalAmount").text = estimatedPrice;
      }
     */
   }
 });