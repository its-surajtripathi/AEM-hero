$(document).ready(function() {
    if ($('.hf-main-container').length > 0) {
        let vehicleData = JSON.parse(atob(getCookie('selectedVehicleData')));
        if (getCookie('selectedVehicleData') != null) {
                vehicleCallbackSucess(vehicleData, $('.banner-icon'), $('.selvehicleData'));
        }
    }
    $('.change-vehicle-grid').click(function() {
    	$('.change-vehicle-grid').removeClass('active');
    	$(this).toggleClass('active');
    });
    $('.btn-vehicle-change').click(function() {
        let selVehicleData = JSON.parse(atob(getCookie('selectedVehicleData')));
        let vehicleData = JSON.parse(atob(getCookie('vehicleDetails')));
        document.cookie = "selectedVehicleData=" + btoa(JSON.stringify(vehicleData[$('.change-vehicle-grid.active').data('vinnoindex')])) + "; path=/";
        window.location.reload();
    });
  
});