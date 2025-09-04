$(document).ready(function () {
  function getPageDetails() {
    let title = $("title").text();
    return {
      fullReferringUrl: document.referrer,
      pageName: title,
      pageUrl: window.location.href,
      path: window.location.pathname,
    };
  }

  function getCookie(name) {
    const cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split("=");
      const cookieName = cookiePair[0].trim();
      if (cookieName === name) {
        return cookiePair[1];
      }
    }
    return null;
  }

  if ($(".harley-payment-layout").length > 0) {
    let enc_post_request = getURLParameter("enc_post_request");
    let defaultServlet = $("#payment-decrypt-servlet").val();
    var respData = {
      encrypted_value: enc_post_request,
    };

    if (!(enc_post_request && enc_post_request.length > 0)) {
      $(".left-hp-section .payment-success-img").addClass("d-none");
      $(".left-hp-section .payment-success-msg").addClass("d-none");
      $(".left-hp-section .payment-failure-img").removeClass("d-none");
      $(".left-hp-section .payment-failure-msg").removeClass("d-none");

      $("#modelColor").parent().addClass("d-none");
      $("#modelName").parent().addClass("d-none");
      $(".left-hp-section .payment-order-no").addClass("d-none");
      $("#modelPrice").parent().addClass("d-none");
    }
    $.ajax({
      type: "POST",
      url: defaultServlet + ".decryptservlet.json",
      data: respData,
      success: function (response) {
        let resp = response;
        if (typeof response != "object") {
          resp = JSON.parse(response);
        }
        responseFunc(resp);
      },
      error: function (err) {
        console.log(err);
        $(".left-hp-section .payment-success-img").addClass("d-none");
        $(".left-hp-section .payment-success-msg").addClass("d-none");
        $(".left-hp-section .payment-failure-img").removeClass("d-none");
        $(".left-hp-section .payment-failure-msg").removeClass("d-none");

        $("#modelColor").parent().addClass("d-none");
        $("#modelName").parent().addClass("d-none");
        $(".left-hp-section .payment-order-no").addClass("d-none");
        $("#modelPrice").parent().addClass("d-none");
      },
    });

    function responseFunc(resp) {
      let result = resp;
      if (result["order_status"].toLowerCase() == "success") {
        $(".left-hp-section .payment-success-img").removeClass("d-none");
        $(".left-hp-section .payment-success-msg").removeClass("d-none");
        $(".left-hp-section .payment-failure-img").addClass("d-none");
        $(".left-hp-section .payment-failure-msg").addClass("d-none");
        $("#successStep").removeClass("d-none");
        $(".left-hp-section .payment-order-no span").text(
          result["eshop_order_id"]
        );
        $("#modelName").text(result["modal_name"]);
        $("#modelPrice").text(`₹ ${Math.round(result["exshowroom_price"])}`);
        $("#modelColor").text(result["bike_color"]);
        if (window.digitalData) {
          window.digitalData = {
            event: "Harley Payment Success",
            product: {
              productName: getCookie("productName"),
              productVariant: result["modal_name"]
                ? result["modal_name"]
                : "NA",
              productColour: result["bike_color"] ? result["bike_color"] : "NA",
              productPrice: result["booking_amount"]
                ? result["booking_amount"]
                : "NA",
              paymentAmount: result["booking_amount"]
                ? result["booking_amount"]
                : "NA",
              exShowroomPrice: result["exshowroom_price"]
                ? `${Math.round(result["exshowroom_price"])}`
                : "NA",
            },
            orderDetails: {
              orderID: result["eshop_order_id"],
              transactionID: "NA",
              bankReferanceNumber: "NA",
              orderStatus: result["order_status"]
                ? result["order_status"]
                : "NA",
            },
            page: getPageDetails(),
          };
        }
      } else {
        $(".left-hp-section .payment-success-img").addClass("d-none");
        $(".left-hp-section .payment-success-msg").addClass("d-none");
        $(".left-hp-section .payment-failure-img").removeClass("d-none");
        $(".left-hp-section .payment-failure-msg").removeClass("d-none");
        $(".left-hp-section .payment-order-no span").text("NA");
        $("#failureStep").removeClass("d-none");
        if (result["eshop_order_id"]) {
          $(".left-hp-section .payment-order-no span").text(
            result["eshop_order_id"]
          );
        } else {
          $(".left-hp-section .payment-order-no").addClass("d-none");
        }
        if (result["bike_color"]) {
          $("#modelColor").text(result["bike_color"]);
        } else {
          $("#modelColor").parent().addClass("d-none");
        }
        if (result["modal_name"]) {
          $("#modelName").text(result["modal_name"]);
        } else {
          $("#modelName").parent().addClass("d-none");
        }

        if (result["exshowroom_price"]) {
          $("#modelPrice").text(`₹ ${Math.round(result["exshowroom_price"])}`);
        } else {
          $("#modelPrice").parent().addClass("d-none");
        }

        if (window.digitalData) {
          window.digitalData = {
            event: "Harley Payment Failure",
            product: {
              productName: getCookie("productName"),
              productVariant: result["modal_name"]
                ? result["modal_name"]
                : "NA",
              productColour: result["bike_color"] ? result["bike_color"] : "NA",
              productPrice: result["booking_amount"]
                ? result["booking_amount"]
                : "NA",
              paymentAmount: result["booking_amount"]
                ? result["booking_amount"]
                : "NA",
              exShowroomPrice: result["exshowroom_price"]
                ? `${Math.round(result["exshowroom_price"])}`
                : "NA",
            },
            orderDetails: {
              orderID: "NA",
              transactionID: "NA",
              bankReferanceNumber: "NA",
              orderStatus: result["order_status"]
                ? result["order_status"]
                : "NA",
            },
            page: getPageDetails(),
          };
        }
      }
    }

    function getURLParameter(sParam) {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split("&");
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] == sParam) {
          return sParameterName[1];
        }
      }
    }
  }
});
