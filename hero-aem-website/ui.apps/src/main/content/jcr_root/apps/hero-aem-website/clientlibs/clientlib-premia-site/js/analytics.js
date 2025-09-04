$(document).ready(function () {
  function getPageDetails() {
    let title = $("title").text();
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
    return {
      sitetype: "AEM",
      siteCategory: siteCategory,
      fullReferringUrl: document.referrer,
      pageName: title,
      pageUrl: window.location.href,
      path: window.location.pathname,
      category: category,
    };
  }

  $(".premia-header-home-button-wrapper .button a").click(function (e) {
    if (window.digitalData) {
      window.digitalData = {
        event: "CTA Button Click",
        CTADetails: {
          location: "header-button",
          text: e.target.querySelector('span').innerHTML,
        },
        page: getPageDetails(),
      };
    }
  });

  $(".premia-invite-circle").click(function () {
   
    if (window.digitalData) {
      window.digitalData = {
        event: "CTA Button Click",
        CTADetails: {
          location: "premia-form-initiator",
          text: $('.premia-invite-circle a').attr('aria-label'),
        },
        page: getPageDetails(),
      };
    }
  });

  $(".countdown-streaming-link").click(function () {
    if (window.digitalData) {
      window.digitalData = {
        event: "CTA Button Click",
        CTADetails: {
          location: "hero-banner",
          text: 'watch live streaming',
        },
        page: getPageDetails(),
      };
    }
  });

  let formFields = document.querySelectorAll(
    ".premia-invitation-form form input"
  );

  let startEventSent = false;

  formFields.forEach((key) => {
    key.addEventListener("focus", () => {
      if (!startEventSent) {
        window.digitalData = {
          form: {
            formfield: key.name,
            formname: $('.premia-invitation-form form').attr('id'),
            formtype: $('.premia-invitation-form form').attr('data-aa-form-type'),
          },
          page: getPageDetails(),
        };
        _satellite.track("formStart");
      }
      startEventSent = true;
    });
  });
});
