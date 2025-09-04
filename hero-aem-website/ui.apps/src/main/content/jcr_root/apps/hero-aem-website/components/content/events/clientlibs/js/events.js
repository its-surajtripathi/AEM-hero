$(document).ready(function () {
  $(".events-calender-wrapper-cal").click(function (event) {
    event.stopPropagation();
    let dropdown = $(this)
      .parent()
      .find(".events-calender-wrapper-mailoptions");
    if (dropdown.hasClass("d-none")) {
      $(".events-calender-wrapper-mailoptions").addClass("d-none");
      dropdown.removeClass("d-none");
    } else {
      $(".events-calender-wrapper-mailoptions").addClass("d-none");
    }
  });

  $(".mailoptions").click(function (event) {
    let mailOptions = $(this);
    let options = mailOptions.attr("aria-label");
    let subject = encodeURIComponent(
      mailOptions
        .closest(".events-calender-wrapper")
        .find(".events-calender-wrapper-desc")
        .text()
    );
    let icalSubject = mailOptions
      .closest(".events-calender-wrapper")
      .find(".events-calender-wrapper-desc")
      .text();
    let eventdate = mailOptions
      .closest(".events-calender-wrapper")
      .find(".events-calender-wrapper-date")
      .text();
    let location = encodeURIComponent(
      mailOptions
        .closest(".events-calender-wrapper")
        .find(".events-calender-wrapper-label")
        .text()
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

});
