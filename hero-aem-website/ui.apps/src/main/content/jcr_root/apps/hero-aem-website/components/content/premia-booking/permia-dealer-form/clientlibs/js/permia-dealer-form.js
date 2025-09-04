$(document).ready(function () {
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

  let form = $(
    ".premia-dealer-container .premia-dealer-form-container .premia-dealer-form-fields"
  );
  let statelist = form
    .find('[name="statename"]')
    .parents(".cust-drop-down")
    .find(".cust-dropdown-menu ");
  if ($(".premia-dealer-container .premia-dealer-form-container").length > 0) {
    populateHarleyDropdown(
      defaultservlet + ".harleystates.html",
      statelist,
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
            let abbrDealer;
            abbrCity = cityField.attr("data-default-label");
            abbrDealer = dealerField.attr("data-default-label");
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

  $(".premia-dealer-container .cust-dropdown-menu").on(
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
      let harleyvariantChecked = $("#variant-container input[type=radio]").is(
        ":checked"
      );
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
          if (!harleyvariantChecked) {
            disableProgress();
            $("#dealer-form-continue").attr("disabled", "true");
            $("#hd-bsn").css("bottom", "-100%");
            $(".variant-wrapper").removeClass("active-container");
          } else {
            dealerPro.addClass("active");
            dealerPro.children().eq(0).addClass("dealer");
            dealerPro.children().eq(0).removeClass("dealer-active");
            dealerPro.children().eq(0).removeClass("dealer-disabled");
            cardPro.removeClass("active");
            cardPro.children().eq(0).removeClass("card");
            cardPro.children().eq(0).addClass("card-disabled");
            if (progressBar) progressBar.style.width = `50%`;
          }

          form.find('[name="stateNameVal"]').val(button.text());
          form.find('[name="cityNameVal"]').val("");
          $(".dealer-locator-wrapper").removeClass("active-container");
          $("#dealer-form-continue").attr("disabled", "true");
          $("#footer-dealer-heading").addClass("d-none");
          $("#dealer-locator-container  .custom-radio").removeClass(
            "radio-selected-dealer"
          );
          $("#stateDropdown").html($(this).attr("value"));
          $("#dealer-locator-container input[type=radio]").prop(
            "checked",
            false
          );
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
        let cityName = $(this).attr("value");
        var variantName =
          defaultservlet +
          ".harleypricedata." +
          stateName +
          "." +
          $(this).attr("value") +
          ".html";
        let selectedCity = $(this).text() && $(this).text().trim();
        if (selectedCity != dropdownText) {
          $(".variant-wrapper").addClass("active-container");
          $(".dealer-locator-wrapper").removeClass("active-container");
          $("#dealer-locator-container input[type=radio]").prop(
            "checked",
            false
          );
          $("#dealer-form-continue").attr("disabled", "true");
          if (!harleyvariantChecked) {
            $("#hd-bsn").css("bottom", "-100%");
            disableProgress();
            variantPro.addClass("active");
            variantPro.children().eq(0).removeClass("variant-disabled");
            variantPro.children().eq(0).addClass("variant");
            $("#premia-dealer-variant .premia-dealer-form-wrapper").animate({
              scrollTop: $(".variant-wrapper .dealer-wrapper").offset().top,
            });
            if (windowsize < 769) {
              $("html,body").animate({
                scrollTop:
                  $(".variant-wrapper .dealer-wrapper").offset().top - 57,
              });
            }
          } else {
            dealerPro.addClass("active");
            dealerPro.children().eq(0).addClass("dealer");
            dealerPro.children().eq(0).removeClass("dealer-active");
            dealerPro.children().eq(0).removeClass("dealer-disabled");
            cardPro.removeClass("active");
            cardPro.children().eq(0).removeClass("card");
            cardPro.children().eq(0).addClass("card-disabled");
            $("#premia-dealer-variant .premia-dealer-form-wrapper").animate({
              scrollTop: $(".dealer-locator-wrapper .dealer-wrapper").offset()
                .top,
            });
            if (windowsize < 769) {
              $("html,body").animate({
                scrollTop:
                  $(".dealer-locator-wrapper .dealer-wrapper").offset().top -
                  57,
              });
            }
          }
          if (progressBar) progressBar.style.width = `50%`;
          variantChecked = true;
          if (!servletCall) {
            fetch(variantName)
              .then(function (response) {
                if (!response.ok) {
                  // make the promise be rejected if we didn't get a 2xx response
                  throw new Error("Not 2xx response", { cause: response });
                } else {
                  return response.text();
                }
              })
              .then(function (html) {
                harleyVariant(html, variantChecked);
              });
          } else {
            harleyVariant(null, variantChecked, stateName);
          }
          dealerLocator(
            variantChecked,
            stateName,
            cityName,
            harleyvariantChecked
          );
        }
        form.find('[name="cityNameVal"]').val(button.text());
        $("#cityDropdown").html(button.text().replace(/(<([^>]+)>)/gi, ""));
      }
    }
  );

  $("#slide-button").click(function () {
    $("#hd-bsn").toggleClass("slideup").toggleClass("bottom-fix");
  });

  $("#dealer-form-continue").on("click", function () {
    $("#premia-dealer-variant").addClass("d-none");
    $("#hd-bsn").addClass("d-none");
    $("#booking__section").removeClass("d-none");

    let cityValue = $('.permia-dropdown-state-city [name="cityNameVal"]')
      .parent()
      .find("li.active")
      .attr("value");
    if (cityValue) {
      $(`#harley__campaign .cust-drop-down li[value=${cityValue}]`).trigger(
        "click"
      );
      paynowform();
    }
  });

  $(".dealer__wrap--right").on("click", function () {
    $("#booking__section").addClass("d-none");
    $("#premia-dealer-variant").removeClass("d-none");
    $("#hd-bsn").removeClass("d-none");
  });

  function disableProgress() {
    if (progressBar) progressBar.style.width = "0%";
    stepContainer &&
      stepContainer.forEach((e) => {
        e.className = `step-container`;
        e.firstElementChild.className = `circle icon ${e.getAttribute(
          "id"
        )}-disabled`;
      });
  }

  function harleyVariant(html) {
    if (html) {
      $("#variant-container").html(html);
    }
    $("#variant-container input[type=radio]").on("change", function () {
      $(".custom-control").removeClass("radio-selected");
      $(this).parent().addClass("radio-selected");
      variantPro.addClass("active");
      variantPro.children().eq(0).removeClass("variant");
      variantPro.children().eq(0).addClass("variant-active");

      dealerPro.addClass("active");
      dealerPro.children().eq(0).removeClass("dealer-disabled");
      dealerPro.children().eq(0).addClass("dealer");

      $("#hd-bsn").css("bottom", "0");
      let price = $(".radio-selected .bike-variant-price").text();
      $("#harley__campaign .showroom--price").text(price);
      $("#exshowroomprice").val(price);

      let footerVariantHeading = $(
        "#variant-container .radio-selected .bike-variant-label"
      ).html();

      let mcode = $(
        "#variant-container .radio-selected .bike-variant-label"
      ).data("mcode");

      let footerVariantHeadingForNext = footerVariantHeading.trim();

      var varientContent = $(`<div>${footerVariantHeadingForNext}</div>`)
        .find("span:first")
        .text();
      var colorContent = $(`<div>${footerVariantHeadingForNext}</div>`)
        .find("span:eq(1)")
        .text();

      if (/\(.*\)/.test(colorContent)) {
        colorContent = colorContent.replace(/[\(\)]/g, "");
      }

      $("#varient span").text(varientContent);
      $("#color span").text(colorContent);

      $("#bikevariant").val(varientContent);
      $("#bikecolor").val(colorContent);
      $("#mcode").val(mcode);

      $("#footer-variant-heading .content-desc").html(footerVariantHeading);
      $(".dealer-locator-wrapper").addClass("active-container");
      $("#premia-dealer-variant .premia-dealer-form-wrapper").animate({
        scrollTop: $(".dealer-locator-wrapper .dealer-wrapper").offset().top,
      });
      if (windowsize < 769) {
        $("html,body").animate({
          scrollTop:
            $(".dealer-locator-wrapper .dealer-wrapper").offset().top - 57,
        });
      }

      showSelectedVariantImg($(this).data("index"));
    });
  }

  function showSelectedVariantImg(index) {
    $(".premia-dealer-carousel-container").addClass("variant-selected");
    $(".premia-dealer-carousel-container > div")
      .removeClass("selected-variant")
      .eq(index - 1)
      .addClass("selected-variant");
  }

  function dealerLocator(
    variantChecked,
    stateName,
    cityName,
    harleyvariantChecked
  ) {
    let selectedCity = cityName.replace(" ", "_");
    var dealerName =
      defaultservlet +
      ".harleydealersdata." +
      stateName +
      "." +
      selectedCity +
      ".html";
    if (harleyvariantChecked) {
      $(".dealer-locator-wrapper").addClass("active-container");
    }

    if (variantChecked) {
      $("#footer-dealer-heading").addClass("d-none");
      fetch(dealerName)
        .then(function (response) {
          if (!response.ok) {
            // make the promise be rejected if we didn't get a 2xx response
            throw new Error("Not 2xx response", {
              cause: response,
            });
          } else {
            return response.text();
          }
        })
        .then(function (html) {
          variantChecked = false;
          $("#dealer-locator-container").html(html);
          $("#dealer-locator-container input[type=radio]").on(
            "change",
            function () {
              $("#dealer-form-continue").removeAttr("disabled");
              $(".custom-control").removeClass("radio-selected-dealer");
              $(this).parent().addClass("radio-selected-dealer");

              dealerPro.addClass("active");
              dealerPro.children().eq(0).removeClass("dealer");
              dealerPro.children().eq(0).addClass("dealer-active");
              if (progressBar) progressBar.style.width = `100%`;

              cardPro.addClass("active");
              cardPro.children().eq(0).removeClass("card-disabled");
              cardPro.children().eq(0).addClass("card");
              $("#footer-dealer-heading").removeClass("d-none");
              let footerDealerHeading = $(
                "#dealer-locator-container .radio-selected-dealer .dealer-locator-label"
              ).text();
              $("h6#dealer").text(footerDealerHeading);
              $("#footer-dealer-heading .content-desc").html(
                footerDealerHeading
              );
              let dealerCode = $(
                "#dealer-locator-container .radio-selected-dealer input"
              ).data("dealer-code");
              $("#dealer_code_value").val(dealerCode);
            }
          );
        });
    }
  }
});
