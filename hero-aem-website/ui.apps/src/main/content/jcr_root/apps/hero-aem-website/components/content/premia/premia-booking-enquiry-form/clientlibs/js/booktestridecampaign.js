$(document).ready(function () {
  $('.mobile-number').on('keyup', function () {
    if ($(this).val().length == 10) {
      $(this).parent('.cust-form-group').find('.otp-link').addClass('show');
    }
  });
  $('.sent-otp').on('click', function () {
    $('.resent-otp').addClass('show');
  });

  $('.campaign-right-content .campaign-dropdown .dropdown-content').on('click', function () {
    event.preventDefault();
    var getValue = $(this).text();
    $(this).parents('.select-dropdown').find('.btn-drop ').text(getValue);

  });

  $('.btn-drop-v1 .dropdown-content').on('click', function () {
    $(this).parents('.btn-drop-v1').find('.btn-drop').addClass('active');
  })

  $("#harleyRequestCallBack").on("hidden.bs.modal", function () {
    $("#book-test-drive-form2").trigger('reset');
  });


  //state and city

  $("#state-city-acc").removeClass("accordion-disabled");
  if ($("#premia-booking-acc").length > 0) {
    $(".accordion--title").click(function (e) {
      let dropDown = $(this)
        .closest(".accordion-card")
        .find(".accordion--panel");
      $(this)
        .closest(".premia-booking-accordion")
        .find(".accordion--panel")
        .not(dropDown)
        .slideUp();
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(this)
          .closest(".premia-booking-accordion")
          .find(".accordion--title.active")
          .removeClass("active");
        $(this).addClass("active");
      }
      dropDown.stop(false, true).slideToggle();
      e.preventDefault();
    });
    $(".accordion--title ").first().click();
  }

  const stepContainer = document.querySelectorAll(".step-container");
  // let defaultservlet = "/content/hero-aem-website/in/en-in/homepage";
  let defaultservlet = $("#defaultservlet").val();
  let variantPro = $("#variant");
  let dealerPro = $("#dealer");
  let cardPro = $("#card");
  const servletCall = $("#variant-container").hasClass("no-servlet-call");
  let progressBar = document.querySelector(".indicator");
  let currentStep = 1;
  let variantChecked = false;
  let windowsize = $(window).width();
  const progress = ((currentStep - 1) / (stepContainer.length - 1)) * 100;
  let progressBarFullWidth = dealerPro
    .children()
    .eq(0)
    .hasClass("dealer-active");
  if (progressBar && !progressBarFullWidth)
    progressBar.style.width = `${progress}%`;

  let form = $("#premia-booking-acc .premia-accordion-container");
  let modalForm = $('.premia-booking-enquiry-form #book-test-drive-form2')
  let statelist = form
    .find('[name="statename"]')
    .parents(".cust-drop-down")
    .find(".cust-dropdown-menu ");

    let statelistmodal = modalForm
    .find('[name="statename"]')
    .parents(".cust-drop-down")
    .find(".cust-dropdown-menu ");
    
  if ($("#premia-booking-acc .premia-accordion-container").length > 0) {
    populateHarleyDropdown(
      defaultservlet + ".harleystates.html",
      statelist,
      "state",
      null
    );
  }

  if ($(".premia-booking-enquiry-form #book-test-drive-form2").length > 0) {
    populateHarleyDropdown(
      defaultservlet + ".harleystates.html",
      statelistmodal,
      "state",
      null
    );
  }

  function sortAscending(a, b) {
    return $(b).text().toUpperCase() < $(a).text().toUpperCase() ? 1 : -1;
  }

  function populateHarleyDropdown(url, selector, keyword, selectedVal) {
    if (url && selector[0] !== undefined) {
      fetch(url)
        .then(function (response) {
          if (!response.ok) {
            // make the promise be rejected if we didn't get a 2xx response
            throw new Error("Not 2xx response", { cause: response });
          } else {
            return response.text();
          }
        })
        .then(function (html) {
          selector[0].innerHTML = html;
          let form = $(selector).closest("form");
          if (keyword == "state") {
            //sort in ascending order
            form
              .find('[name="statename"]')
              .parents(".cust-drop-down")
              .find(".cust-dropdown-menu li")
              .sort(sortAscending)
              .appendTo(
                form
                  .find('[name="statename"]')
                  .parents(".cust-drop-down")
                  .find(".cust-dropdown-menu")
                  .sort(sortAscending)
              );
            let state;
            let abbrState = form
              .find('[name="statename"]')
              .attr("data-default-label");
            if (selectedVal) {
              if (
                $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value")
              ) {
                state = $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value");
                abbrState = selectedVal;
                form.find('[name="stateNameVal"]').val(selectedVal);
              }
            }
            form.find('[name="statename"]').text(abbrState);
            let cityField = form.find('[name="cityname"]');
            let cityValue =
              null != (window && window.locations) ? locations.City : "";
            if (
              cityField.text().trim() !== cityField.attr("data-default-label")
            ) {
              cityValue = cityField.text().trim();
            }
            let citylist = cityField
              .parents(".cust-drop-down")
              .find(".cust-dropdown-menu ");
            if (state) {
              cityField[0].disabled = false;
              populateDropdown(
                url.substr(0, url.indexOf(".")) +
                  ".citylist." +
                  state +
                  ".html",
                citylist,
                "city",
                cityValue
              );
            } else {
              cityField[0].disabled = true;
              cityField.text(
                form.find('[name="cityname"]').attr("data-default-label")
              );
              let dealerField = form.find('[name="dealername"]');
              dealerField[0].disabled = true;
              dealerField.text(
                form.find('[name="dealername"]').attr("data-default-label")
              );
            }
          }
          if (keyword == "city") {
            //sort in ascending order
            let cityField = form.find('[name="cityname"]');
            let dealerField = form.find('[name="dealername"]');
            cityField[0].disabled = false;
            cityField
              .parents(".cust-drop-down")
              .find(".cust-dropdown-menu li")
              .sort(sortAscending)
              .appendTo(
                cityField.parents(".cust-drop-down").find(".cust-dropdown-menu")
              );
            let abbrCity;
            abbrCity = cityField.attr("data-default-label");
            if (selectedVal) {
              if (
                $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value")
              ) {
                abbrCity = $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value");
                abbrCity = selectedVal;
                form.find('[name="cityNameVal"]').val(selectedVal);
                abbrDealer = dealerField.text().trim();
                form
                  .find('[name="dealerNameVal"]')
                  .val(form.find('[name="dealerNameVal"]').val());
              }
            }
            cityField.text(abbrCity);
            if (abbrDealer == dealerField.attr("data-default-label")) {
              dealerField[0].disabled = true;
              form.find('[name="dealerNameVal"]').val("");
            }
            dealerField.text(abbrDealer);
          }
        })
        .catch(function (err) {
          console.warn("Something went wrong.", err);
        });
    }
  }

  $("#book-test-drive-form2 .cust-dropdown-menu").on(
    "click",
    "li",
    function () {
      let selectionGroup = $(this).parents(".cust-drop-down");
      var button = selectionGroup.find(".dropdown-select");
      let dropdownText = button.text();
      button.text($(this).find("a")[0].innerHTML.replaceAll("&amp;", "&"));
      var form = $(this).closest("form");
      selectionGroup.find(".cust-dropdown-menu li").removeClass("active");
      $(this).addClass("active");
      if ("statename" == button.attr("name")) {
        let cityField = form.find('[name="cityname"]');
        let list = cityField
          .parents(".cust-drop-down")
          .find(".cust-dropdown-menu ");
        stateName = $(this).attr("value");
        let cityPath =
          defaultservlet + ".harleycities." + $(this).attr("value") + ".html";

        let cityValue;
        if (cityField.text().trim() !== cityField.attr("data-default-label")) {
          cityValue = cityField.text().trim();
        }
        let selectedState = $(this).text() && $(this).text().trim();
        populateHarleyDropdown(cityPath, list, "city", cityValue, true);
        if (selectedState != dropdownText) {
          form.find('[name="stateNameVal"]').val(button.text());
          form.find('[name="cityNameVal"]').val("");
          $("#stateDropdown2").html(selectedState);
          let stateValue = $(
            '.permia-dropdown-state-city [name="stateNameVal"]'
          )
            .parent()
            .find("li.active")
            .attr("value");
          if (stateValue) {
            $(
              `#harley__campaign .cust-drop-down li[value=${stateValue}]`
            ).trigger("click");
            $('#harley__campaign [name="statename"]').attr("disabled", "true");
          }
        }
      } else if ("cityname" == button.attr("name")) {
        form.find('[name="cityNameVal"]').val(button.text());
        $("#cityDropdown2").html(button.text().replace(/(<([^>]+)>)/gi, ""));
      }
    }
  );

})
