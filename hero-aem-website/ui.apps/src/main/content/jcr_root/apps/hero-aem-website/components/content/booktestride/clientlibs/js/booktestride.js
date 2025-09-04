$(document).ready(function () {
  if (
    $(".book-test-drive-section").length > 0 ||
    $(".book-test-ride-campaign").length > 0
  ) {
    let popupEventSent = false;
    let bookRideEventSent = false;
    let defaultservlet = document.getElementById("defaultservlet").value;
    let stateName = "";
    let category = window.location.pathname.split("/")[2];
    let splitedUrl = window.location.origin.split("//");
    let splitedDomain = splitedUrl[1].split(".");
    let siteCategory;
    if (splitedDomain[1] === "heromotocorp") {
      siteCategory = "corporate";
    }
    if (splitedDomain[1] === "dealers") {
      siteCategory = "dealer";
    }
    function sendFormStartEvent(currentForm, inputElement) {
      if (window.digitalData && window._satellite) {
        window.digitalData = {
          form: {
            formname: currentForm.data("aa-formname"),
            formtype: currentForm.attr("id"),
            formfield: $(inputElement).find("input").attr("name"),
          },
          page: {
            siteType: "AEM",
            siteCategory: siteCategory,
            fullReferringUrl: document.referrer,
            pageName: pageTitle,
            pageUrl: window.location.href,
            path: window.location.pathname,
            category: category ? category : "",
          },
        };
        _satellite.track("formStart");
      }
    }

    if ($(".book-test-drive-section") && !$("#harleyRequestCallBack").length >0 ) {
      if (!sessionStorage.getItem("stateCityList")) {
        //let url = "/bin/statecitylist";
        let url = $('[name="statecitylist_url"]').val();
        if (url !== undefined) {
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
              let newList = JSON.parse(html);
              for (const key of Object.keys(newList)) {
                const capitalizedKey = key
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");
                const capitalizedValue = newList[key]
                  .split(" ")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(" ");

                delete newList[key];
                newList[capitalizedKey] = capitalizedValue;
              }
              sessionStorage.setItem("stateCityList", JSON.stringify(newList));
              $(".book-test-drive-form").each(function (item) {
                let statelist = $(this)
                  .find('[name="statename"]')
                  .parents(".cust-drop-down")
                  .find(".cust-dropdown-menu ");
                generateStateDropDown(statelist);
                customValidation($(this));
              });
            });
        }
      } else {
        $(".book-test-drive-form").each(function (item) {
          let statelist = $(this)
            .find('[name="statename"]')
            .parents(".cust-drop-down")
            .find(".cust-dropdown-menu ");
          generateStateDropDown(statelist);
          customValidation($(this));
        });
      }
    }

    function generateStateDropDown(selector) {
      let form = $(selector).closest("form");
      let stateList = form
        .find('[name="statename"]')
        .parents(".cust-drop-down")
        .find(".cust-dropdown-menu");

      form.find('[name="cityname"]').attr("disabled", true);

      let stateCityList = JSON.parse(sessionStorage.getItem("stateCityList"));

      Object.keys(stateCityList).forEach(function (stateName) {
        $("<li>")
          .addClass("font-montserrat-regular font-weight-500")
          .attr("value", stateName)
          .append($("<a>").attr("href", "javascript:void(0)").text(stateName))
          .appendTo(stateList);
      });
    }

    function populateCityDropdown(listSelector, selectedState, cityName) {
      if (cityName != "") {
        let form = $(listSelector).closest("form");
        let cityField = form.find('[name="cityname"]');
        cityField.text(
          form.find('[name="cityname"]').attr("data-default-label")
        );
      }

      if (listSelector[0] !== undefined) {
        let newList = JSON.parse(sessionStorage.getItem("stateCityList"));
        for (const key of Object.keys(newList)) {
          const capitalizedKey = key
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
          const capitalizedValue = newList[key]
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ");
          delete newList[key];
          newList[capitalizedKey] = capitalizedValue;
        }

        let cities = newList[selectedState];
        if (!cities) {
          throw new Error("Selected state not found in data");
        }

        listSelector.empty();
        var cityArray = cities.slice(1, -1).split(",");
        $.each(cityArray, function (index, city) {
          var newItem = document.createElement("li");
          newItem.innerHTML =
            "<a href=javascript:void(0)>" + city.trim() + "</a>";
          listSelector.append(newItem);
        });

        $('[name="cityname"]').removeAttr("disabled");
      }
    }

    function populateDropdown(url, selector, keyword, selectedVal) {
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
                $('.address-input').addClass('d-none');
                $('#harley__dealer--address').val('');
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
                  cityField
                    .parents(".cust-drop-down")
                    .find(".cust-dropdown-menu")
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
                $('.address-input').addClass('d-none');
                $('#harley__dealer--address').val('');
                form.find('[name="dealerNameVal"]').val("");
              }
              dealerField.text(abbrDealer);
            }
            if (keyword == "dealer") {
              //sort in ascending order
              let dealerField = form.find('[name="dealername"]');
              dealerField[0].disabled = false;
              // Removed Sorting When in Harley Campaign Else Sorts (For Dealers)
              if (!$('#harley__campaign').length) {
                dealerField
                  .parents(".cust-drop-down")
                  .find(".cust-dropdown-menu li")
                  .sort(sortAscending)
                  .appendTo(
                    dealerField
                      .parents(".cust-drop-down")
                      .find(".cust-dropdown-menu")
                  );
              }
              abbrDealer = dealerField.attr("data-default-label");
              if (
                selectedVal &&
                $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value")
              ) {
                abbrDealer = selectedVal;
                form
                  .find('[name="dealerNameVal"]')
                  .val(form.find('[name="dealerNameVal"]').val());
              } else {
                form.find('[name="dealerNameVal"]').val("");
                $('.address-input').addClass('d-none');
                $('#harley__dealer--address').val('');
              }
              dealerField.text(abbrDealer);
            }
          })
          .catch(function (err) {
            console.warn("Something went wrong.", err);
          });
      }
    }

    if ($(".book-test-drive-form") || $(".book-test-ride-campaign")) {
      if ($(".book-test-ride-campaign").length > 0) {
        customValidation($("#campaign-sub-form"));
        createCaptcha($("#campaign-sub-form"));
      } else {
        customValidation($(".book-test-drive-form"));
      }
      let form =
        $(".book-test-drive-form").length > 0
          ? $(".book-test-drive-form")
          : $(".book-test-ride-campaign");
      let statelist = form
        .find('[name="statename"]')
        .parents(".cust-drop-down")
        .find(".cust-dropdown-menu ");
      if ($(".book-test-ride-campaign").length > 0) {
        if ($('.campaign-container #harley__campaign').length > 0) {
          populateDropdown(
            defaultservlet + ".harleystates.html",
            statelist,
            "state",
            window && window.locations ? locations.State : null,
            false
          );
        }
        else if ($("#booking__section").length > 0) {
          populateDropdown(
            defaultservlet + ".harleystates.html",
            statelist,
            "state",
            window && window.locations ? locations.State : null,
            false
          );
        }
        else {
          populateDropdown(
            defaultservlet + ".statelist.html",
            statelist,
            "state",
            window && window.locations ? locations.State : null,
            false
          );
        }
      }
    }

    $(".invalid-otp-message").hide();
    //check if not harley page then execute
    if(!$("#harleyRequestCallBack").length >0 ){
      $(
        ".book-test-drive-parent .cust-dropdown-menu, .book-test-ride-campaign .cust-dropdown-menu"
      ).on("click", "li", function () {
        let selectionGroup = $(this).parents(".cust-drop-down");
        var button = selectionGroup.find(".dropdown-select");
        if ($('#harley__form').length) {
          button.addClass('active');
        }
        button.text($(this).find("a")[0].innerHTML.replaceAll("&amp;", "&"));
        var form = $(this).closest("form");
        selectionGroup.find(".cust-dropdown-menu li").removeClass("active");
        $(this).addClass("active");
        if ("vehiclename" == button.attr("name")) {
          form.find('[name="vehicleNameVal"]').val($(this).attr("value"));
          $('#vehicleDropdown').html($(this).attr("value"));
        } else if ("statename" == button.attr("name")) {
          let cityField = form.find('[name="cityname"]');
          let list = cityField
            .parents(".cust-drop-down")
            .find(".cust-dropdown-menu ");
          stateName = $(this).attr("value");
  
          let cityPath;
          if ($('.campaign-container #harley__campaign').length > 0) {
            cityPath =
              defaultservlet + ".harleycities." + $(this).attr("value") + ".html";
          }
          else if ($("#booking__section").length > 0) {
            cityPath =
              defaultservlet + ".harleycities." + $(this).attr("value") + ".html";
          }
          else {
            cityPath =
              defaultservlet + ".dealercities." + $(this).attr("value") + ".html";
          }
  
          let cityValue =
            null != (window && window.locations) ? locations.City : "";
  
          // var cityPath = "/bin/statecitylist";
  
          if (cityField.text().trim() !== cityField.attr("data-default-label")) {
            cityValue = cityField.text().trim();
          }
  
        if ($(".book-test-ride-campaign").length > 0) {
            populateDropdown(cityPath, list, "city", cityValue, true);
          } else {
            let cityValue = form.find('[name="cityNameVal"]').val();
            populateCityDropdown(list, stateName, cityValue);
          }
  
          if ($('#harley__campaign').length) {
            form.find('[name="stateNameVal"]').val($(this).attr('value'));
            if ($('#magento-form-submit').length) {
              $('#magento-form-submit #state').val($(this).attr('value'));
            }
          }
          else {
            form.find('[name="stateNameVal"]').val(button.text());
          }
          form.find('[name="cityNameVal"]').val("");
          $('#stateDropdown').html($(this).attr("value"));
        } else if ("cityname" == button.attr("name")) {
  
          if ($('#booking__section').length && $('#harley__form [name="pin"]').length) {
            $('#harley__form [name="pin"]').val('');
          }
  
          let dealerName = form.find('[name="dealerNameVal"]');
          let dealerField = form.find('[name="dealername"]');
          let list = dealerName
            .parents(".cust-drop-down")
            .find(".cust-dropdown-menu ");
  
          let dealerNamePath;
          if ($('#harley__campaign').length) {
            dealerNamePath =
              defaultservlet +
              ".harleydealers." +
              stateName +
              "." +
              $(this).attr("value") +
              ".html";
          }
          else {
            dealerNamePath =
              defaultservlet +
              ".dealercodes." +
              stateName +
              "." +
              $(this).attr("value") +
              ".html";
          }
          let dealerValue;
          if (dealerField.text().trim() !== dealerField.attr("data-default-label")) {
            dealerValue = dealerField.text().trim();
          }
          populateDropdown(dealerNamePath, list, "dealer", dealerValue);
          if ($('#magento-form-submit').length) {
            $('#magento-form-submit #city').val($(this).attr('value'));
          }
          form.find('[name="cityNameVal"]').val(button.text());
          $('#cityDropdown').html(button.text().replace(/(<([^>]+)>)/ig, ''));
        } else if ("dealername" == button.attr("name")) {
          form.find('[name="dealerNameVal"]').val($(this).attr("value"));
          if ($('.campaign-container #harley__campaign').length) {
            let clickedDealerAddress = $(this).find('span').text();
            $('#harley__dealer--address').val(clickedDealerAddress);
            $('.address-input').removeClass('d-none');
          }
        } else if ("topics" == button.attr("name")) {
          form.find('[name="topicVal"]').val($(this).attr("value"));
        } else if ("sectiondropdown" == button.attr("name")) {
          form.find('[name="sectionVal"]').val($(this).attr("value"));
        }
      });
    }
    $(
      ".book-test-drive-parent .cust-form-group,.book-test-ride-campaign .cust-form-group"
    ).on("click", function () {
      var currentForm = $(this).parents("form");

      if (!$("#bookTestRideCollapse").hasClass("show")) {
        $(this)
          .parents(".book-test-drive-wrapper")
          .find(".collapse-btn")
          .trigger("click");
      }
      if ($(currentForm).find('[name="isPopup"]').val() == "true") {
        if (!popupEventSent) {
          popupEventSent = true;
          sendFormStartEvent(currentForm, this);
        }
      } else if (!bookRideEventSent) {
        bookRideEventSent = true;
        sendFormStartEvent(currentForm, this);
      }
    });
    $(".mobile-number").on("keyup", function () {
      if ($(this).val().length == 10 && $(this).valid()) {
        $(this)
          .parent(".cust-form-group")
          .find(".send-otp-btn")
          .addClass("show");
      } else {
        $(this)
          .parents("form")
          .find(".test-drive-otp-link")
          .removeClass("show");
        $(this).parents("form").find(".otp-field").prop("disabled", true);
      }
    });
    $("[name='fullname']").on("keyup", function () {
      $(this).valid();
    });
    $(".send-otp-btn").on("click", function () {
      var currentForm = $(this).parents("form");
      $(currentForm).find(".resend-otp-btn").addClass("show");
      $(currentForm).find(".otp-field").attr("disabled", false);
      $(currentForm).find(".otp-field").focus();
      $(this).removeClass("show");
      sendOtp(currentForm);
    });
    $(".resend-otp-btn").on("click", function () {
      var currentForm = $(this).parents("form");
      sendOtp(currentForm);
      $(this).attr("data-attempt", parseInt($(this).attr("data-attempt")) + 1);
      let attempts = $(this).attr("data-attempt");
      if (attempts == 3) {
        $(this).removeClass("show");
      }
    });

    $(".otp-value").on("keyup", function () {
      if (!$(this).valid()) {
        $(".invalid-otp-message").hide();
      }
    });

    $(".book-test-submit").on("click", function () { });
    function dec2hex(dec) {
      return dec.toString(16).padStart(2, "0");
    }
    function generateId(len) {
      var arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
    }
    function sendOtp(currentForm) {
      let category = window.location.pathname.split("/")[2];
      let splitedUrl = window.location.origin.split("//");
      let splitedDomain = splitedUrl[1].split(".");
      let siteCategory;
      if (splitedDomain[1] === "heromotocorp") {
        siteCategory = "corporate";
      }
      if (splitedDomain[1] === "dealers") {
        siteCategory = "dealer";
      }
      var pageType = $("#harleyRequestCallBack").length > 0 ? "Premia HD" : $(currentForm).find('[name="pageType"]').val();
      sessionStorage.setItem("tempID", generateId());
      var otpdata = {
        phoneNum: $(currentForm).find('[name="mobileno"]').val(),
        pageType: pageType,
        vehicleName:
          pageType == "homepage"
            ? $(currentForm).find('[name="vehicleNameVal"]').val()
            : "",
        reqID: sessionStorage.getItem("tempID"),
      };
      $.ajax({
        url: defaultservlet + ".sendotp.html",
        type: "POST",
        data: otpdata,
        success: function (resp) {
          resp = JSON.parse(resp);
          if (window.digitalData) {
            window.digitalData = {
              event: "OTP sent Successful",
              form: {
                formname: currentForm.data("aa-formname"),
                formtype: currentForm.attr("id"),
              },
              page: {
                siteType: "AEM",
                siteCategory: siteCategory,
                fullReferringUrl: document.referrer,
                pageName: pageTitle,
                pageUrl: window.location.href,
                path: window.location.pathname,
                category: category ? category : "",
              },
            };
          }
        },
        error: function () {
          $(currentForm).find(".invalid-otp-message").show();
          if (window.digitalData && window._satellite) {
            window.digitalData = {
              event: "OTP fails",
              form: {
                formname: currentForm.data("aa-formname"),
                formtype: currentForm.attr("id"),
                fieldlist: "otp",
              },
              page: {
                siteType: "AEM",
                siteCategory: siteCategory,
                fullReferringUrl: document.referrer,
                pageName: pageTitle,
                pageUrl: window.location.href,
                path: window.location.pathname,
                category: category ? category : "",
              },
            };
            _satellite.track("formError");
          }
        },
      });
    }

    $(".refresh").on("click", function () {
      createCaptcha($(this).parents("form"));
    });
    function createCaptcha(currentForm) {
      sessionStorage.setItem("tempID", generateId());
      var captchaData = {
        reqID: sessionStorage.getItem("tempID"),
      };
      $.ajax({
        url: defaultservlet + ".captcha.html",
        type: "POST",
        data: captchaData,
        success: function (resp) {
          $(currentForm).find("#captcha-img").remove();
          createCaptchaImage(resp);
        },
        error: function () { },
      });
    }
    function createCaptchaImage(resp) {
      var canv = document.createElement("canvas");
      canv.id = "captcha-img";
      canv.width = 200;
      canv.height = 50;
      var context = canv.getContext("2d");

      context.font = "bold 20px Arial";
      const spaceWidth = canv.width - context.measureText(resp).width - 40;
      const wordSpace = Math.floor(spaceWidth / resp.length);
      let left = 10;
      for (let i = 0; i < resp.length; i++) {
        const deg = (Math.random() * 30 * Math.PI) / 180;
        const x = left;
        const y = canv.height / 2 + Math.random() * 10;

        context.translate(x, y);
        context.rotate(deg);

        context.fillStyle = "rgb(" + 238 + "," + 35 + "," + 38 + ")";
        context.fillText(resp[i], 0, 0);

        context.rotate(-deg);
        context.translate(-x, -y);

        left +=
          context.measureText(resp[i]).width +
          wordSpace +
          Math.floor(Math.random() * 5);
      }

      const strokeLength = resp.length * Math.round(Math.random() + 1) + 3;
      for (let i = 0; i < strokeLength; i++) {
        context.strokeStyle = "rgb(" + 238 + "," + 35 + "," + 38 + ")";
        context.beginPath();
        context.moveTo(Math.random() * 100, Math.random() * 50);
        //context.lineTo(Math.random() * 100, Math.random() * 50);
        const x = Math.random() * 100;
        const y = Math.random() * 50;
        context.moveTo(x, y);
        //context.lineTo(x + 1, y + 1);
        context.stroke();
      }
      if ($("#captcha").length > 0) {
        document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
      }
      //$(currentForm).find(".captcha-img").attr("src", "data:image/jpg;base64," + resp);
    }
    function customValidation($form) {
      // for mobile no fields
      jQuery.validator.addMethod("mobilenoOnly", function (value, element) {
        return /^(6|7|8|9)[0-9]\d{8}$/i.test(value);
      });
      //for allow numbers only
      jQuery.validator.addMethod("numbersOnly", function (value) {
        return /^[0-9]+$/i.test(value);
      });
      //for allow only character
      jQuery.validator.addMethod("charactersOnly", function (value) {
        return /^[a-zA-Z&\s]+$/i.test(value);
      });
      //for email
      jQuery.validator.addMethod("emailOnly", function (value) {
        return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
      });
      //   book-test-drive-form
      $form.validate({
        ignore: [],
        rules: {
          fullname: {
            required: true,
            charactersOnly: true,
          },
          mobileno: {
            required: true,
            numbersOnly: true,
            mobilenoOnly: true,
          },
          otp: {
            required: true,
            numbersOnly: true,
          },
          vehicleNameVal: {
            required: true,
          },
          stateNameVal: {
            required: true,
          },
          cityNameVal: {
            required: true,
          },
          captcha: {
            required: ".ignore-validation:visible",
          },
          dealerNameVal: {
            required: true,
          },
          email: {
            emailOnly: {
              depends: function (elem) {
                return $form.find('[name="email"]').val().length != 0
              }
            },
          },
          countrymobileno: {
            required: true,
          },
        },
        messages: {
          fullname: {
            required: $('[name="fullname"]').data("validation-msg-req"),
            charactersOnly: $('[name="fullname"]').data(
              "validation-msg-format"
            ),
          },
          mobileno: {
            required: $('[name="mobileno"]').data("validation-msg-req"),
            numbersOnly: "Please enter numbers only",
            mobilenoOnly: $('[name="mobileno"]').data("validation-msg-format"),
          },
          otpenter: {
            required: $('[name="otp"]').data("validation-msg-req"),
            numbersOnly: "Please enter valid OTP",
          },
          vehicleNameVal: {
            required: $('[name="vehicleNameVal"]').data("validation-msg-req"),
          },
          stateNameVal: {
            required: $('[name="stateNameVal"]').data("validation-msg-req"),
          },
          cityNameVal: {
            required: $('[name="cityNameVal"]').data("validation-msg-req"),
          },
          captcha: {
            required: $('[name="captcha"]').data("validation-msg-req"),
          },
          dealerNameVal: {
            required: $('[name="dealerNameVal"]').data("validation-msg-req"),
          },
          email: {
            emailOnly: $('[name="email"]').data("validation-msg-format"),
          },
          birdies: {
            required: $('[name="birdies"]').data("validation-msg-req"),
          },
          organisationName: {
            required: $('[name="organisationName"]').data("validation-msg-req"),
          },
        },
      });
    }
    $(".book-test-submit").on("click", function (e) {
      let category = window.location.pathname.split("/")[2];
      let splitedUrl = window.location.origin.split("//");
      let splitedDomain = splitedUrl[1].split(".");
      let siteCategory;
      if (splitedDomain[1] === "heromotocorp") {
        siteCategory = "corporate";
      }
      if (splitedDomain[1] === "dealers") {
        siteCategory = "dealer";
      }

      let currentForm = $(this).closest("form");
      if (currentForm.valid()) {
        submitClicked = true;
        bookridesubmit(currentForm);
      } else {
        let formerrorList = currentForm.data("validator").errorList;
        let fieldlist = "";
        $.each(formerrorList, function (key, value) {
          if ("" !== fieldlist) {
            fieldlist = fieldlist + "|";
          }
          fieldlist = fieldlist + formerrorList[key].element.name;
        });
        if (window.digitalData && window._satellite) {
          window.digitalData = {
            form: {
              formname: currentForm.data("aa-formname"),
              formtype: currentForm.attr("id"),
              formerrorfields: fieldlist,
            },
            page: {
              siteType: "AEM",
              siteCategory: siteCategory,
              fullReferringUrl: document.referrer,
              pageName: pageTitle,
              pageUrl: window.location.href,
              path: window.location.pathname,
              category: category ? category : "",
            },
          };
          _satellite.track("formError");
        }
      }
    });
    function getQueryParams(search) {
      let params = {};
      let definitions = search.split("&");
      definitions.forEach(function (val, key) {
        let parts = val.split("=", 2);
        if (parts[1] != undefined && parts[1].length > 1) {
          params[parts[0]] = decodeURIComponent(parts[1]);
        }
      });
      return {
        utm_source: params["utm_source"],
        utm_medium: params["utm_medium"],
        utm_term: params["utm_term"],
        utm_content: params["utm_content"],
        utm_campaign: params["utm_campaign"],
      };
    }
    async function bookridesubmit(currentForm) {
      let category = window.location.pathname.split("/")[2];
      let splitedUrl = window.location.origin.split("//");
      let splitedDomain = splitedUrl[1].split(".");
      let siteCategory;
      if (splitedDomain[1] === "heromotocorp") {
        siteCategory = "corporate";
      }
      if (splitedDomain[1] === "dealers") {
        siteCategory = "dealer";
      }
      $(currentForm).find(".book-test-submit").attr("disabled", "disabled");
      if ($(currentForm).find('[name="pageType"]').val() == "homepage") {
        vehicleName = $(currentForm).find('[name="vehicleNameVal"]').val();
      } else {
        if ($(currentForm).find('[name="isPopup"]').val() == "true") {
          vehicleName = $(currentForm).find('[name="modelName"]').val();
        } else {
          vehicleName = $(currentForm).find('[name="vehicleNameVal"]').val();
        }
      }
      if ($(currentForm).find('[name="pageType"]').val() == "campaignpage") {
        if ($(currentForm).find(".vehicle-dropdown").length > 0)
          vehicleName = $(currentForm).find('[name="vehicleNameVal"]').val();
        else vehicleName = $(currentForm).find('[name="modelName"]').val();
      }
      var validationType =
        $(".book-test-ride-campaign").length > 0
          ? $(".book-test-ride-campaign").data("validationtype")
          : "otp";
      let _getParams = getQueryParams(window.location.search.slice(1));
      let _url = window.location.href;
      let _utmsource = $("#utmsource").data("utmsource");
      let _utmContent = $("#utmcontent").data("utmcontent");
      let dealerInfo = $("#dealer").val();
      let campaignPage = $("#capaignpage").val();
      var dataObj = {
        bike_model: $("#harleyRequestCallBack").length > 0 ? $('[name="modelName"]').val() : vehicleName,
        name: $(currentForm).find('[name="fullname"]').val().trim(),
        mobile: $(currentForm).find('[name="mobileno"]').val(),
        otp:
          validationType == "otp"
            ? $(currentForm).find('[name="otp"]').val()
            : "",
        captcha:
          validationType == "captcha"
            ? $(currentForm).find('[name="captcha"]').val()
            : "",
        city: $(currentForm)
          .find('[name="cityname"]')
          .text()
          .replaceAll("&amp;", "and")
          .replaceAll("&", "and"),
        state: $(currentForm)
          .find('[name="statename"]')
          .text()
          .replaceAll("&amp;", "and")
          .replaceAll("&", "and"),
        reqID: sessionStorage.getItem("tempID"),
        dealer_code: dealerInfo ? dealerInfo : null,
        variation_type: campaignPage,
        dealer_name: $(currentForm)
          .find('[name="dealername"]')
          .text()
          .replaceAll("&amp;", "and")
          .replaceAll("&", "and"),
        topic: $(".book-test-ride-campaign.ndc-campaign").length
          ? $("#ndc-topic").val()
          : null,
        suggestion: $(".book-test-ride-campaign.ndc-campaign").length
          ? $("#txtSuggestion").val() + "|||" + $("#txtCommitment").val()
          : null,
        section: $(".book-test-ride-campaign.ndc-campaign").length
          ? $("#ndc-section").val()
          : null,
        source: _utmsource
          ? `AEM-${getOS()}-${_utmsource}`
          : `AEM-${getOS()}-${category}-${pageTitle}-${validationType}`,
        utm_source: _getParams.utm_source,
        utm_medium: _getParams.utm_medium,
        utm_term: _getParams.utm_term,
        utm_content: _utmContent ? _utmContent : _getParams.utm_content,
        utm_campaign: _getParams.utm_campaign,
        email: $(currentForm).find('[name="email"]').val(),
      };
      const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(dataObj.mobile)
      );
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      $(currentForm)
        .closest(".book-test-drive-wrapper")
        .find(".book-test-drive-loading")
        .addClass("active");
      $(currentForm)
        .closest(".book-test-drive-wrapper")
        .find(".collapse-btn")
        .addClass("d-none");
      $(currentForm)
        .closest(".book-test-drive-wrapper")
        .find("#bookTestRideCollapse")
        .removeClass("show");
      $.ajax({
        url: $('[name="action_url"]').val(),
        type: "POST",
        data: JSON.stringify(dataObj),
        dataType: "json",
        contentType: "application/json",
        success: function (resp) {
          if (JSON.parse(JSON.stringify(resp)).login == "true") {
            $(currentForm)
              .closest(".book-test-drive-wrapper")
              .find(".book-test-drive-loading")
              .removeClass("active");
            $(currentForm)
              .closest(".book-test-drive-wrapper")
              .find(".book-test-thankyou.success")
              .addClass("active");
            if ($(currentForm).closest(".book-test-ride-campaign").length > 0) {
              window.location.href = $(currentForm)
                .find('[name="thankyoulink"]')
                .val();
            } else {
              $(currentForm).find(".book-test-submit").removeAttr("disabled");
            }
            if (window.digitalData && window._satellite) {
              window.digitalData = {
                form: {
                  formname: currentForm.data("aa-formname"),
                  formtype: currentForm.attr("id"),
                  mobilenumber: hashArray
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join(""),
                  vehicle: dataObj.bike_model,
                },
                page: {
                  siteType: "AEM",
                  siteCategory: siteCategory,
                  fullReferringUrl: document.referrer,
                  pageName: pageTitle,
                  pageUrl: window.location.href,
                  path: window.location.pathname,
                  category: category ? category : "",
                },
              };
              _satellite.track("formSuccess");
            }
          } else {
            $(currentForm).find(".book-test-submit").removeAttr("disabled");
            $(currentForm)
              .closest(".book-test-drive-wrapper")
              .find(".book-test-drive-loading")
              .removeClass("active");
            $(currentForm)
              .closest(".book-test-drive-wrapper")
              .find(".book-test-thankyou.fail")
              .addClass("active");
            if ($(currentForm).closest(".book-test-ride-campaign").length > 0) {
              $(currentForm)
                .closest(".book-test-ride-campaign")
                .find(".failmsg")
                .removeClass("d-none");
              $(currentForm)
                .closest(".book-test-ride-campaign")
                .find(".successmsg")
                .addClass("d-none");
              $(currentForm)
                .closest(".book-test-ride-campaign")
                .find(".book-test-submit")
                .removeAttr("disabled");
              createCaptcha(currentForm);
              $(currentForm).find(".book-test-submit").removeAttr("disabled");
            }

            if (window.digitalData && window._satellite) {
              window.digitalData = {
                form: {
                  formname: currentForm.data("aa-formname"),
                  formtype: currentForm.attr("id"),
                },
                page: {
                  siteType: 'AEM',
                  siteCategory: siteCategory,
                  fullReferringUrl: document.referrer,
                  pageName: pageTitle,
                  pageUrl: window.location.href,
                  path: window.location.pathname,
                  category: category ? category : '',
                },
              };
              _satellite.track("formError");
            }
          }
          if (window.digitalData) {
            window.digitalData = {
              event: "Contact Form Submitted",
              FormDetails: {
                formname: currentForm.data("aa-formname"),
                formtype: currentForm.attr("id"),
                state: currentForm.find("input[name=stateNameVal]").val(),
                city: currentForm.find("input[name=cityNameVal]").val(),
                vehicle: currentForm.find("input[name=vehicleNameVal]").val(),
                requestID: sessionStorage.getItem("tempID"),
              },
              page: {
                siteType: 'AEM',
                siteCategory: siteCategory,
                fullReferringUrl: document.referrer,
                pageName: pageTitle,
                pageUrl: window.location.href,
                path: window.location.pathname,
                category: category ? category : '',
              },
            };
          }
        },
        error: function (error) {
          $(currentForm).find(".book-test-submit").removeAttr("disabled");
          $(currentForm)
            .closest(".book-test-ride-campaign")
            .find(".book-test-submit")
            .removeAttr("disabled");
          $(currentForm)
            .closest(".book-test-drive-wrapper")
            .find(".book-test-drive-loading")
            .removeClass("active");
          $(currentForm)
            .closest(".book-test-drive-wrapper")
            .find(".book-test-drive-wrapper .collapse-btn")
            .removeClass("d-none");
          $(currentForm).find("#bookTestRideCollapse").addClass("show");
          $(currentForm).find(".invalid-otp-message").show();
          if ($(currentForm).closest(".book-test-ride-campaign").length > 0) {
            createCaptcha(currentForm);
            if (window.digitalData && window._satellite) {
              window.digitalData = {
                form: {
                  formname: currentForm.data("aa-formname"),
                  formtype: currentForm.attr("id"),
                  formerrorfields: "captcha",
                },
                page: {
                  siteType: 'AEM',
                  siteCategory: siteCategory,
                  fullReferringUrl: document.referrer,
                  pageName: pageTitle,
                  pageUrl: window.location.href,
                  path: window.location.pathname,
                  category: category ? category : '',
                },
              };
              _satellite.track("formError");
            }
          } else {
            if (window.digitalData && window._satellite) {
              window.digitalData = {
                form: {
                  formname: currentForm.data("aa-formname"),
                  formtype: currentForm.attr("id"),
                  formerrorfields: "otp",
                },
                page: {
                  siteType: 'AEM',
                  siteCategory: siteCategory,
                  fullReferringUrl: document.referrer,
                  pageName: pageTitle,
                  pageUrl: window.location.href,
                  path: window.location.pathname,
                  category: category ? category : '',
                },
              };
              _satellite.track("formError");
            }
          }
        },
      });
    }
    function sortAscending(a, b) {
      return $(b).text().toUpperCase() < $(a).text().toUpperCase() ? 1 : -1;
    }
    function getOS() {
      var userAgent = window.navigator.userAgent,
        platform =
          window.navigator?.userAgentData?.platform ||
          window.navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K", "macOS"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"],
        os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = "Mac OS";
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = "iOS";
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = "Windows";
      } else if (/Android/.test(userAgent)) {
        os = "Android";
      } else if (/Linux/.test(platform)) {
        os = "Linux";
      }

      return os;
    }

    //Smooth scrolling with links
    $(".home-book-test-drive-btn").on("click", function (event) {
      event.preventDefault();
      var currentElement = this.hash;
      $("html,body").animate(
        {
          scrollTop:
            $(currentElement).offset().top - $(".header-main").height(),
        },
        500,
        function () {
          var focusedElem = $(currentElement).find(".form-group").first();
          focusedElem.find("input").focus().click();
        }
      );
    });

    $(".form-close").on("click", function () {
      var formID =
        $(this).closest("#book-test-drive-nav").find("form").length > 0
          ? $(this).closest("#book-test-drive-nav").find("form")
          : $(this).closest(".book-test-drive-wrapper").find("form");
      $(this).parents(".book-test-thankyou").removeClass("active");
      $(formID).find("#bookTestRideCollapse").removeClass("d-none");
      $(formID).find("#bookTestRideCollapse").addClass("show");
      $(this)
        .closest("#book-test-drive-nav")
        .find(".collapse-btn")
        .removeClass("d-none");
      formID
        .find("input,textarea,select")
        .not('[type="button"]')
        .not('[type="hidden"]')
        .val("")
        .end();
      formID.find("label.error").remove();
      formID.find(".send-otp-btn,.resend-otp-btn").removeClass("show");
      formID.find(".invalid-otp-message").hide();
    });

    $("#golf-form-submit").on("click", function () {
      let currentForm = $(this).closest("form");
      if (currentForm.valid()) {
        $("#golf-loader").addClass("active");
        let dataObj = {
          PWSESSIONRS: {
            PWPROCESSRS: {
              PWHEADER: {
                IN_PROCESS_ID: "1",
                APP_ID: "GBC",
                ORG_ID: "GBC",
                OUT_PROCESS_ID: "oa_getCountryCode",
                LOGIN_ID: "",
              },
              PWDATA: {
                oa_getCountryCode: {
                  Row: [
                    {
                      0: $("#number").val(),
                      1: $("#name").val(),
                      2: $("#email").val(),
                      3: $("#organisation").val(),
                      4: $("#birdies").val(),
                      5: "MTE2NzAxODQxY2ZiM2ZmZGQ2MTY=",
                    },
                  ],
                },
              },
              PWERROR: "",
            },
          },
        };
        $.ajax({
          url: "https://hmclmobazfun02p-dev.azurewebsites.net/api/cloudware_prod?ORG_ID=GBC",
          type: "POST",
          data: JSON.stringify(dataObj),
          dataType: "json",
          contentType: "application/json",
          success: function (resp) {
            $("#golf-loader").removeClass("active");
            let jsonResp = JSON.parse(JSON.stringify(resp));
            if (
              jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getCountryCode
                .Row[0].status == "success"
            ) {
              window.location.href = $("[name=thankyoulink]").val();
            } else {
              $("#golf-error-response").addClass("active");
              $("#golf-error-response span").text(
                jsonResp.PWSESSIONRS[0].PWPROCESSRS.PWDATA.oa_getCountryCode
                  .Row[0].message
              );
            }
          },
          error: function (error) {
            $("#golf-loader").removeClass("active");
          },
        });
      }
    });
    // Smooth scrolling when the document is loaded and ready
    $(document).ready(function () {
      if (location.hash.length > 0 && $(".header-main")) {
        $("html,body").animate(
          {
            scrollTop:
              $(location.hash).offset().top - $(".header-main").height(),
          },
          500
        );
      }
    });
  }

  if ($('#upsell-passion-campaign').length) {
    // Crypto JS
    var CryptoJS = CryptoJS || function (u, p) {
      var d = {}, l = d.lib = {}, s = function () { }, t = l.Base = { extend: function (a) { s.prototype = this; var c = new s; a && c.mixIn(a); c.hasOwnProperty("init") || (c.init = function () { c.$super.init.apply(this, arguments) }); c.init.prototype = c; c.$super = this; return c }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
        r = l.WordArray = t.extend({
          init: function (a, c) { a = this.words = a || []; this.sigBytes = c != p ? c : 4 * a.length }, toString: function (a) { return (a || v).stringify(this) }, concat: function (a) { var c = this.words, e = a.words, j = this.sigBytes; a = a.sigBytes; this.clamp(); if (j % 4) for (var k = 0; k < a; k++)c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4); else if (65535 < e.length) for (k = 0; k < a; k += 4)c[j + k >>> 2] = e[k >>> 2]; else c.push.apply(c, e); this.sigBytes += a; return this }, clamp: function () {
            var a = this.words, c = this.sigBytes; a[c >>> 2] &= 4294967295 <<
              32 - 8 * (c % 4); a.length = u.ceil(c / 4)
          }, clone: function () { var a = t.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (var c = [], e = 0; e < a; e += 4)c.push(4294967296 * u.random() | 0); return new r.init(c, a) }
        }), w = d.enc = {}, v = w.Hex = {
          stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++) { var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255; e.push((k >>> 4).toString(16)); e.push((k & 15).toString(16)) } return e.join("") }, parse: function (a) {
            for (var c = a.length, e = [], j = 0; j < c; j += 2)e[j >>> 3] |= parseInt(a.substr(j,
              2), 16) << 24 - 4 * (j % 8); return new r.init(e, c / 2)
          }
        }, b = w.Latin1 = { stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++)e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return e.join("") }, parse: function (a) { for (var c = a.length, e = [], j = 0; j < c; j++)e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new r.init(e, c) } }, x = w.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(b.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return b.parse(unescape(encodeURIComponent(a))) } },
        q = l.BufferedBlockAlgorithm = t.extend({
          reset: function () { this._data = new r.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = x.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var c = this._data, e = c.words, j = c.sigBytes, k = this.blockSize, b = j / (4 * k), b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0); a = b * k; j = u.min(4 * a, j); if (a) { for (var q = 0; q < a; q += k)this._doProcessBlock(e, q); q = e.splice(0, a); c.sigBytes -= j } return new r.init(q, j) }, clone: function () {
            var a = t.clone.call(this);
            a._data = this._data.clone(); return a
          }, _minBufferSize: 0
        }); l.Hasher = q.extend({
          cfg: t.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { q.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, e) { return (new a.init(e)).finalize(b) } }, _createHmacHelper: function (a) {
            return function (b, e) {
              return (new n.HMAC.init(a,
                e)).finalize(b)
            }
          }
        }); var n = d.algo = {}; return d
    }(Math);
    (function () {
      var u = CryptoJS, p = u.lib.WordArray; u.enc.Base64 = {
        stringify: function (d) { var l = d.words, p = d.sigBytes, t = this._map; d.clamp(); d = []; for (var r = 0; r < p; r += 3)for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++)d.push(t.charAt(w >>> 6 * (3 - v) & 63)); if (l = t.charAt(64)) for (; d.length % 4;)d.push(l); return d.join("") }, parse: function (d) {
          var l = d.length, s = this._map, t = s.charAt(64); t && (t = d.indexOf(t), -1 != t && (l = t)); for (var t = [], r = 0, w = 0; w <
            l; w++)if (w % 4) { var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4), b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4); t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4); r++ } return p.create(t, r)
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      }
    })();
    (function (u) {
      function p(b, n, a, c, e, j, k) { b = b + (n & a | ~n & c) + e + k; return (b << j | b >>> 32 - j) + n } function d(b, n, a, c, e, j, k) { b = b + (n & c | a & ~c) + e + k; return (b << j | b >>> 32 - j) + n } function l(b, n, a, c, e, j, k) { b = b + (n ^ a ^ c) + e + k; return (b << j | b >>> 32 - j) + n } function s(b, n, a, c, e, j, k) { b = b + (a ^ (n | ~c)) + e + k; return (b << j | b >>> 32 - j) + n } for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++)b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0; r = r.MD5 = v.extend({
        _doReset: function () { this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878]) },
        _doProcessBlock: function (q, n) {
          for (var a = 0; 16 > a; a++) { var c = n + a, e = q[c]; q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360 } var a = this._hash.words, c = q[n + 0], e = q[n + 1], j = q[n + 2], k = q[n + 3], z = q[n + 4], r = q[n + 5], t = q[n + 6], w = q[n + 7], v = q[n + 8], A = q[n + 9], B = q[n + 10], C = q[n + 11], u = q[n + 12], D = q[n + 13], E = q[n + 14], x = q[n + 15], f = a[0], m = a[1], g = a[2], h = a[3], f = p(f, m, g, h, c, 7, b[0]), h = p(h, f, m, g, e, 12, b[1]), g = p(g, h, f, m, j, 17, b[2]), m = p(m, g, h, f, k, 22, b[3]), f = p(f, m, g, h, z, 7, b[4]), h = p(h, f, m, g, r, 12, b[5]), g = p(g, h, f, m, t, 17, b[6]), m = p(m, g, h, f, w, 22, b[7]),
            f = p(f, m, g, h, v, 7, b[8]), h = p(h, f, m, g, A, 12, b[9]), g = p(g, h, f, m, B, 17, b[10]), m = p(m, g, h, f, C, 22, b[11]), f = p(f, m, g, h, u, 7, b[12]), h = p(h, f, m, g, D, 12, b[13]), g = p(g, h, f, m, E, 17, b[14]), m = p(m, g, h, f, x, 22, b[15]), f = d(f, m, g, h, e, 5, b[16]), h = d(h, f, m, g, t, 9, b[17]), g = d(g, h, f, m, C, 14, b[18]), m = d(m, g, h, f, c, 20, b[19]), f = d(f, m, g, h, r, 5, b[20]), h = d(h, f, m, g, B, 9, b[21]), g = d(g, h, f, m, x, 14, b[22]), m = d(m, g, h, f, z, 20, b[23]), f = d(f, m, g, h, A, 5, b[24]), h = d(h, f, m, g, E, 9, b[25]), g = d(g, h, f, m, k, 14, b[26]), m = d(m, g, h, f, v, 20, b[27]), f = d(f, m, g, h, D, 5, b[28]), h = d(h, f,
              m, g, j, 9, b[29]), g = d(g, h, f, m, w, 14, b[30]), m = d(m, g, h, f, u, 20, b[31]), f = l(f, m, g, h, r, 4, b[32]), h = l(h, f, m, g, v, 11, b[33]), g = l(g, h, f, m, C, 16, b[34]), m = l(m, g, h, f, E, 23, b[35]), f = l(f, m, g, h, e, 4, b[36]), h = l(h, f, m, g, z, 11, b[37]), g = l(g, h, f, m, w, 16, b[38]), m = l(m, g, h, f, B, 23, b[39]), f = l(f, m, g, h, D, 4, b[40]), h = l(h, f, m, g, c, 11, b[41]), g = l(g, h, f, m, k, 16, b[42]), m = l(m, g, h, f, t, 23, b[43]), f = l(f, m, g, h, A, 4, b[44]), h = l(h, f, m, g, u, 11, b[45]), g = l(g, h, f, m, x, 16, b[46]), m = l(m, g, h, f, j, 23, b[47]), f = s(f, m, g, h, c, 6, b[48]), h = s(h, f, m, g, w, 10, b[49]), g = s(g, h, f, m,
                E, 15, b[50]), m = s(m, g, h, f, r, 21, b[51]), f = s(f, m, g, h, u, 6, b[52]), h = s(h, f, m, g, k, 10, b[53]), g = s(g, h, f, m, B, 15, b[54]), m = s(m, g, h, f, e, 21, b[55]), f = s(f, m, g, h, v, 6, b[56]), h = s(h, f, m, g, x, 10, b[57]), g = s(g, h, f, m, t, 15, b[58]), m = s(m, g, h, f, D, 21, b[59]), f = s(f, m, g, h, z, 6, b[60]), h = s(h, f, m, g, C, 10, b[61]), g = s(g, h, f, m, j, 15, b[62]), m = s(m, g, h, f, A, 21, b[63]); a[0] = a[0] + f | 0; a[1] = a[1] + m | 0; a[2] = a[2] + g | 0; a[3] = a[3] + h | 0
        }, _doFinalize: function () {
          var b = this._data, n = b.words, a = 8 * this._nDataBytes, c = 8 * b.sigBytes; n[c >>> 5] |= 128 << 24 - c % 32; var e = u.floor(a /
            4294967296); n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360; n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360; b.sigBytes = 4 * (n.length + 1); this._process(); b = this._hash; n = b.words; for (a = 0; 4 > a; a++)c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360; return b
        }, clone: function () { var b = v.clone.call(this); b._hash = this._hash.clone(); return b }
      }); t.MD5 = v._createHelper(r); t.HmacMD5 = v._createHmacHelper(r)
    })(Math);
    (function () {
      var u = CryptoJS, p = u.lib, d = p.Base, l = p.WordArray, p = u.algo, s = p.EvpKDF = d.extend({ cfg: d.extend({ keySize: 4, hasher: p.MD5, iterations: 1 }), init: function (d) { this.cfg = this.cfg.extend(d) }, compute: function (d, r) { for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) { n && s.update(n); var n = s.update(d).finalize(r); s.reset(); for (var a = 1; a < p; a++)n = s.finalize(n), s.reset(); b.concat(n) } b.sigBytes = 4 * q; return b } }); u.EvpKDF = function (d, l, p) {
        return s.create(p).compute(d,
          l)
      }
    })();
    CryptoJS.lib.Cipher || function (u) {
      var p = CryptoJS, d = p.lib, l = d.Base, s = d.WordArray, t = d.BufferedBlockAlgorithm, r = p.enc.Base64, w = p.algo.EvpKDF, v = d.Cipher = t.extend({
        cfg: l.extend(), createEncryptor: function (e, a) { return this.create(this._ENC_XFORM_MODE, e, a) }, createDecryptor: function (e, a) { return this.create(this._DEC_XFORM_MODE, e, a) }, init: function (e, a, b) { this.cfg = this.cfg.extend(b); this._xformMode = e; this._key = a; this.reset() }, reset: function () { t.reset.call(this); this._doReset() }, process: function (e) { this._append(e); return this._process() },
        finalize: function (e) { e && this._append(e); return this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (e) { return { encrypt: function (b, k, d) { return ("string" == typeof k ? c : a).encrypt(e, b, k, d) }, decrypt: function (b, k, d) { return ("string" == typeof k ? c : a).decrypt(e, b, k, d) } } }
      }); d.StreamCipher = v.extend({ _doFinalize: function () { return this._process(!0) }, blockSize: 1 }); var b = p.mode = {}, x = function (e, a, b) {
        var c = this._iv; c ? this._iv = u : c = this._prevBlock; for (var d = 0; d < b; d++)e[a + d] ^=
          c[d]
      }, q = (d.BlockCipherMode = l.extend({ createEncryptor: function (e, a) { return this.Encryptor.create(e, a) }, createDecryptor: function (e, a) { return this.Decryptor.create(e, a) }, init: function (e, a) { this._cipher = e; this._iv = a } })).extend(); q.Encryptor = q.extend({ processBlock: function (e, a) { var b = this._cipher, c = b.blockSize; x.call(this, e, a, c); b.encryptBlock(e, a); this._prevBlock = e.slice(a, a + c) } }); q.Decryptor = q.extend({
        processBlock: function (e, a) {
          var b = this._cipher, c = b.blockSize, d = e.slice(a, a + c); b.decryptBlock(e, a); x.call(this,
            e, a, c); this._prevBlock = d
        }
      }); b = b.CBC = q; q = (p.pad = {}).Pkcs7 = { pad: function (a, b) { for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4)l.push(d); c = s.create(l, c); a.concat(c) }, unpad: function (a) { a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255 } }; d.BlockCipher = v.extend({
        cfg: v.cfg.extend({ mode: b, padding: q }), reset: function () {
          v.reset.call(this); var a = this.cfg, b = a.iv, a = a.mode; if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor; else c = a.createDecryptor, this._minBufferSize = 1; this._mode = c.call(a,
            this, b && b.words)
        }, _doProcessBlock: function (a, b) { this._mode.processBlock(a, b) }, _doFinalize: function () { var a = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), a.unpad(b); return b }, blockSize: 4
      }); var n = d.CipherParams = l.extend({ init: function (a) { this.mixIn(a) }, toString: function (a) { return (a || this.formatter).stringify(this) } }), b = (p.format = {}).OpenSSL = {
        stringify: function (a) {
          var b = a.ciphertext; a = a.salt; return (a ? s.create([1398893684,
            1701076831]).concat(a).concat(b) : b).toString(r)
        }, parse: function (a) { a = r.parse(a); var b = a.words; if (1398893684 == b[0] && 1701076831 == b[1]) { var c = s.create(b.slice(2, 4)); b.splice(0, 4); a.sigBytes -= 16 } return n.create({ ciphertext: a, salt: c }) }
      }, a = d.SerializableCipher = l.extend({
        cfg: l.extend({ format: b }), encrypt: function (a, b, c, d) { d = this.cfg.extend(d); var l = a.createEncryptor(c, d); b = l.finalize(b); l = l.cfg; return n.create({ ciphertext: b, key: c, iv: l.iv, algorithm: a, mode: l.mode, padding: l.padding, blockSize: a.blockSize, formatter: d.format }) },
        decrypt: function (a, b, c, d) { d = this.cfg.extend(d); b = this._parse(b, d.format); return a.createDecryptor(c, d).finalize(b.ciphertext) }, _parse: function (a, b) { return "string" == typeof a ? b.parse(a, this) : a }
      }), p = (p.kdf = {}).OpenSSL = { execute: function (a, b, c, d) { d || (d = s.random(8)); a = w.create({ keySize: b + c }).compute(a, d); c = s.create(a.words.slice(b), 4 * c); a.sigBytes = 4 * b; return n.create({ key: a, iv: c, salt: d }) } }, c = d.PasswordBasedCipher = a.extend({
        cfg: a.cfg.extend({ kdf: p }), encrypt: function (b, c, d, l) {
          l = this.cfg.extend(l); d = l.kdf.execute(d,
            b.keySize, b.ivSize); l.iv = d.iv; b = a.encrypt.call(this, b, c, d.key, l); b.mixIn(d); return b
        }, decrypt: function (b, c, d, l) { l = this.cfg.extend(l); c = this._parse(c, l.format); d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt); l.iv = d.iv; return a.decrypt.call(this, b, c, d.key, l) }
      })
    }();
    (function () {
      for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++)a[c] = 128 > c ? c << 1 : c << 1 ^ 283; for (var e = 0, j = 0, c = 0; 256 > c; c++) { var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4, k = k >>> 8 ^ k & 255 ^ 99; l[e] = k; s[k] = e; var z = a[e], F = a[z], G = a[F], y = 257 * a[k] ^ 16843008 * k; t[e] = y << 24 | y >>> 8; r[e] = y << 16 | y >>> 16; w[e] = y << 8 | y >>> 24; v[e] = y; y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e; b[k] = y << 24 | y >>> 8; x[k] = y << 16 | y >>> 16; q[k] = y << 8 | y >>> 24; n[k] = y; e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1 } var H = [0, 1, 2, 4, 8,
        16, 32, 64, 128, 27, 54], d = d.AES = p.extend({
          _doReset: function () {
            for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)if (j < d) e[j] = c[j]; else { var k = e[j - 1]; j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24); e[j] = e[j - d] ^ k } c = this._invKeySchedule = []; for (d = 0; d < a; d++)j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>>
              8 & 255]] ^ n[l[k & 255]]
          }, encryptBlock: function (a, b) { this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l) }, decryptBlock: function (a, c) { var d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d; this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s); d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d }, _doCryptBlock: function (a, b, c, d, e, j, l, f) {
            for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++)var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++], s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++], t =
              d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++], n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++], g = q, h = s, k = t; q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++]; s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++]; t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++]; n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++]; a[b] = q; a[b + 1] = s; a[b + 2] = t; a[b + 3] = n
          }, keySize: 8
        }); u.AES = p._createHelper(d)
    })();

    // Crypto JS Ends

    let key = '63C09AE37D4254AD7D13A7HGF$F88411';
    let iv = '1234567890123456';

    function getQueryParam(name) {
      var url = window.location.href;
      var paramIndex = url.indexOf('?');
      if (paramIndex === -1) {
        return null; // No query parameter in the URL
      }
      var queryString = url.substring(paramIndex + 1);
      var params = queryString.split('&');
      for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        if (param[0] === name) {
          return param[1] || '';
        }
      }
      return null;
    }

    var paramName = 'enc';
    let res = getQueryParam(paramName);

    function decryptData(encryptedData, key, iv) {
      var base64DecodedData = atob(encryptedData);
      var decryptedBytes = CryptoJS.AES.decrypt(base64DecodedData, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.CBC, iv: CryptoJS.enc.Utf8.parse(iv) });
      var decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedText;
    }

    function setFormData(firstNameValue, phoneNoValue, state, city, dealer) {
      $('#upsell-passion-campaign [name="fullname"]').val(firstNameValue);
      $('#upsell-passion-campaign [name="mobileno"]').val(phoneNoValue);

      setTimeout(function () {
        $('ul[aria-labelledby="stateDropdown"] li a:contains("' + state.toLowerCase() + '")').click();
      }, 800);

      setTimeout(function () {
        $('ul[aria-labelledby="cityDropdown"] li a:contains("' + city.toLowerCase() + '")').click();
      }, 1000);

      setTimeout(function () {
        let dealerElement = $('ul li[value="' + dealer + '"]');
        if (dealerElement.length > 0) {
          let anchorTag = dealerElement.find("a");
          anchorTag.click();
        }
      }, 1200);
    }

    var decryptedData = decryptData(res, key, iv);
    var [firstName, phoneNo, state, city, dealer] = decryptedData.split('|');
    setFormData(firstName, phoneNo, state, city, dealer);
  }
});
