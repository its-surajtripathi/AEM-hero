$(document).ready(function () {
  var $current360ViewContainer;
  setDefaultState();

  // harley x440s bike specs and variations
  $(".harley-x440s-variant-img-wrapper").click(function () {
    topVariantClickHandler();
    highlight360Icon($(this));
  });

  // harley x440 vivid bike specs and variations
  $(".harley-x440-vivid-variant-img-wrapper").click(function () {
    vividVariantClickHandler();
    highlight360Icon($(this));
  });

  // harley x440 denim bike specs and variations
  $(".harley-x440-denim-variant-img-wrapper").click(function () {
    denimVariantClickHandler();
    highlight360Icon($(this));
  });

  //harley x440 vivid color variations
  $(".harley-bike-red-color-option").click(function () {
    destroy360Loaders();
    showX440VividRedVariant();
    $current360ViewContainer = $(".variant-vivid-red-360-view");
    $current360ViewContainer.j360();
  });

  $(".harley-bike-silver-color-option").click(function () {
    destroy360Loaders();
    showX440VividSilverVariant();
    $current360ViewContainer = $(".variant-vivid-silver-360-view");
    $current360ViewContainer.j360();
  });

  //show x440s variant details
  function showX440sVariant() {
    $(".harley-x440s-bike-360-view").removeClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_red_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_silver_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_denim_bike_img").addClass("bike-switch-fade-out-transition");

    // $(".harley-bike-color-variant-wrapper").addClass("d-opacity");

    $(".harley-bike-black-color-text").removeClass("d-none");
    $(".harley-bike-red-color-text").addClass("d-none");
    $(".harley-bike-silver-color-text").addClass("d-none");
    $(".harley-bike-denim-color-text").addClass("d-none");

    $(".harley-bike-black-color-option").removeClass("d-none");
    $(".harley-bike-red-color-option").addClass("d-none");
    $(".harley-bike-silver-color-option").addClass("d-none");
    $(".harley-bike-denim-color-option").addClass("d-none");

    $(".harley-x440s-variant-img-wrapper").addClass("d-selected-bike");
    $(".harley-x440-vivid-variant-img-wrapper").removeClass("d-selected-bike");
    $(".harley-x440-denim-variant-img-wrapper").removeClass("d-selected-bike");

    $(".harley-x440s-text").addClass("d-selected-font");
    $(".harley-x440-vivid-text").removeClass("d-selected-font");
    $(".harley-x440-denim-text").removeClass("d-selected-font");

    $(".harley-x440s-bottom-line").removeClass("d-none");
    $(".harley-x440-vivid-bottom-line").addClass("d-none");
    $(".harley-x440-denim-bottom-line").addClass("d-none");

    $(".harley-x440s-price-amount").removeClass("d-none");
    $(".harley-x440-vivid-price-amount").addClass("d-none");
    $(".harley-x440-denim-price-amount").addClass("d-none");

    $(".harley-x440s-price-variant").removeClass("d-none");
    $(".harley-x440-vivid-price-variant").addClass("d-none");
    $(".harley-x440-denim-price-variant").addClass("d-none");
    topVariant360LineHandler();
  }

  //show x440 vivid variant details
  function showX440VividVariant() {
    $(".harley-x440s-bike-360-view").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_red_bike_img").removeClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_silver_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_denim_bike_img").addClass("bike-switch-fade-out-transition");

    // $(".harley-bike-color-variant-wrapper").removeClass("d-opacity");

    $(".red-check-icon").removeClass("d-none");
    $(".silver-check-icon").addClass("d-none");

    $(".harley-bike-black-color-text").addClass("d-none");
    $(".harley-bike-red-color-text").removeClass("d-none");
    $(".harley-bike-silver-color-text").addClass("d-none");
    $(".harley-bike-denim-color-text").addClass("d-none");

    $(".harley-bike-black-color-option").addClass("d-none");
    $(".harley-bike-red-color-option").removeClass("d-none");
    $(".harley-bike-silver-color-option").removeClass("d-none");
    $(".harley-bike-denim-color-option").addClass("d-none");

    $(".harley-x440s-variant-img-wrapper").removeClass("d-selected-bike");
    $(".harley-x440-vivid-variant-img-wrapper").addClass("d-selected-bike");
    $(".harley-x440-denim-variant-img-wrapper").removeClass("d-selected-bike");

    $(".harley-x440s-text").removeClass("d-selected-font");
    $(".harley-x440-vivid-text").addClass("d-selected-font");
    $(".harley-x440-denim-text").removeClass("d-selected-font");

    $(".harley-x440s-bottom-line").addClass("d-none");
    $(".harley-x440-vivid-bottom-line").removeClass("d-none");
    $(".harley-x440-denim-bottom-line").addClass("d-none");

    $(".harley-x440s-360-icon").removeClass("d-selected-icon");

    $(".harley-x440s-price-amount").addClass("d-none");
    $(".harley-x440-vivid-price-amount").removeClass("d-none");
    $(".harley-x440-denim-price-amount").addClass("d-none");

    $(".harley-x440s-price-variant").addClass("d-none");
    $(".harley-x440-vivid-price-variant").removeClass("d-none");
    $(".harley-x440-denim-price-variant").addClass("d-none");

    vivid360LineHandler();
  }

  //show x440 denim variant details
  function showX440DenimVariant() {
    $(".harley-x440s-bike-360-view").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_red_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_silver_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_denim_bike_img").removeClass("bike-switch-fade-out-transition");

    // $(".harley-bike-color-variant-wrapper").addClass("d-opacity");

    $(".harley-bike-black-color-text").addClass("d-none");
    $(".harley-bike-red-color-text").addClass("d-none");
    $(".harley-bike-silver-color-text").addClass("d-none");
    $(".harley-bike-denim-color-text").removeClass("d-none");

    $(".harley-bike-black-color-option").addClass("d-none");
    $(".harley-bike-red-color-option").addClass("d-none");
    $(".harley-bike-silver-color-option").addClass("d-none");
    $(".harley-bike-denim-color-option").removeClass("d-none");

    $(".harley-x440s-variant-img-wrapper").removeClass("d-selected-bike");
    $(".harley-x440-vivid-variant-img-wrapper").removeClass("d-selected-bike");
    $(".harley-x440-denim-variant-img-wrapper").addClass("d-selected-bike");

    $(".harley-x440s-text").removeClass("d-selected-font");
    $(".harley-x440-vivid-text").removeClass("d-selected-font");
    $(".harley-x440-denim-text").addClass("d-selected-font");

    $(".harley-x440s-bottom-line").addClass("d-none");
    $(".harley-x440-vivid-bottom-line").addClass("d-none");
    $(".harley-x440-denim-bottom-line").removeClass("d-none");

    $(".harley-x440s-360-icon").removeClass("d-selected-icon");

    $(".harley-x440s-price-amount").addClass("d-none");
    $(".harley-x440-vivid-price-amount").addClass("d-none");
    $(".harley-x440-denim-price-amount").removeClass("d-none");

    $(".harley-x440s-price-variant").addClass("d-none");
    $(".harley-x440-vivid-price-variant").addClass("d-none");
    $(".harley-x440-denim-price-variant").removeClass("d-none");

    denimVariant360LineHandler();
  }

  function showX440VividRedVariant() {
    $(".harley-bike-black-color-text").addClass("d-none");
    $(".harley-bike-red-color-text").removeClass("d-none");
    $(".harley-bike-silver-color-text").addClass("d-none");
    $(".harley-bike-denim-color-text").addClass("d-none");

    $(".red-check-icon").removeClass("d-none");
    $(".silver-check-icon").addClass("d-none");

    $(".harley-x440s-bike-360-view").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_red_bike_img").removeClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_silver_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_denim_bike_img").addClass("bike-switch-fade-out-transition");

    vivid360LineHandler();
  }

  function showX440VividSilverVariant() {
    $(".harley-bike-black-color-text").addClass("d-none");
    $(".harley-bike-red-color-text").addClass("d-none");
    $(".harley-bike-silver-color-text").removeClass("d-none");
    $(".harley-bike-denim-color-text").addClass("d-none");

    $(".red-check-icon").addClass("d-none");
    $(".silver-check-icon").removeClass("d-none");

    $(".harley-x440s-bike-360-view").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_red_bike_img").addClass("bike-switch-fade-out-transition");
    $(".harley_x440_vivid_silver_bike_img").removeClass("bike-switch-fade-out-transition");
    $(".harley_x440_denim_bike_img").addClass("bike-switch-fade-out-transition");

    if ($(".harley_x440_vivid_silver_bike_img").data("360-view")) {
      add360CurvedLine();
    } else {
      remove360CurvedLine();
    }
  }

  // dropdown toggle functionality
  $(".dropdown-inner-content-wrapper").click(function () {
    $(".dropdown-popup-wrapper").toggle();
    $(".dropdown-inner-content-icon-wrapper img").toggle();

    $(".popup-background-blur").toggleClass("d-popup-blur");
    $(".dropdown-title").toggleClass("d-color-white");
  });

  // dropdown selection functionality

  // on selecting x440s
  $(".dropdown-x440s-wrapper").click(function () {
    topVariantClickHandler();

    $(".dropdown-x440s-wrapper").addClass("d-selected-dropdown");
    $(".dropdown-x440-vivid-wrapper").removeClass("d-selected-dropdown");
    $(".dropdown-x440-denim-wrapper").removeClass("d-selected-dropdown");

    $(".dropdown-x440s-color").addClass("d-selected-trinidad");
    $(".dropdown-x440-vivid-color").removeClass("d-selected-trinidad");
    $(".dropdown-x440-denim-color").removeClass("d-selected-trinidad");

    $(".dropdown-x440s-content-text").addClass("d-selected-black");
    $(".dropdown-x440-vivid-content-text").removeClass("d-selected-black");
    $(".dropdown-x440-denim-content-text").removeClass("d-selected-black");

    $(".dropdown-x440s-text").removeClass("d-none");
    $(".dropdown-x440-vivid-text").addClass("d-none");
    $(".dropdown-x440-denim-text").addClass("d-none");

    $(".dropdown-popup-wrapper").toggle();
    $(".dropdown-inner-content-icon-wrapper img").toggle();

    $(".popup-background-blur").removeClass("d-popup-blur");
    $(".dropdown-title").removeClass("d-color-white");

    topVariant360LineHandler();
  });

  // on selecting x440 vivid
  $(".dropdown-x440-vivid-wrapper").click(function () {
    vividVariantClickHandler();

    $(".dropdown-x440s-wrapper").removeClass("d-selected-dropdown");
    $(".dropdown-x440-vivid-wrapper").addClass("d-selected-dropdown");
    $(".dropdown-x440-denim-wrapper").removeClass("d-selected-dropdown");

    $(".dropdown-x440s-color").removeClass("d-selected-trinidad");
    $(".dropdown-x440-vivid-color").addClass("d-selected-trinidad");
    $(".dropdown-x440-denim-color").removeClass("d-selected-trinidad");

    $(".dropdown-x440s-content-text").removeClass("d-selected-black");
    $(".dropdown-x440-vivid-content-text").addClass("d-selected-black");
    $(".dropdown-x440-denim-content-text").removeClass("d-selected-black");

    $(".dropdown-x440s-text").addClass("d-none");
    $(".dropdown-x440-vivid-text").removeClass("d-none");
    $(".dropdown-x440-denim-text").addClass("d-none");

    $(".dropdown-popup-wrapper").toggle();
    $(".dropdown-inner-content-icon-wrapper img").toggle();

    $(".popup-background-blur").removeClass("d-popup-blur");
    $(".dropdown-title").removeClass("d-color-white");

    vivid360LineHandler();
  });

  // on selecting x440 denim
  $(".dropdown-x440-denim-wrapper").click(function () {
    denimVariantClickHandler();

    $(".dropdown-x440s-wrapper").removeClass("d-selected-dropdown");
    $(".dropdown-x440-vivid-wrapper").removeClass("d-selected-dropdown");
    $(".dropdown-x440-denim-wrapper").addClass("d-selected-dropdown");

    $(".dropdown-x440s-color").removeClass("d-selected-trinidad");
    $(".dropdown-x440-vivid-color").removeClass("d-selected-trinidad");
    $(".dropdown-x440-denim-color").addClass("d-selected-trinidad");

    $(".dropdown-x440s-content-text").removeClass("d-selected-black");
    $(".dropdown-x440-vivid-content-text").removeClass("d-selected-black");
    $(".dropdown-x440-denim-content-text").addClass("d-selected-black");

    $(".dropdown-x440s-text").addClass("d-none");
    $(".dropdown-x440-vivid-text").addClass("d-none");
    $(".dropdown-x440-denim-text").removeClass("d-none");

    $(".dropdown-popup-wrapper").toggle();
    $(".dropdown-inner-content-icon-wrapper img").toggle();

    $(".popup-background-blur").removeClass("d-popup-blur");
    $(".dropdown-title").removeClass("d-color-white");

    denimVariant360LineHandler();
  });

  function destroy360Loaders() {
    $current360ViewContainer && $current360ViewContainer.destroy();
  }

  function remove360CurvedLine() {
    $(".harley-x440-360-circle-wrapper").addClass("d-opacity");
    $(".harley-x440-360-icon-wrapper").addClass("d-opacity");
    $(".harley-x440-360-text-wrapper").addClass("d-opacity");
  }

  function add360CurvedLine() {
    $(".harley-x440-360-circle-wrapper").removeClass("d-opacity");
    $(".harley-x440-360-icon-wrapper").removeClass("d-opacity");
    $(".harley-x440-360-text-wrapper").removeClass("d-opacity");
  }

  function topVariantClickHandler() {
    destroy360Loaders();
    showX440sVariant();
    $current360ViewContainer = $(".variant-x440-360-view");
    $current360ViewContainer.j360();
  }

  function vividVariantClickHandler() {
    destroy360Loaders();
    showX440VividVariant();
    $current360ViewContainer = $(".variant-vivid-red-360-view");
    $current360ViewContainer.j360();
  }

  function denimVariantClickHandler() {
    destroy360Loaders();
    showX440DenimVariant();
    $current360ViewContainer = $(".variant-denim-360-view");
    $current360ViewContainer.j360();
  }

  function topVariant360LineHandler() {
    if (
      $(".harley-x440s-bike-360-view, .dropdown-x440s-wrapper").data("360-view")
    ) {
      add360CurvedLine();
    } else {
      remove360CurvedLine();
    }
  }
  function vivid360LineHandler() {
    if (
      $(".harley_x440_vivid_red_bike_img, .dropdown-x440-vivid-wrapper").data(
        "360-view"
      )
    ) {
      add360CurvedLine();
    } else {
      remove360CurvedLine();
    }
  }
  function denimVariant360LineHandler() {
    if (
      $(".harley_x440_denim_bike_img, .dropdown-x440-denim-wrapper").data(
        "360-view"
      )
    ) {
      add360CurvedLine();
    } else {
      remove360CurvedLine();
    }
  }

  function highlight360Icon(_this) {
    $(".harley-x440s-360-icon").removeClass("d-selected-icon");
    _this
      .siblings(".harley-x440s-360-icon-wrapper")
      .children("img")
      .addClass("d-selected-icon");
  }

  function setDefaultState() {
    topVariant360LineHandler();
    current360ViewContainer = $(".harley-x440s-variant-img-wrapper");
    highlight360Icon(current360ViewContainer);
  }
  
  // for loading 360 view of bike
  if ($(".harley-x440s-bike-360-view").data("360-view")) {
    $current360ViewContainer = $(".variant-x440-360-view");
    $current360ViewContainer.j360();
  }
});
