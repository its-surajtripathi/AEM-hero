$(document).ready(function () {
  let bseBtn = $("#bse-btn");
  let nseBtn = $("#nse-btn");

  let bseContent = $("#bse");
  let nseContent = $("#nse");

  bseBtn.addClass("active-stock");

  bseBtn.click(function () {
    bseContent.removeClass("hidden");
    nseContent.addClass("hidden");
    bseBtn.addClass("active-stock");
    nseBtn.removeClass("active-stock");
  });

  nseBtn.click(function () {
    bseContent.addClass("hidden");
    nseContent.removeClass("hidden");
    bseBtn.removeClass("active-stock");
    nseBtn.addClass("active-stock");
  });

  $(".investor-calendar").click(function (event) {
    event.stopPropagation();
    let dropdown = $(this)
      .parent()
      .find(".investor-events-calender-wrapper-mailoptions");
    if (dropdown.hasClass("d-none")) {
      $(".investor-events-calender-wrapper-mailoptions").addClass("d-none");
      dropdown.removeClass("d-none");
    } else {
      $(".investor-events-calender-wrapper-mailoptions").addClass("d-none");
    }
  });

  $(".investor-events-mailoptions").click(function (event) {
    let mailOptions = $(this);
    let options = mailOptions.attr("aria-label");
    let subject = encodeURIComponent(
      mailOptions.closest(".banner-headline").find("p:first-child").text()
    );

    let icalSubject = mailOptions
      .closest(".banner-headline")
      .find("p:first-child")
      .text();

    let eventdate = mailOptions
      .closest(".banner-headline")
      .find(".investor-meet-date")
      .text();

    let location = encodeURIComponent(
      mailOptions.closest(".banner-headline").find("p:first-child")
    );

    let gmailDateISOString = new Date(eventdate)
      .toISOString()
      .replace(/[^a-zA-Z0-9]/g, "");

    let formatedEventDate = encodeURIComponent(
      new Date(eventdate).toISOString()
    );

    let yahoodateISOString = dateFormatFunct(eventdate)
      .toISOString()
      .replace(/[^a-zA-Z0-9]/g, "");

    let hrefLink = `https://outlook.office.com/calendar/0/deeplink/compose?body=${subject}&enddt=&location=${location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${formatedEventDate}&subject=${subject}`;
    switch (options) {
      case "outlook":
        window.open(
          `https://outlook.office.com/calendar/0/deeplink/compose?body=${subject}&enddt=&location=${location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&startdt=${formatedEventDate}&subject=${subject}`
        );
        break;
      case "gmail":
        window.open(
          `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${gmailDateISOString}/${gmailDateISOString}&details=${subject}&location=${location}&text=${subject}`
        );
        break;
      case "ical":
        createFile(icalSubject, eventdate, eventdate, location);
        break;
      case "yahoo":
        window.open(
          `https://calendar.yahoo.com/?desc=${subject}&dur=&et=${yahoodateISOString}&in_loc=${location}&st=${yahoodateISOString}&title=${subject}&v=60`
        );
        break;
      case "default":
        console.log("no events");
        break;
    }
  });

  function createFile(subject, today, today) {
    var eventDate = {
      start: today,
      end: today,
    };
    makeIcsFile(eventDate, subject, subject);
  }

  function convertDate(date) {
    var event = new Date(dateFormatFunct(date)).toISOString();
    event = event.split("T")[0];
    event = event.split("-");
    event = event.join("");
    return event;
  }

  function makeIcsFile(date, summary, description) {
    var event =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//Test Cal//EN\n" +
      "VERSION:2.0\n" +
      "BEGIN:VEVENT\n" +
      "UID:test-1\n" +
      "DTSTART;VALUE=DATE:" +
      convertDate(date.start) +
      "\n" +
      "DTEND;VALUE=DATE:" +
      convertDate(date.end) +
      "\n" +
      "SUMMARY:" +
      summary +
      "\n" +
      "DESCRIPTION:" +
      description +
      "\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR";
    window.open("data:text/calendar;charset=utf8," + escape(event));
  }

  function dateFormatFunct(eventdate) {
    let today = new Date(eventdate);
    let tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  }

  var investorsURL = window.location.href;

  if (investorsURL.includes("/en-in/investors")) {
    $(".slider-content").addClass("investors-banner-text");
    $(".scooter-banner-slide").addClass("investors-banner-img");
  }

  $("#harley-carousel .scroll-down-btn").on('click', function () {
    let bannerHeight = $("#harley-carousel").height()
    $("html, body").animate({ scrollTop: bannerHeight - 10 }, "slow");
  })
});