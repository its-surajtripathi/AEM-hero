$(document).ready(function () {
  if ($(".investor-download-reports").length > 0) {
    var reportsYear;
    var urlParams = new URLSearchParams(window.location.search);
    var has_year = urlParams.has("year");
    var yearParams = urlParams.get("year");
    var reportAligner = $(".report-aligner");
    let arr = [];
    let quaterData = $(".select-year-div").data("quater");
    var investorData = quaterData;
    var hash = window.location.hash;
    if (typeof quaterData != "object") {
      investorData = quaterData && JSON.parse(quaterData);
    }
    reportAligner &&
      reportAligner.each(function () {
        if ($(this).data("category")) {
          arr.push($(this).data("category"));
        }
      });
    var eventsCallRecording = $(".quarterly-report-container");
    eventsCallRecording &&
      eventsCallRecording.each(function () {
        if ($(this).data("category")) {
          arr.push($(this).data("category"));
        }
      });
    let reportsPath = $("#reports-category").data("path");
    let data = {
      investorsCategory: reportsPath,
      categoryName: arr,
    };
    $.ajax({
      type: "GET",
      data: data,
      traditional: true,
      url: "/content/hero-aem-website/in/en-in/investors/_jcr_content.investors.json",
      success: function (response) {
        let resp = response;
        if (typeof response != "object") {
          resp = JSON.parse(response);
        }
        if (resp) {
          if (investorData) resp = resp.concat(investorData);
          reportsYear = resp;
          if (arr.length > 0) {
            reportsYear = resp.filter((element) => {
              return arr.some((childArr) => {
                return childArr === element.folderName;
              });
            });
          }
          console.log(reportsYear);
          years(reportsYear);
          quaterReportOptions(reportsYear);
          let findYear = reportsYear.filter((ele) => ele.year == yearParams);
          if (has_year && findYear.length > 0) {
            let yearsSection = $("#years-lists ul li.calendar-year");
            yearsSection.each(function () {
              if ($(this).text() == yearParams) {
                $(this).trigger("click");
              }
            });
            $("#years-lists ul").addClass("d-none");
            $("#select-quarter").trigger("change");
          } else {
            reportAligner &&
              reportAligner.each(function () {
                let reports = $(this);
                let categorySection = $(this).data("category");
                categorySection &&
                  sessionfunct(
                    reportsYear,
                    $("#years-lists").val(),
                    categorySection,
                    reports
                  );
              });
            eventsCallRecording &&
              eventsCallRecording.each(function () {
                let reports = $(this);
                let categorySection = $(this).data("category");
                categorySection &&
                  sessionfunct(
                    reportsYear,
                    $("#years-lists").val(),
                    categorySection,
                    reports
                  );
              });
            eventsCallRecording && callRecordings();
            $("#years-lists ul li.calendar-year").first().trigger("click");
            $("#years-lists ul").addClass("d-none");
            $("#select-quarter").trigger("change");
          }
          hash &&
            $("html, body").animate(
              {
                scrollTop: $(hash).offset().top - 166,
              },
              "slow"
            );
        }
      },
      error: function (err) {
        console.log("error", err);
      },
    });

    function years(resp) {
      let data = resp;
      let yearsArr = [];
      data.forEach(function (ele) {
        if (ele.year) {
          yearsArr.push(ele.year);
        }
      });
      let years = yearsArr.filter(
        (item, index) => yearsArr.indexOf(item) === index
      );
      let sortedYears = years.sort((a, b) => (a > b ? -1 : 1));
      let selectYears = $("#years-lists ul");
      sortedYears.forEach(function (ele) {
        let yearOptions = `<li class="calendar-year" value="${ele}">${ele}</li>`;
        selectYears.append(yearOptions);
      });
    }

    $("#years-lists").click(function () {
      $(this).find("ul").toggleClass("d-none");
    });

    $("#years-lists").on("click", "li.calendar-year", function () {
      $("#years-lists p").text($(this).text());
      let selectedYear = $(this).text();
      reportAligner &&
        reportAligner.each(function () {
          let reports = $(this);
          let categorySection = $(this).data("category");
          categorySection &&
            sessionfunct(reportsYear, selectedYear, categorySection, reports);
        });
      eventsCallRecording &&
        eventsCallRecording.each(function () {
          let reports = $(this);
          let categorySection = $(this).data("category");
          categorySection &&
            sessionfunct(reportsYear, selectedYear, categorySection, reports);
        });
      eventsCallRecording && callRecordings();
      populateQuarterDropdown(selectedYear, reportsYear);
      $("#select-quarter").trigger("change");
    });

    /* Annual Page Report */

    // $(".report-category-link").click((event) => {
    //   event.preventDefault();
    //   let url = event.currentTarget.getAttribute("href");
    //   let reportYear = $("#years-lists p").text();
    //   window.location.href = `${url}?year=${reportYear}`;
    // });

    let quarterSelect = $("#select-quarter");

    function quaterReportOptions(reportsYear) {
      let selected = $("#years-lists p").text();
      console.log(selected, "selected");
      let quaterOptions = reportsYear.filter((ele) => ele.year == selected);
      if (quaterOptions) {
        let quarters = [
          ...new Set(quaterOptions.map((data) => data.quarters)),
        ].sort((a, b) => {
          let aQuarter = parseInt(a.replace(/[^\d]/g, ""));
          let bQuarter = parseInt(b.replace(/[^\d]/g, ""));
          return aQuarter - bQuarter;
        });
        quarters.forEach((quarter) => {
          quarter &&
            quarterSelect.append(
              `<option value="${quarter}">${quarter}</option>`
            );
        });
      } else {
        let quarters = [
          ...new Set(reportsYear.map((data) => data.quarters)),
        ].sort((a, b) => {
          let aQuarter = parseInt(a.replace(/[^\d]/g, ""));
          let bQuarter = parseInt(b.replace(/[^\d]/g, ""));
          return aQuarter - bQuarter;
        });
        quarters.forEach((quarter) => {
          quarter &&
            quarterSelect.append(
              `<option value="${quarter}">${quarter}</option>`
            );
        });
      }
    }

    function populateQuarterDropdown(selectedYear, reportsYear) {
      let filteredData = reportsYear.filter(
        (data) => data.year === selectedYear
      );

      let uniqueQuarters = [
        ...new Set(filteredData.map((data) => data.quarters)),
      ].sort((a, b) => b.localeCompare(a));
      let quarterDropdown = $("#select-quarter");
      quarterDropdown.empty();
      uniqueQuarters.forEach((quarter) => {
        if (quarter) {
          let option = $("<option></option>")
            .attr("value", quarter)
            .text(quarter);
          quarterDropdown.append(option);
        }
      });
    }

    $("#select-quarter").on("change", function () {
      let selectedyear = $("#years-lists p").text();
      let selectedQuater = $(this).val();
      let parentElement = $(".events-calender");
      parentElement.html("");
      let data = reportsYear.filter(
        (ele) => ele.year == selectedyear && ele.quarters == selectedQuater
      );
      data = data.sort(function (a, b) {
        var aa = a.event_date.split("-").reverse().join(),
          bb = b.event_date.split("-").reverse().join();
        return aa > bb ? -1 : bb > aa ? 1 : 0;
      });
      if (selectedQuater) {
        data.forEach((ele) => {
          let elements = "";
          elements = `<div class="events-calender-wrapper">
          <div>
              <div class="events-calender-wrapper-label">${ele.event}</div>
              <div class="events-calender-wrapper-desc">${ele.title}</div>
          </div>
          <div class="date-wrapper">
              <div class="events-calender-wrapper-date">${ele.event_date}</div>
              <div class="events-calender-wrapper-venue">${ele.venue}</div>
          </div>
      </div>`;
          parentElement.append(elements);
        });
        parentElement.closest(".events-container").removeClass("d-none");
      } else {
        let elements = "";
        elements = `<div class="events-calender-wrapper">
        <div>
            <div class="events-calender-wrapper-label">The data for selected year doesn't exist</div>
        </div>
    </div>`;
        parentElement.append(elements);
        parentElement.closest(".events-container").addClass("d-none");
      }
    });

    /* Annual Report Data Fetch */

    function sessionfunct(reportsYear, yearParams, categoryParams, reports) {
      let reportsPDF = reportsYear.filter(
        (ele) => ele.folderName == categoryParams && ele.year === yearParams
      );
      console.log(reportsPDF, "reportsPDF");
      reportsPDF = reportsPDF.sort((a, b) => {
        if (
          a.quarter &&
          b.quarter &&
          parseInt(a.quarter) > parseInt(b.quarter)
        ) {
          return -1;
        }
      });
      reports.html("");
      if (reportsPDF.length > 0) {
        reportsPDF.forEach((ele) => {
          let data = "";

          if (reports.hasClass("report-aligner")) {
            data = `<div class="report-container">
            <div class="border-line"></div>
            <div class="report-details">
              <div class="report-name">${ele.title}</div>
              <div class="report-link">
                <div class="report-download"><img src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/download-icon.png"><a href=${
                  ele.path
                }> Download </a></div>
                <div class="report-size"> ${
                  ele.size && ele.size.toFixed(2)
                } MB</div>
              </div>
            </div>
          </div>
          <div class="border-line-mobile"></div>`;
          } else {
            data = `  <div class="quarterly-reports-wrapper">
            <div class="reports-quarterly-heading">${ele.title}</div>
            <div class="quarterly-file-wrapper">
                <div class="report-size-text">${ele.description}</div>
                <div class="quarter-audio-wrapper-image" data-toggle="modal" data-target="#audioModal"><img
                    src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/audio.png"
                    alt="audio" />
                    <span class="audio-label-text">Audio Clip</span>
                    <div class="modal fade" id="audioModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                  <audio src="${ele.path}" id="audioFile">
                                    Audio is not supported.
                                </audio>
                                <div class="music_volume">
                                    <div class="quarterly-clickable-container">
                                        <div id="btnPlay"><img  class="music-pause-img" src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/music_pause.png"></div>
                                        <div id="btnPause"><img  class="music-pause-img" src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/music_play.svg"></div>
                                        <label id="lblTime" class="label-text">00:00</label>
                                        <input type="range" step="any" id="seekbar">
                                        <label id="lblTimeDuration" class="label-text"></label>
                                        <div id="btnMute"><img  class="music-volume-img" src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/music_volume.svg"></div>
                                    </div>
                                    <div id="btnClose" data-dismiss="modal" ><img  class="music-close-img" src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/music_close.svg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="d-flex align-items-center" href="${ele.path}" target="_blank" download>
                    <div class="quarterly-download-wrapper">
                        <img class="quarterly-download-image-toolkit" src="/etc.clientlibs/hero-aem-website/clientlibs/clientlib-site/resources/images/icons/download-svg.svg">
                    </div>
                    <div class="single-reports-quarter-download">Download</div>
                </a>
            </div>
        </div>`;
          }
          reports.append(data);
        });
        reports.closest(".annual-report-container").removeClass("d-none");
        if (reports.find(".report-container").length > 1) {
          reports
            .parent()
            .parent()
            .parent()
            .find(".report-footer")
            .removeClass("d-none");
        } else {
          reports
            .parent()
            .parent()
            .parent()
            .find(".report-footer")
            .addClass("d-none");
        }
      } else {
        let data = `<div class="report-container">
      <div class="border-line"></div>
        <div class="report-details">
          <div class="report-name">The data for selected year doesn't exist</div>
        </div>
      </div>`;
        reports.append(data);
        reports
          .parent()
          .parent()
          .parent()
          .find(".report-footer")
          .addClass("d-none");
        reports.closest(".annual-report-container").addClass("d-none");
      }
    }
    hash &&
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top - 166,
        },
        "slow"
      );
  }

  function callRecordings() {
    if ($(".quarterly-call-container-fluid").length > 0) {
      const audiodefault = $(
        ".quarterly-reports-wrapper .quarterly-file-wrapper a:first"
      ).attr("href");
      let audio;
      let volumeRange = document.getElementById("volume");
      let seekbar = document.getElementById("seekbar");

      $(".quarter-audio-wrapper-image").on("click", function () {
        $(".quarterly-call-container #btnPlay img").removeClass("d-none");
        $(".quarterly-call-container #btnPause img").addClass("d-none");
        if ($(this).find("audio").attr("src") === "undefined") {
          document
            .getElementById("audioFile")
            .setAttribute("src", audiodefault);
        } else {
          document
            .getElementById("audioFile")
            .setAttribute("src", $(this).find("audio").attr("src"));
        }

        audio = document.getElementById("audioFile");

        audio.play();
        audio.addEventListener("timeupdate", UpdateTheTime, false);
        audio.addEventListener("durationchange", SetSeekBar, false);
        volumeRange.value = audio.volume;
      });

      $(".quarterly-call-container #btnPause").click(function () {
        $("#btnPlay img").removeClass("d-none");
        $("#btnPause img").addClass("d-none");
        if (audio.paused) {
          audio.play();
        } else if (audio.ended) {
          audio.currentTime = 0;
          audio.play();
        }
      });

      $(".music_volume .quarterly-clickable-container").click(function (
        clickEvent
      ) {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
      });

      $(".quarterly-call-container #btnPlay").click(function () {
        if (audio.play) {
          $("#btnPause img").removeClass("d-none");
          $("#btnPlay img").addClass("d-none");
          audio.pause();
        }
      });

      $(".quarterly-call-container #btnMute").click(function () {
        if (audio.muted) {
          audio.muted = false;
          volumeRange.value = audio.volume;
        } else {
          audio.muted = true;
          volumeRange.value = 0;
        }
      });

      $(".quarterly-call-container #volume").change(function () {
        var myVol = volumeRange.value;
        audio.volume = myVol;
        if (myVol == 0) {
          audio.muted = true;
        } else {
          audio.muted = false;
        }
      });

      $(".quarterly-call-container #seekbar").change(function () {
        audio.currentTime = seekbar.value;
      });

      // fires when page loads, it sets the min and max range of the video
      function SetSeekBar() {
        seekbar.min = 0;
        seekbar.max = audio.duration;
      }

      function UpdateTheTime() {
        var sec = audio.currentTime;
        sec = sec % 3600;
        var min = Math.floor(sec / 60);
        sec = Math.floor(sec % 60);
        if (sec.toString().length < 2) sec = "0" + sec;
        if (min.toString().length < 2) min = "0" + min;
        document.getElementById("lblTime").innerHTML = min + ":" + sec;
        const durationMinutes = Math.floor(Math.round(audio.duration) / 60);
        const durationSeconds =
          Math.round(audio.duration) - durationMinutes * 60;
        document.getElementById("lblTimeDuration").innerHTML =
          durationMinutes + ":" + durationSeconds;
        if (audio.currentTime === audio.duration) {
          console.log("Coming??");
          $("#btnPause img").removeClass("d-none");
          $("#btnPlay img").addClass("d-none");
        }
        seekbar.min = audio.startTime;
        seekbar.max = audio.duration;
        seekbar.value = audio.currentTime;
      }

      $(".quarterly-call-container #audioModal").on(
        "hide.bs.modal",
        function () {
          audio.removeAttribute("src");
        }
      );

      if ($(window).width() < 569) {
        $(".quarterly-mobile-img").removeClass("d-none");
        $(".quarterly-desktop-img").addClass("d-none");
      } else {
        $(".quarterly-desktop-img").removeClass("d-none");
        $(".quarterly-mobile-img").addClass("d-none");
      }
      $(window).resize(function () {
        if ($(window).width() < 569) {
          $(".quarterly-mobile-img").removeClass("d-none");
          $(".quarterly-desktop-img").addClass("d-none");
        } else {
          $(".quarterly-desktop-img").removeClass("d-none");
          $(".quarterly-mobile-img").addClass("d-none");
        }
      });
    }
  }
});
