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

  let pagePath = window.location.pathname;
  let slug = pagePath.split("/");
  let actualSlug = slug[1].replace(".html", "");
  let primary_category = window.location.origin;
  let fullSplit = primary_category.split("//");
  let pcSplit = fullSplit[1].split(".");
  let title = $("title").text();
  let sub1 = "";
  let sub2 = "";
  let sub3 = "";
  let sub4 = "";
  if ($(".cmp-breadcrumb .breadcrumb-item:eq(0) span").text()) {
    sub1 = $(".cmp-breadcrumb .breadcrumb-item:eq(0) span").text();
    if ($(".cmp-breadcrumb .breadcrumb-item:eq(1) span").text())
      sub2 = $(".cmp-breadcrumb .breadcrumb-item:eq(1) span").text();
    if ($(".cmp-breadcrumb .breadcrumb-item:eq(2) span").text())
      sub3 = $(".cmp-breadcrumb .breadcrumb-item:eq(2) span").text();
    if ($(".cmp-breadcrumb .breadcrumb-item:eq(3) span").text())
      sub4 = $(".cmp-breadcrumb .breadcrumb-item:eq(3) span").text();
  } else {
    if (slug[2]) sub1 = slug[2].replace(".html", "");
    if (slug[3]) sub2 = slug[3].replace(".html", "");
    if (slug[4]) sub3 = slug[4].replace(".html", "");
    if (slug[5]) sub4 = slug[5].replace(".html", "");
  }
  window.digitalData = {
    event: "pageView",
    page: {
      siteType: "AEM",
      siteCategory: pcSplit[0],
      fullReferringUrl: document.referrer,
      fullSlug: actualSlug,
      fullURL: window.location.href,
      hostName: window.location.origin,
      pageName: title,
      PageTitle: title,
      pageURL: window.location.href,
      path: window.location.pathname,
      category: sub1,
      categorylevel1: sub2,
      categorylevel2: sub3,
      categorylevel3: sub4,
      country: current_country,
      Language: current_language,
    },
  };

  $("#dealer-form-continue").on("click", function () {
    let productName = document
      .querySelector('#hd-bsn [data-aa-name="product-name"]')
      .textContent.trim();
    let variantColor = document
      .querySelector('#hd-bsn [data-aa-name="product-variant-color"]')
      .textContent.trim();
    let splitVariant = variantColor.indexOf("(");
    let productVariant = variantColor.substring(0, splitVariant).trim();
    let startIndex = variantColor.indexOf("(");
    let endIndex = variantColor.indexOf(")");
    let productColour = variantColor.substring(startIndex + 1, endIndex).trim();
    let dealerName = document
      .querySelector('#hd-bsn [data-aa-name="dealer-detail"]')
      .textContent.trim();
    if (window.digitalData) {
      window.digitalData = {
        event: "Booking Started",
        product: {
          productName: productName,
          productVariant: productVariant,
          productColour: productColour,
        },
        dealerDetails: {
          dealerName: dealerName ? dealerName : "NA",
        },
        page: getPageDetails(),
      };
    }
  });

  $("#pay-now").on("click", function () {
    let productName = document
      .querySelector('.bike__details [data-aa-name="product-name"]')
      .textContent.trim();
    document.cookie = `productName=${productName};`;
    let productVariant = $("#varient span").text();
    let productColour = $("#color span").text();
    let exShowroomPrice = $(".showroom--price").text();
    let dealerName = document.querySelector('[data-aa-name="dealer-detail"]')
    .innerText.trim()
    let amountCTA = document.getElementById("pay-now").textContent.trim();
    let splitAmount = amountCTA.match(/\d+/);
    let paymentAmount = splitAmount[0];
    if (window.digitalData) {
      window.digitalData = {
        event: "Harley Payment Redirect Clicked",
        product: {
          productName: productName,
          productVariant: productVariant,
          productColour: productColour,
          productPrice: paymentAmount,
          paymentAmount: paymentAmount,
          exShowroomPrice: exShowroomPrice,
        },
        dealerDetails: {
          dealerName: dealerName,
        },
        customerDetails: {
          customerState: document.getElementById("state").textContent.trim(),
          customerCity: document.getElementById("city").textContent.trim(),
          customerPinCode: document.querySelector('input[name="pin"]').value,
        },
        page: getPageDetails(),
      };
    }
  });
});
