$(document).ready(function () {
    function getPageDetails() {
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
      return {
        siteType: "AEM",
        siteCategory: pcSplit[0],
        fullReferringUrl: document.referrer,
        fullSlug: actualSlug,
        fullURL: window.location.href,
        hostName: window.location.origin,
        pagename: title,
        PageTitle: title,
        pageURL: window.location.href,
        path: window.location.pathname,
        category: sub1,
        categorylevel1: sub2,
        categorylevel2: sub3,
        categorylevel3: sub4,
      };
    }
  
    window.digitalData = {
      event: "pageView",
      page: getPageDetails(),
    };
  
    let formFields = document.querySelectorAll("#loginForm input");
  
    let startEventSent = false;
  
    formFields.forEach((key) => {
      key.addEventListener("focus", () => {
        if (!startEventSent) {
          window.digitalData = {
            event: "Dealer Login Initiated",
            LoginDetails: {
              loginLocation: 'dealer-portal' + '-' +  $("title").text(),
            },
            page: getPageDetails(),
          };
        }
        startEventSent = true;
      });
    });
  
    $('a').click(function (e) {
      if(e.target.text || $(e.currentTarget).attr('data-aa-text')){
        if (window.digitalData) {
          window.digitalData = {
            event: "CTA Button Click",
            CTADetails: {
              location: 'dealer-portal' + ' ' +  $("title").text(),
              text: e.target.text ? 'dealer-portal' + ' ' + e.target.text : $(e.currentTarget).attr('data-aa-text'),
            },
            page: getPageDetails(),
          }
        }
      }
    });
  
    $('.quick-links').click(function (e) {
      let selectedNode = e.target.parentNode.parentNode.parentNode.parentNode.querySelector('.generic-text');
      let ctaText = selectedNode.querySelector('p').innerHTML;
        if (window.digitalData) {
          window.digitalData = {
            event: "CTA Button Click",
            CTADetails: {
              location: 'dealer-portal' +  ' ' +  $("title").text(),
              text: ctaText ? 'dealer-portal' + ' ' + ctaText : '' ,
            },
            page: getPageDetails(),
          }
        }
    });
  
    $('.social-links').click(function (e) {
      if (window.digitalData) {
        window.digitalData = {
          event: "CTA Button Click",
          CTADetails: {
            location: 'dealer-portal' +  ' ' +  $("title").text(),
            text:  $(this).attr('alt'),
          },
          page: getPageDetails(),
        }
      }
    });
  
  });
  