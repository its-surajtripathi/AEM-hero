$(document).ready(function () {
  let jsonObj = {};
  let ownerManualFolder = $('#owners-manual').data('ownerfolder')
  let ownerManualFolderImages = $('#owners-manual').data('ownerfolderimages')
  $("#manual--form-wrap .cust-dropdown-menu").on(
    "click",
    "li",
    function () {
      if ($('.owners-manual-bottom-wrap').is(':visible')) {
        $('.owners-manual-bottom-wrap').addClass('d-none');
      }
      let selectionGroup = $(this).parents(".cust-drop-down");
      let button = selectionGroup.find(".dropdown-select");
      button.text($(this).find('a')[0].innerHTML.replaceAll('&amp;', '&'));
      selectionGroup.find(".cust-dropdown-menu li").removeClass("active");
      $(this).parents("ul").siblings(".btn-drop").addClass("active");
      $(this).addClass("active");
      if ("emmision" === button.attr("name")) {
        let emmisionNameVal = $(this).text();
        if (emmisionNameVal == "BS IV & Earlier") {
          $('.owners-manual-bottom-wrap .product-img-wrap').addClass('d-none');
          $('#manual-section-mobile .content-wrap-top img').addClass('d-none');
        }
        else {
          $('.owners-manual-bottom-wrap .product-img-wrap').removeClass('d-none');
          $('#manual-section-mobile .content-wrap-top img').removeClass('d-none');
        }
        let categoryNameVal = $('[name="categoryNameVal"]').val()
        $('[name="emmisionsNameVal"]').val($(this).text());
        $('[name="category"]').prop("disabled", false);
        generateModelDropdown(jsonObj, emmisionNameVal, categoryNameVal);

        $('#manual-search-btn').addClass('btn-disabled');
        if ($('[name="category"]').hasClass('active')) {
          $('[name="category"]').removeClass('active');
          $('[name="category"]').text("Select Your Category");
          $('[name="categoryModelNameVal"]').val('')
        }

        if ($('[name="vehicle-model"]').hasClass('active')) {
          $('[name="vehicle-model"]').prop("disabled", true);
          $('[name="vehicle-model"]').removeClass('active');
          $('[name="vehicle-model"]').text("Select Your Vehicle Model");
          $('[name="vehicleModelNameVal"]').val('')
        }

        if ($('[name="year"]').hasClass('active')) {
          $('[name="year"]').prop("disabled", true);
          $('[name="year"]').removeClass('active');
          $('[name="year"]').text("Select Year");
          $('[name="yearModelNameVal"]').val('')
        }

        if ($('[name="month"]').hasClass('active')) {
          $('[name="month"]').prop("disabled", true);
          $('[name="month"]').removeClass('active');
          $('[name="month"]').text("Select Month");
          $('[name="monthNameVal"]').val('')
        }
      }
      else if ("category" == button.attr("name")) {
        let categoryNameVal = $(this).text();
        $('[name="categoryNameVal"]').val(categoryNameVal);
        $("#model-dropdown").empty();
        let emmisionNameVal = $('[name="emmisionsNameVal"]').val();
        $('[name="vehicle-model"]').prop("disabled", false);
        generateModelDropdown(jsonObj, emmisionNameVal, categoryNameVal);

        $('#manual-search-btn').addClass('btn-disabled');
        if ($('[name="vehicle-model"]').hasClass('active')) {
          $('[name="vehicle-model"]').removeClass('active');
          $('[name="vehicle-model"]').text("Select Your Vehicle Model");
          $('[name="vehicleModelNameVal"]').val('')
        }

        if ($('[name="year"]').hasClass('active')) {
          $('[name="year"]').prop("disabled", true);
          $('[name="year"]').removeClass('active');
          $('[name="year"]').text("Select Year");
          $('[name="yearModelNameVal"]').val('')
        }

        if ($('[name="month"]').hasClass('active')) {
          $('[name="month"]').prop("disabled", true);
          $('[name="month"]').removeClass('active');
          $('[name="month"]').text("Select Month");
          $('[name="monthNameVal"]').val('')
        }

      }
      else if ("vehicle-model" == button.attr("name")) {
        let vehicleNameVal = $(this).text();
        $('[name="vehicleModelNameVal"]').val(vehicleNameVal);
        $('[name="year"]').prop("disabled", false);
        generateYearDropdown(jsonObj, vehicleNameVal);
      }
      else if ("year" == button.attr("name")) {
        let yearNameVal = $(this).text();
        let vehicleModelNameVal = $('[name="vehicleModelNameVal"]').val();
        $('[name="yearModelNameVal"]').val(yearNameVal);
        $('[name="month"]').prop("disabled", false);
        generateMonthDropdown(jsonObj, yearNameVal, vehicleModelNameVal);
      }
      else if ("month" == button.attr("name")) {
        let monthVal = $(this).text();
        $('[name="monthNameVal"]').val(monthVal);
        $('#manual-search-btn').removeClass("btn-disabled")
      }
    })

  function getData() {
    let jsonData = $('#owners-manual').data('ownersmanual');
    if (typeof jsonData != "object") {
      jsonObj = $.parseJSON(jsonData);
    } else {
      jsonObj = jsonData
    }

    // Generate emmissions dropdown
    let uniqueStatus = [...new Set(jsonObj.map(item => item.Model_Status))];
    generateDropDown(uniqueStatus, 'emission-dropdown');

    // Generate categories dropdown
    let uniqueCategories = [...new Set(jsonObj.map(item => item.Category))];
    generateDropDown(uniqueCategories, 'category-dropdown');

  }

  function generateDropDown(uniqueValues, dropdownId, selectedValue = null) {
    let listItems = uniqueValues.map(value => {
      let activeClass = selectedValue && value == selectedValue ? "active" : "";
      return '<li class="font-montserrat-regular font-weight-500 ' + activeClass + '"><a href="javascript:void(0)">' + value + '</a></li>';
    });
    $('#' + dropdownId).html(listItems.join(''));
  }

  function generateModelDropdown(jsonObj, emmisionNameVal, selectedCategory) {
    if (emmisionNameVal && selectedCategory) {
      let filteredModels = jsonObj.filter(item => item.Model_Status === emmisionNameVal && item.Category === selectedCategory);
      let uniqueModels = [...new Set(filteredModels.map(item => item.Model_Name))];
      generateDropDown(uniqueModels, 'vehicle-dropdown');
    }
  }

  function generateYearDropdown(jsonObj, selectedModel) {
    if (selectedModel) {
      let selectedEmission = $('[name="emmisionsNameVal"]').val();
      let filteredYears = jsonObj.filter(item => item.Model_Name === selectedModel && item.Model_Status === selectedEmission);
      let uniqueYears = [...new Set(filteredYears.map(item => item.Year))];
      let sortedYears = uniqueYears.sort().reverse();
      generateDropDown(sortedYears, 'year-dropdown');
    }
    $('#year-dropdown li:first-child').trigger('click');
  }

  function generateMonthDropdown(jsonObj, yearNameVal, vehicleModelNameVal) {
    if (yearNameVal && vehicleModelNameVal) {
      let filteredData = jsonObj.filter(item => item.Year === yearNameVal && item.Model_Name === vehicleModelNameVal);
      let uniqueMonths = [...new Set(filteredData.map(item => item.Month))];
      generateDropDown(uniqueMonths, 'month-dropdown');
    }
    $('#month-dropdown li:first-child').trigger('click');
  }

  $("#manual-search-btn").on("click", function (event) {
    if (!$('.owners-manual-bottom-wrap').is(':visible')) {
      $('.owners-manual-bottom-wrap').removeClass('d-none');
    }
    event.preventDefault();
    let selectedCategory = $('[name="categoryNameVal"]').val();
    let selectedEmission = $('[name="emmisionsNameVal"]').val();
    let selectedVehicleModel = $('[name="vehicleModelNameVal"]').val();
    let selectedYear = $('[name="yearModelNameVal"]').val();
    let selectedMonth = $('[name="monthNameVal"]').val();

    let filteredData = jsonObj.filter(
      (item) =>
        item.Category === selectedCategory &&
        item.Model_Status === selectedEmission &&
        item.Model_Name === selectedVehicleModel &&
        item.Year === selectedYear &&
        item.Month === selectedMonth
    );

    if (filteredData.length > 0) {
      let modelCategory = filteredData[0]["Model Category"];
      let englishVersion = filteredData[0]["English_Version"];
      let hindiVersion = filteredData[0]["Hindi_Version"];
      $('#manual-section-desktop .content--details h6').text(modelCategory);
      $('#manual-section-mobile .product--details-mob h6').text(modelCategory);
      filteredData[0]["Model_Image"] &&  $('#manual-section-desktop .product-img-wrap img').attr('src', `${ownerManualFolderImages}/${filteredData[0]["Model_Image"]}`)
      filteredData[0]["Model_Image"] &&  $('#manual-section-mobile .content-wrap-top img').attr('src', `${ownerManualFolderImages}/${filteredData[0]["Model_Image"]}`)
      $('#manual-section-desktop .download-tile').show();
      $('#manual-section-mobile .download-tile-mob').show();
      if (englishVersion == 'Not_Applicable' || englishVersion == 'To_be_shared_soon') {
        $('#manual-section-desktop .download-tile').eq(0).hide();
        $('#manual-section-desktop .download-tile').eq(0).find('a').attr('href', ownerManualFolder + '/' + hindiVersion);
        $('#manual-section-mobile .download-tile-mob').eq(0).hide();
        $('#manual-section-mobile .download-tile-mob').eq(0).find('a').attr('href', ownerManualFolder + '/' + hindiVersion)
      }
      else if (hindiVersion == 'Not_Applicable' || hindiVersion == 'To_be_shared_soon') {
        $('#manual-section-desktop .download-tile').eq(1).hide();
        $('#manual-section-desktop .download-tile').eq(0).find('a').attr('href', ownerManualFolder + '/' + englishVersion)
        $('#manual-section-mobile .download-tile-mob').eq(1).hide();
        $('#manual-section-mobile .download-tile-mob').eq(0).find('a').attr('href', ownerManualFolder + '/' + englishVersion)
      }
      else {
        $('#manual-section-desktop .download-tile').eq(0).find('a').attr('href', ownerManualFolder + '/' + englishVersion);
        $('#manual-section-desktop .download-tile').eq(1).find('a').attr('href', ownerManualFolder + '/' + hindiVersion);
        $('#manual-section-mobile .download-tile-mob').eq(0).find('a').attr('href', ownerManualFolder + '/' + englishVersion);
        $('#manual-section-mobile .download-tile-mob').eq(1).find('a').attr('href', ownerManualFolder + '/' + hindiVersion);
      }
    } else {
      $('.owners-manual-bottom-wrap').addClass('d-none');
    }
  });

  if ($('#owners-manual').length > 0) {
    getData();
  }
})
