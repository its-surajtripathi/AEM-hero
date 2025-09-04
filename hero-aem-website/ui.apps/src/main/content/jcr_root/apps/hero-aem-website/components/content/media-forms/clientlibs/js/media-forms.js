$(document).ready(function () {
  if ($(".media-component").length > 0) {
    let defaultservlet = document.getElementById("defaultservlet").value;
    let url = defaultservlet + ".statelist.html";
    let captchText = "";
    let currentForm = $("#media--forms form");
    createCaptcha(currentForm);
    function preventFutureDates() {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      $("#media--forms input[type='date']").attr("max", today);
    }
    let title = $('title').text();
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

    const formSelect = document.querySelector(".media-forms");
    let formFields = document.querySelectorAll(
      "#media--forms input, #media--forms textarea, #media--forms .dropdown-select"
    );
    let startEventSent = false;
    formFields.forEach((key) => {
      key.addEventListener("focus", () => {
        if (!startEventSent) {
          window.digitalData = {
            form: {
              formfield: key.name,
              formname: $(formSelect).find("form").attr("class"),
              formtype: $(formSelect).find("section").attr("id"),
            },
            page: {
              siteType: "AEM",
              siteCategory: siteCategory,
              fullReferringUrl: document.referrer,
              pageName: title,
              pageUrl: window.location.href,
              path: window.location.pathname,
              category: category ? category : "",
            },
          };
          _satellite.track("formStart");
        }
        startEventSent = true;
      });
    });

    function preventPastDates() {
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0");
      let yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      $("#media--forms input[type='date']").attr("min", today);
    }

    function defaultDate(getTestDate) {
      if (getTestDate == 0) {
        var today = new Date();
        var defaultDate = new Date();
        defaultDate.setDate(today.getDate() + 10);
        $("#expected-date").val(defaultDate.toISOString().substring(0, 10));
      } else {
        $("#expected-date").val(getTestDate);
        $("#expected-date").attr("min", getTestDate);
      }
    }

    if ($("section#suggestions").length > 0) {
      preventFutureDates();
    }

    if ($("section#test-ride").length > 0) {
      preventPastDates();
      defaultDate(0);
    }

    $("#testride-date").on("change", function () {
      let inputTestDate = $(this).val();
      defaultDate(inputTestDate);
    });

    $("#email").keyup(function () {
      $("#email").siblings(".error--message").hide();
      if ($(this).val().length >= 3) {
        let email = $(this).val();
        if (validateEmail(email)) {
          $("#email").siblings(".validate--msg").hide();
        } else {
          $("#email").siblings(".validate--msg").show();
        }
      } else {
        $("#email").siblings(".validate--msg").hide();
      }
    });

    function validateEmail(email) {
      var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    let stateName = "";

    $("#txtComplaint").keyup(function () {
      let textLength = $(this).val().length;
      if (textLength > 2000) {
        $(this).val($(this).val().substring(0, 2000));
      }
    });

    function sortAscending(a, b) {
      return $(b).text().toUpperCase() < $(a).text().toUpperCase() ? 1 : -1;
    }

    $("#testride").change(function () {
      if (this.checked) {
        $("#test--date").show();
        $("#test--date input").attr("required", true);
      } else {
        var today = new Date();
        var defaultDate = new Date();
        defaultDate.setDate(today.getDate() + 10);
        $("#expected-date").val(defaultDate.toISOString().substring(0, 10));
        $("#test--date input").val("");
        $("#test--date").hide();
        $("#test--date input").attr("required", false);
      }
    });

    $("#media--forms textarea").keyup(function () {
      $(this).siblings(".error--message").hide();
    });

    $("#media--forms input").keyup(function () {
      $(this).siblings(".error--message").hide();
    });

    $("input#pin").on("input", function () {
      if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
      }
    });

    $("input#age").on("input", function () {
      if (this.value.length > 2) {
        this.value = this.value.slice(0, 2);
      }
    });

    $(document).on("change", '#media--forms input[type="date"]', function () {
      $(this).siblings(".error--message").hide();
    });

    // DropDowns
    function populateDropdown(url, selector, keyword, selectedVal) {
      if (url) {
        fetch(url)
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
              let dealerstatelist = form
                .find('[name="dealerstate"]')
                .parents(".cust-drop-down")
                .find(".cust-dropdown-menu ");
              dealerstatelist[0].innerHTML = html;
            }

            if (keyword == "city") {
              let cityField = form.find('[name="cityname"]');
              let abbrCity = cityField.attr("data-default-label");
              cityField[0].disabled = false;
              if (
                selectedVal &&
                $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value")
              ) {
                abbrCity = selectedVal;
                form.find('[name="cityNameVal"]').val(selectedVal);
              }
              cityField.text(abbrCity);
              $("button[name='cityname']")
                .siblings("ul")
                .find("li:first")
                .trigger("click");
            }
            if (keyword == "dealercity") {
              let dealerCityField = form.find('[name="dealercity"]');
              let dealerNameField = form.find('[name="dealername"]');
              let abbrCity = dealerCityField.attr("data-default-label");
              let abbrName = dealerNameField.attr("data-default-label");
              dealerCityField[0].disabled = false;
              if (
                selectedVal &&
                $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value")
              ) {
                abbrCity = selectedVal;
                form.find('[name="dealerCityNameVal"]').val(selectedVal);
                abbrName = dealerNameField.text().trim();
                form
                  .find('[name="dealerVal"]')
                  .val(form.find('[name="dealerVal"]').val());
                dealerNameField.attr("disabled", false);
              }
              if (abbrName == dealerNameField.attr("data-default-label")) {
                dealerNameField[0].disabled = true;
                form.find('[name="dealerVal"]').val("");
              }
              dealerCityField.text(abbrCity);
              dealerNameField.text(abbrName);
              $("button[name='dealercity']")
                .siblings("ul")
                .find("li:first")
                .trigger("click");
            }
            if (keyword == "dealer") {
              //sort in ascending order
              let dealerField = form.find('[name="dealername"]');
              dealerField[0].disabled = false;
              dealerField
                .parents(".cust-drop-down")
                .find(".cust-dropdown-menu li")
                .sort(sortAscending)
                .appendTo(
                  dealerField
                    .parents(".cust-drop-down")
                    .find(".cust-dropdown-menu")
                );
              abbrDealer = dealerField.attr("data-default-label");
              if (
                selectedVal &&
                $(selector[0])
                  .children("li:contains(" + selectedVal.toLowerCase() + ")")
                  .attr("value")
              ) {
                abbrDealer = selectedVal;
                form
                  .find('[name="dealerVal"]')
                  .val(form.find('[name="dealerVal"]').val());
              } else {
                form.find('[name="dealerVal"]').val("");
              }
              dealerField.text(abbrDealer);
              $("button[name='dealername']")
                .siblings("ul")
                .find("li:first")
                .trigger("click");
            }
          });
      }
    }

    if ($("#media--forms form").length >= 1) {
      $("#media--forms form").each(function (item) {
        if ($('button[name="statename"]').length) {
          let statelist = $(this)
            .find('[name="statename"]')
            .parents(".cust-drop-down")
            .find(".cust-dropdown-menu ");
          populateDropdown(
            defaultservlet + ".statelist.html",
            statelist,
            "state",
            window && window.locations ? locations.State : null,
            false
          );
        } else {
          let statelistDistrict = $(this)
            .find('[name="statenameDistrict"]')
            .parents(".cust-drop-down")
            .find(".cust-dropdown-menu ");
          populateDropdown(
            defaultservlet + ".districtstatelist.html",
            statelistDistrict,
            "state",
            window && window.locations ? locations.State : null,
            false
          );
        }

        let vehiclelist = $(this)
          .find('[name="vehiclemodelname"]')
          .parents(".cust-drop-down")
          .find(".cust-dropdown-menu ");
        populateDropdown(
          defaultservlet + ".vehiclelist.html",
          vehiclelist,
          "vehicle",
          window && window.locations ? locations.State : null,
          false
        );
      });
    }

    $("#media--forms .cust-dropdown-menu").on("click", "li", function () {
      $(this).parents().siblings(".error--message").hide();
      let selectionGroup = $(this).parents(".cust-drop-down");
      var button = selectionGroup.find(".dropdown-select");
      button.text($(this).find("a")[0].innerHTML.replaceAll("&amp;", "&"));
      var form = $(this).closest("form");
      selectionGroup.find(".cust-dropdown-menu li").removeClass("active");
      $(this).parents("ul").siblings(".btn-drop").addClass("active");
      $(this).addClass("active");
      if ("vehiclemodelname" == button.attr("name")) {
        form
          .find('[name="vehicleNameVal"]')
          .val($(this).attr("data-model-name"));
      } else if ("existingvehiclemodelname" == button.attr("name")) {
        form
          .find('[name="existingvehicleNameVal"]')
          .val($(this).text().trim().toLowerCase().replace(/ /g, "_"));
      } else if ("statename" == button.attr("name")) {
        let cityField = form.find('[name="cityname"]');
        let list = cityField
          .parents(".cust-drop-down")
          .find(".cust-dropdown-menu ");
        var cityPath =
          defaultservlet + ".citylist." + $(this).attr("value") + ".html";
        let cityValue =
          null != (window && window.locations) ? locations.City : "";
        if (cityField.text().trim() !== cityField.attr("data-default-label")) {
          cityValue = cityField.text().trim();
        }
        populateDropdown(cityPath, list, "city", cityValue, true);
        form.find('[name="stateNameVal"]').val(button.text());
        form.find('[name="cityNameVal"]').val("");
      } else if ("statenameDistrict" == button.attr("name")) {
        let cityField = form.find('[name="cityname"]');
        let list = cityField
          .parents(".cust-drop-down")
          .find(".cust-dropdown-menu ");
        var cityPath =
          defaultservlet + ".districtlist." + $(this).attr("value") + ".html";
        let cityValue =
          null != (window && window.locations) ? locations.City : "";
        if (cityField.text().trim() !== cityField.attr("data-default-label")) {
          cityValue = cityField.text().trim();
        }
        populateDropdown(cityPath, list, "city", cityValue, true);
        form.find('[name="stateNameVal"]').val(button.text());
        form.find('[name="cityNameVal"]').val("");
      } else if ("dealerstate" == button.attr("name")) {
        let cityField = form.find('[name="dealercity"]');
        let list = cityField
          .parents(".cust-drop-down")
          .find(".cust-dropdown-menu ");
        stateName = $(this).attr("value");
        var cityPath =
          defaultservlet + ".dealercities." + $(this).attr("value") + ".html";
        let cityValue =
          null != (window && window.locations) ? locations.City : "";
        if (cityField.text().trim() !== cityField.attr("data-default-label")) {
          cityValue = cityField.text().trim();
        }
        populateDropdown(cityPath, list, "dealercity", cityValue);
        form.find('[name="dealerNameVal"]').val(button.text());
        form.find('[name="dealerCityNameVal"]').val("");
      } else if ("dealercity" == button.attr("name")) {
        let dealerName = form.find('[name="dealerVal"]');
        let dealerField = form.find('[name="dealername"]');
        let list = dealerName
          .parents(".cust-drop-down")
          .find(".cust-dropdown-menu ");
        var dealerNamePath =
          defaultservlet +
          ".dealercodes." +
          stateName +
          "." +
          $(this).attr("value") +
          ".html";
        if ($("#suggestions").length) {
          dealerNamePath =
            defaultservlet +
            ".dealercodesasc." +
            stateName +
            "." +
            $(this).attr("value") +
            ".html";
        }
        let dealerValue;
        if (
          dealerField.text().trim() !== dealerField.attr("data-default-label")
        ) {
          dealerValue = dealerField.text().trim();
        }
        populateDropdown(dealerNamePath, list, "dealer", dealerValue);
        form.find('[name="dealerCityNameVal"]').val(button.text());
      } else if ("dealername" == button.attr("name")) {
        form.find('[name="dealerVal"]').val($(this).attr("value"));
      } else if ("complaintstream" == button.attr("name")) {
        if ($(this).text().toLowerCase().replace(/\s/g, "") == "sales") {
          $("#vin-number").addClass("d-none");
          $("#vin-number input").attr("required", false);
        }
        $('button[name="complaintcategory"]').attr("disabled", false);
        let complaintCatrgoryField = $('button[name="complaintcategory"]');
        let abbrComplaint = complaintCatrgoryField.attr("data-default-label");
        complaintCatrgoryField.text(abbrComplaint);
        let complaintText = $(this).text().toLowerCase().trim();
        $('button[name="complaintcategory"]')
          .siblings("input")
          .attr("value", "");
        $('button[name="complaintstream"]')
          .siblings("input")
          .attr("value", complaintText);
        $("button[name='complaintcategory'] ~ ul li").removeClass("show");
        $("button[name='complaintcategory'] ~ ul li").each(function () {
          let dataCategory = $(this).data("category").toLowerCase();
          if (dataCategory === complaintText) {
            $(this).addClass("show");
          }
        });
      } else if ("complaintcategory" == button.attr("name")) {
        let categoryValue = $('button[name="complaintstream"]')
          .text()
          .toLowerCase();
        let complaintText = $(this).text().toLowerCase().trim();
        $('button[name="complaintcategory"]')
          .siblings("input")
          .attr("value", complaintText);
        if (categoryValue != "sales") {
          $("#vin-number").removeClass("d-none");
          $("#vin-number input").attr("required", true);
        } else {
          $("#vin-number").addClass("d-none");
          $("#vin-number input").attr("required", false);
        }
      } else if ("category-name" == button.attr("name")) {
        let category = $(this).text().replace(/\s+/g, "").toLowerCase();
        $('button[name="category-name"]')
          .siblings("input")
          .attr("value", category);
        if (category == "globalbusiness") {
          $("#state-og").hide();
          $("#state-og input").attr("required", false);
          $("#city-og").hide();
          $("#city-og input").attr("required", false);
          $("#text--state").show();
          $("#text--state input").attr("required", true);
          $("#text--city").show();
          $("#text--city input").attr("required", true);
        } else {
          $("#state-og").show();
          $("#state-og input").attr("required", true);
          $("#city-og").show();
          $("#city-og input").attr("required", true);
          $("#text--state").hide();
          $("#text--state input").attr("required", false);
          $("#text--city").hide();
          $("#text--city input").attr("required", false);
        }
      } else if ("gender" == button.attr("name")) {
        let gender = $(this).text().replace(/\s+/g, "").toLowerCase();
        $('button[name="gender"]').siblings("input").attr("value", gender);
      } else if ("cityname" == button.attr("name")) {
        form.find('[name="cityNameVal"]').val(button.text());
      }
    });

    // Cta Clicks
    let originalText = [];
    $("button.dropdown-select").each(function () {
      originalText.push($(this).text().trim());
    });

    $("#media--forms input[name='submit']").click(function () {
      let title = $('title').text();
      let errorFields = [];
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
      let validation = true;
      $("#media--forms .error--message").css("display", "none");
      $(".invalid-otp-message").addClass("d-none");
      if (
        $("#cpatchaTextBox").length > 0 &&
        $("#cpatchaTextBox").val() != captchText
      ) {
        validation = false;
        errorFields.push($("#cpatchaTextBox").attr("name"));
        $(".invalid-otp-message").removeClass("d-none");
      }
      $("#media--forms input[required]").each(function () {
        if ($(this).val() == "") {
          $(this).siblings("span").css("display", "block");
          errorFields.push($(this).attr("name"));
          validation = false;
        }
      });
      $("#media--forms textarea[required]").each(function () {
        if ($(this).val() == "") {
          $(this).siblings("span.error--message").css("display", "block");
          errorFields.push($(this).attr("name"));
          validation = false;
        }
      });
      $("#media--forms input[name='mobileno']").each(function () {
        let mobileNumber = $(this).val();
        if (mobileNumber == "") {
          $("input[name='mobileno']").siblings(".validate--msg").hide();
          $("input[name='mobileno']").siblings(".error--message").show();
          errorFields.push($(this).attr("name"));
          validation = false;
        } else {
          $("#media--forms input[name='mobileno']")
            .siblings(".validate--msg")
            .hide();
          let invalidArr = [
            "1234567890",
            "0000000000",
            "1111111111",
            "2222222222",
            "3333333333",
            "4444444444",
            "5555555555",
            "6666666666",
            "7777777777",
            "8888888888",
            "9999999999",
            "0123456789",
          ];
          if ($(this).val().length < 10) {
            $(this).siblings(".validate--msg").css("display", "block");
            errorFields.push($(this).attr("name"));
            validation = false;
          }
          if ($.inArray($(this).val(), invalidArr) != -1) {
            $(this).siblings(".validate--msg").css("display", "block");
            errorFields.push($(this).attr("name"));
            validation = false;
          }
        }
      });
      $("#media--forms input[type='email']").each(function () {
        let email = $(this).val();
        if ($(this).is("[required]")) {
          if (email == "") {
            $("#media--forms input[type='email']")
              .siblings(".validate--msg")
              .hide();
            $("#media--forms input[type='email']")
              .siblings(".error--message")
              .show();
            errorFields.push($(this).attr("name"));
            validation = false;
          } else {
            if (!validateEmail(email)) {
              $("#media--forms input[type='email']")
                .siblings(".validate--msg")
                .show();
              $("#media--forms input[type='email']")
                .siblings(".error--message")
                .hide();
                errorFields.push($(this).attr("name"));
              validation = false;
            }
          }
        } else {
          if (email != "") {
            if (!validateEmail(email)) {
              $("#media--forms input[type='email']")
                .siblings(".validate--msg")
                .show();
              $("#media--forms input[type='email']")
                .siblings(".error--message")
                .hide();
              errorFields.push($(this).attr("name"));
              validation = false;
            }
          }
        }
      });
      let currentForm = $(this).closest("form");
      if (validation) {
        mediaSubmitForm(currentForm);
      } else {
        let fields = errorFields.filter((value, index, self) => self.indexOf(value) === index).join('|');
        window.digitalData = {
          form: {
            formerrorfields: fields,
            formname: $(formSelect).find("form").attr("class"),
            formtype: $(formSelect).find("section").attr("id"),
          },
          page: {
            siteType: "AEM",
            siteCategory: siteCategory,
            fullReferringUrl: document.referrer,
            pageName: title,
            pageUrl: window.location.href,
            path: window.location.pathname,
            category: category ? category : "",
          },
        };
        _satellite.track("formError");
        console.log("fields required");
      }
      let errorMessages = $(
        "#media--forms input[required],#media--forms textarea[required]"
      ).filter(function () {
        return !this.value;
      });
      if (errorMessages.length > 0) {
        $("html, body").animate(
          {
            scrollTop: errorMessages.first().parent().offset().top - 166,
          },
          "slow"
        );
      } else {
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          "slow"
        );
      }
    });
    async function mediaSubmitForm(currentForm) {
      let firstName = "";
      let lastName = "";
      let title = $('title').text();
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
      $(".media-loader-div").removeClass("d-none");
      if ($("#suggestions").length) {
        firstName = $('[name="firstname"]').val().trim();
        lastName = $('[name="lastname"]').val().trim();
        var dataObj = {
          first_name: $('[name="firstname"]').val().trim(),
          last_name: $('[name="lastname"]').val().trim(),
          mobile: $('[name="mobileno"]').val().trim(),
          telephone: $('[name="telephone"]').val().trim(),
          email: $("#email").val().trim(),
          address_1: $("#address-1").val().trim(),
          address_2: $("#address-2").val().trim(),
          district: $('[name="cityNameVal"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          state: $('[name="stateNameVal"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          town: $("#town").val().trim(),
          pin: $("#pin").val().trim(),
          vehicle_name: $('[name="vehicleNameVal"]').val().trim(),
          vehicle_reg_no: $("#vehicle-reg-no").val().trim(),
          odometer_reading: $("#odometer").val().trim(),
          malfunction_date: $("#malfunction-date").val().trim(),
          dealer_state: $('[name="dealerNameVal"]').val().trim(),
          dealer_city: $('[name="dealerCityNameVal"]').val().trim(),
          dealer: $('[name="dealerVal"]').val().trim(),
          complaint_stream: $('[name="complaintstream"]').text(),
          complaint_category: $('[name="complaintcategory"]').text(),
          vin_number: $('[name="vin-number"]').val().trim(),
          complaint: $("#txtComplaint").val().trim(),
        };
      } else if ($("#corporate-enq").length) {
        firstName = $("#fullname-enquiries").val().trim();
        var dataObj = {
          full_name: $("#fullname-enquiries").val().trim(),
          designation: $("#designation-enquiries").val().trim(),
          category: $("#category-now").val().trim(),
          company: $('[name="company-enquiries"]').val(),
          address: $("#address-enq").val().trim(),
          state: $('[name="stateNameVal"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          state_global: $('[name="state-text-enquiries"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          city: $('[name="cityNameVal"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          city_global: $('[name="city-text-enquiries"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          phone_number: $("#phone-enquiries").val().trim(),
          mobile_number: $("#mobile-enquiries").val().trim(),
          email: $("#email").val().trim(),
          requirements: $("#txtReq").val().trim(),
          addt_info: $("#txtInfo").val().trim(),
        };
      } else if ($("#test-ride").length) {
        firstName = $("#firstname").val().trim();
        lastName = $("#lastname").val().trim();
        var dataObj = {
          first_name: $("#firstname").val().trim(),
          last_name: $("#lastname").val().trim(),
          mobile_number: $("#number").val().trim(),
          tel_number: $("#tel-number").val().trim(),
          email: $("#email").val().trim(),
          vehicle_name: $('[name="vehicleNameVal"]').val().trim(),
          state: $('[name="stateNameVal"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          district: $('[name="cityNameVal"]')
            .val()
            .replaceAll("&amp;", "and")
            .replaceAll("&", "and")
            .trim(),
          city: $("#town").val().trim(),
          existing_vehicle: $('[name="existingvehicleNameVal"]').val().trim(),
          testride_date: $("#testride-date").val().trim(),
          dealer_state: $('[name="dealerNameVal"]').val().trim(),
          dealer_city: $('[name="dealerCityNameVal"]').val().trim(),
          dealer: $('[name="dealerVal"]').val().trim(),
          enquiry: $("#txtEnquiry").val().trim(),
          expected_purchase_date: $("#expected-date").val().trim(),
          gender: $('[name="genderVal"]').val().trim(),
          age: $("#age").val().trim(),
          occupation: $('[name="occupation"]').text().trim(),
          intended_usage: $('[name="intendedusage"]').text().trim(),
        };
      }
      console.log("dataObj", dataObj);
      // let response = {message:'success', responseString :"(SBL-BPR-00162)--(SBL-EXL-00151)Error invoking service 'HHML Update Complaint Details', method 'DuplicateRepeatedComplaintCheck' at step 'Duplicate & Repeated Comp Check'.(SBL-BPR-00162)--This is duplicate complaint. A complaint with 'Complaint Number' as '10047-0123-1030' and 'VIN #' as 'MBLKCU038LHJ03125' details already exists.(SBL-EXL-00151)(SBL-EXL-00151)Failure"}
      $.ajax({
        url: $('[name="action_url"]').val(),
        type: "POST",
        data: JSON.stringify(dataObj),
        dataType: "json",
        contentType: "application/json",
        success: function (resp) {
          $(".media-loader-div").addClass("d-none");
          let response = JSON.parse(JSON.stringify(resp));
          if (response.status == "success") {
            if ($("#suggestions").length > 0) {
              successFunc(response);
              let ticketNumber = getTicketNumber(response.responseString);
              $("#successFirstName").text(firstName);
              $("#successLastName").text(lastName);
              if (window.digitalData) {
                window.digitalData = {
                  event: "Suggestions Form Submitted",
                  FormDetails: {
                    CustomerState: $('[name="stateNameVal"]')
                      .val()
                      .replaceAll("&amp;", "and")
                      .replaceAll("&", "and")
                      .trim(),
                    CustomerCity: $("#town").val().trim(),
                    CustomerPincode: $("#pin").val().trim(),
                    SelectedVehicle: $('[name="vehicleNameVal"]').val().trim(),
                    DealerTown: $('[name="dealerCityNameVal"]').val().trim(),
                    ComplaintStream: $('[name="complaintstream"]').text(),
                    ComplaintCategory: $('[name="complaintcategory"]').text(),
                    RequestID: ticketNumber,
                    FormName: "Suggestions Form",
                    FromType: "Suggestions Form",
                  },
                  page: {
                    siteType: "AEM",
                    siteCategory: siteCategory,
                    fullReferringUrl: document.referrer,
                    pageName: title,
                    pageUrl: window.location.href,
                    path: window.location.pathname,
                    category: category ? category : "",
                  },
                };
              }
            }
            if ($("#corporate-enq").length > 0) {
              successFunc(response);
              $("#successFirstName").text(firstName);
              $("#successLastName").text(lastName);
            }
            if ($("#test-ride").length > 0) {
              successFunc(response);
              let ticketNumber = "";
              $("#successFirstName").text(firstName);
              $("#successLastName").text(lastName);
              if (window.digitalData) {
                window.digitalData = {
                  event: "Product Enquiry Form Submitted",
                  FormDetails: {
                    CustomerState: $('[name="stateNameVal"]')
                      .val()
                      .replaceAll("&amp;", "and")
                      .replaceAll("&", "and")
                      .trim(),
                    CustomerCity: $("#town").val().trim(),
                    SelectedVehicle: $('[name="vehicleNameVal"]').val().trim(),
                    DealerName: $('[name="dealerVal"]').val().trim(),
                    DealerState: $('[name="dealerNameVal"]').val().trim(),
                    DealerTown: $('[name="dealerCityNameVal"]').val().trim(),
                    ExpectedPurchaseDate: $("#expected-date").val().trim(),
                    TestRideDate: $("#testride-date").val().trim(),
                    RequestID: ticketNumber,
                    FormName: "Product Enquiry Form",
                    FromType: "Product Enquiry Form",
                    Gender: $('[name="genderVal"]').val().trim(),
                    Age: $("#age").val().trim(),
                    IntendedUsage: $('[name="intendedusage"]').text().trim(),
                  },
                  page:{
                    siteType:'AEM',
                    siteCategory: siteCategory,
                    fullReferringUrl: document.referrer,
                    pageName: title,
                    pageUrl: window.location.href,
                    path: window.location.pathname,
                    category: category ? category : '',
                  },
                };
              }
            } else {
              $(currentForm).find(".book-test-submit").removeAttr("disabled");
            }
          } else {
            $(".media-component .addressPan").addClass("d-none");
            $(".media-component .query--para").addClass("d-none");
            $(".media-component .form--note").addClass("d-none");
            $(".server-fail-msg").removeClass("d-none");
          }
        },
        error: function (error) {
          $(".media-loader-div").addClass("d-none");
          $(".media-component .addressPan").addClass("d-none");
          $(".media-component .query--para").addClass("d-none");
          $(".media-component .form--note").addClass("d-none");
          $(".server-fail-msg").removeClass("d-none");
          console.log("error: invalid input", error);
        },
      });
    }

    function getTicketNumber(response) {
      let ticketNo = response;
      let match = ticketNo.match(/(\d{5}-\d{4}-\d{4})/);
      if (match && match[0]) {
        return $("#ticketNo").text(match[0]);
      } else {
        return "";
      }
    }

    function successFunc(response) {
      $(".server-success-msg").removeClass("d-none");
      $(".media-component .query--para").addClass("d-none");
      $(".media-component .form--note").addClass("d-none");
      $(".media-component .addressPan").addClass("d-none");
    }

    $("#media--forms input[name='reset']").click(function () {
      $("#media--forms .error--message").css("display", "none");
      $("input.campaign-input").val("");
      $("input[type='hidden']").val("");
      $(".form--wrap textarea").val("");
      $('input[type="checkbox"]').prop("checked", false);
      $("#email").siblings(".error--message").hide();
      $("button.dropdown-select").removeClass("active");
      $("button.dropdown-select").each(function (index) {
        $(this).text(originalText[index]);
      });
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        "slow"
      );
    });

    // CAPTCHA CODE
    function dec2hex(dec) {
      return dec.toString(16).padStart(2, "0");
    }
    function generateId(len) {
      var arr = new Uint8Array((len || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, dec2hex).join("");
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
          captchText = resp;
        },
        error: function () {},
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
      document.getElementById("captcha").appendChild(canv); // adds the canvas to the body element
    }
  }
});
