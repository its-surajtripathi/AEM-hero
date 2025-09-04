$(document).ready(function () {

   var relativePath = $(".inthepress-container").attr('data-inthepress-component-realtivePath');
   var pressreleasesRelativePath = $(".pressreleases-container").attr('data-inthepress-component-realtivePath');
   var newsletterRelativePath = $(".newsletter-container").attr('data-inthepress-component-realtivePath');
   var annualreportRelativePath = $(".annualreport-container").attr('data-inthepress-component-realtivePath');

   if (relativePath != undefined) {
      var InThePressUrl = relativePath.replace('jcr:content', '_jcr_content');
      $.ajax({
         type: 'GET',
         cache: false,
         data: {
            "mediatype": "inthepress"
         },
         url: InThePressUrl,
         success: function (data) {
            let Data = data;
            if (typeof (Data) != 'object') {
               Data = JSON.parse(data);
            }
            init(Data);
         }
      });
   }
   if (pressreleasesRelativePath != undefined) {
      var PressReleasesUrl = pressreleasesRelativePath.replace('jcr:content', '_jcr_content');
      $.ajax({
         type: 'GET',
         cache: false,
         data: {
            "mediatype": "pressreleases"
         },
         url: PressReleasesUrl,
         success: function (data) {
            let _DataRelease = data;
            if (typeof (_DataRelease) != 'object') {
               _DataRelease = JSON.parse(data);
            }
            pressRelease(_DataRelease);
         }
      });
   }

   if (newsletterRelativePath != undefined) {
      var NewslettersUrl = newsletterRelativePath.replace('jcr:content', '_jcr_content');
      $.ajax({
         type: 'GET',
         cache: false,
         data: {
            "mediatype": "newsletters"
         },
         url: NewslettersUrl,
         success: function (data) {
            let newsletterData = data;
            if (typeof (newsletterData) != 'object') {
               newsletterData = JSON.parse(data);
            }
            newsLetter(newsletterData);
         }
      });
   }

   if (annualreportRelativePath!= undefined) {
      var AnnualReportsUrl = annualreportRelativePath.replace('jcr:content', '_jcr_content');
      $.ajax({
         type: 'GET',
         cache: false,
         data: {
            "mediatype": "annualreports"
         },
         url: AnnualReportsUrl,
         success: function (data) {
            let newsletterData = data;
            if (typeof (newsletterData) != 'object') {
               newsletterData = JSON.parse(data);
            }
            newsLetter(newsletterData);
         }
      });
   }

   function removeDuplicates(list) {
      let uniqueSet = new Set();
      $(list).filter(function (i, el) {
         let unique = $(el).text();
         if (uniqueSet.has(unique)) {
            return true;
         } else {
            uniqueSet.add(unique);
            return false;
         }
      }).remove();
   }
  
   function closeDropDowns(){
      $('#month--ul').removeClass("show");
      $('#year--ul').removeClass("show");
   }

   $("#year--btn").click(function () {
      if ($("#month--ul").hasClass("show")) {
         $("#month--ul").removeClass("show");
      }
      $(this).siblings("ul").toggleClass("show");
   })

   $("#month--btn").click(function () {
      if ($("#year--ul").hasClass("show")) {
         $("#year--ul").removeClass("show");
      }
      $(this).siblings("ul").toggleClass("show");
   })

   function init(Data) {
      let tableContent = $(".pressList ul");
      let yearList = $("#year--ul");
      let monthList = $("#month--ul");
      $.each(Data, function (i, element) {
         let publishedMonth = element.releaseDate.split("-")[1];
         let publishedYear = element.releaseDate.split("-")[2];
         yearList.append('<li>' + publishedYear + '</li>')
         monthList.append('<li>' + publishedMonth + '</li>')
         tableContent.append('<li data-year=' + publishedYear + ' data-month=' + publishedMonth + ' class="b2-text-std">' + '<a href=' + element.path + ' target="_blank" class="b1-bold-text-std">' + element.title + '</a>' + element.pressName + ' - ' + element.releaseDate  + '</li>')
      })

      removeDuplicates($("#year--ul li"));
      removeDuplicates($("#month--ul li"));

      $("#year--ul li").sort(function (a, b) {
         return parseInt($(b).text()) - parseInt($(a).text());
      }).appendTo("#year--ul");

      const monthListOrder = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'];
      $("#month--ul li").sort(function (a, b) {
         return monthListOrder.indexOf($(a).text()) - monthListOrder.indexOf($(b).text());
      }).appendTo("#month--ul");

      let yearReadyShow = $("#year--ul li:first-child").html()
      let monthReadyShow = $("#month--ul li:first-child").html()
      $("#year--btn").html(yearReadyShow);
      $("#month--btn").html(monthReadyShow);
      let tableReadyShow = $('.pressList ul li[data-year="' + yearReadyShow + '"][data-month="' + monthReadyShow + '"]');
      $(".pressyearBox .year").html(yearReadyShow);
      $(".pressyearBox .month").html(monthReadyShow);
      tableReadyShow.addClass("show");

      $(".pressList ul li a").click(closeDropDowns);
      function redirect() {
         let inputMonth = $(this).html();
         let existYear = $('#year--btn').html();
         let tableToShow = $('.pressList ul li[data-month="' + inputMonth + '"][data-year="' + existYear + '"]');
         $('#month--ul').removeClass("show");
         $("#month--btn").html($(this).html());
         $(".pressyearBox .month").html($(this).html());
         $('.pressList ul li').removeClass("show");
         tableToShow.addClass("show");
      }

      $("#year--ul li").click(function () {
         let inputYear = $(this).html();
         var arr1 = [];
         $("[data-year]").each(function (index) {
            if ($(this).attr('data-year') == inputYear) {
               arr1.push($(this).attr('data-month'))
            }
         });
         let uniqueChars = [...new Set(arr1)];
         let list = $("#month--ul");
         list.empty();
         let month = monthListOrder.filter(element => uniqueChars.includes(element));
         month.forEach(function (data) {
            list.append($('<li>', {
               html: data
            }));
         });
         $("#month--ul li").bind('click', redirect);
         let existMonth = $('#month--ul li:first-child').html();
         $("#month--btn").html(existMonth);
         $(".pressyearBox .month").html(existMonth);
         let tableToShow = $('.pressList ul li[data-year="' + inputYear + '"][data-month="' + existMonth + '"]')
         $('#year--ul').removeClass("show");
         $("#year--btn").html($(this).html());
         $(".pressyearBox .year").html($(this).html());
         $('.pressList ul li').removeClass("show");
         tableToShow.addClass("show");
      })

      $("#month--ul li").click(function () {
         let inputMonth = $(this).html();
         let existYear = $('#year--btn').html();
         let tableToShow = $('.pressList ul li[data-month="' + inputMonth + '"][data-year="' + existYear + '"]');
         $('#month--ul').removeClass("show");
         $("#month--btn").html($(this).html());
         $(".pressyearBox .month").html($(this).html());
         $('.pressList ul li').removeClass("show");
         tableToShow.addClass("show");
      })
      $("#year--ul li:first-child").trigger('click');
   }

   function pressRelease(_DataRelease) {
      let tableContent = $(".pressList ul");
      let yearList = $("#year--ul");
      let monthList = $("#month--ul");
      $.each(_DataRelease, function (i, element) {
         let publishedMonth = element.releaseDate.split("-")[1];
         let publishedYear = element.releaseDate.split("-")[2];
         yearList.append('<li>' + publishedYear + '</li>')
         monthList.append('<li>' + publishedMonth + '</li>')
         if (element.path.endsWith(".pdf")) {
            tableContent.append('<li data-year=' + publishedYear + ' data-month=' + publishedMonth + ' class="b2-text-std" >' + '<a href=' + element.path + ' target="_blank" class="b1-bold-text-std">' + element.title + '<img src="/content/dam/hero-aem-website/icons/pdf-icon.png"></a>' + element.pressName + ' - ' + element.releaseDate + '</li>')
         } else {
            tableContent.append('<li data-year=' + publishedYear + ' data-month=' + publishedMonth + ' class="b2-text-std" >' + '<div class="header--title b1-bold-text-std">' + element.title + '</div>' + element.pressName + ' - ' + element.releaseDate + '<div class="render--this" style="display:none">' + element.path + '</div></li>')
         }
      })

      removeDuplicates($("#year--ul li"));
      removeDuplicates($("#month--ul li"));

      $("#year--ul li").sort(function (a, b) {
         return parseInt($(b).text()) - parseInt($(a).text());
      }).appendTo("#year--ul");

      const monthListOrder = ['December', 'November', 'October', 'September', 'August', 'July', 'June', 'May', 'April', 'March', 'February', 'January'];
      $("#month--ul li").sort(function (a, b) {
         return monthListOrder.indexOf($(a).text()) - monthListOrder.indexOf($(b).text());
      }).appendTo("#month--ul");
      let yearReadyShow = $("#year--ul li:first-child").html()
      let monthReadyShow = $("#month--ul li:first-child").html()
      $("#year--btn").html(yearReadyShow);
      $("#month--btn").html(monthReadyShow);
      let tableReadyShow = $('.pressList ul li[data-year="' + yearReadyShow + '"][data-month="' + monthReadyShow + '"]');
      $(".pressyearBox .year").html(yearReadyShow);
      $(".pressyearBox .month").html(monthReadyShow);
      tableReadyShow.addClass("show");

      function goBack() {
         $('.in-press-section').css("display", "block");
         $('.render--div').remove();
      }

      $('.header--title').click(function () {
         closeDropDowns();
         $('.in-press-section').css("display", "none");
         let renderHtml = $(this).parent().find(".render--this").html();
         $('<div/>', {
            class: 'render--div container',
            html: '<h2>'+$(this).html()+'</h2>'+renderHtml + '<button id="go-back" class="btn btn-red-gradient ">Back</button>'
         }).insertAfter('.in-press-section');
         $("#go-back").bind('click', goBack);
      })

      $(".pressList ul li a").click(closeDropDowns);

      function redirect() {
         let inputMonth = $(this).html();
         let existYear = $('#year--btn').html();
         let tableToShow = $('.pressList ul li[data-month="' + inputMonth + '"][data-year="' + existYear + '"]');
         $('#month--ul').removeClass("show");
         $("#month--btn").html($(this).html());
         $(".pressyearBox .month").html($(this).html());
         $('.pressList ul li').removeClass("show");
         tableToShow.addClass("show");
      }

      $("#year--ul li").click(function () {
         let inputYear = $(this).html();
         var arr1 = [];
         $("[data-year]").each(function (index) {
            if ($(this).attr('data-year') == inputYear) {
               arr1.push($(this).attr('data-month'))
            }
         });
         let uniqueChars = [...new Set(arr1)];
         let list = $("#month--ul");
         list.empty();
         let month = monthListOrder.filter(element => uniqueChars.includes(element));
         month.forEach(function (data) {
            list.append($('<li>', {
               html: data
            }));
         });
         $("#month--ul li").bind('click', redirect);
         let existMonth = $('#month--ul li:first-child').html();
         $("#month--btn").html(existMonth);
         $(".pressyearBox .month").html(existMonth);
         let tableToShow = $('.pressList ul li[data-year="' + inputYear + '"][data-month="' + existMonth + '"]')
         $('#year--ul').removeClass("show");
         $("#year--btn").html($(this).html());
         $(".pressyearBox .year").html($(this).html());
         $('.pressList ul li').removeClass("show");
         tableToShow.addClass("show");
      })

      $("#month--ul li").click(function () {
         let inputMonth = $(this).html();
         let existYear = $('#year--btn').html();
         let tableToShow = $('.pressList ul li[data-month="' + inputMonth + '"][data-year="' + existYear + '"]');
         $('#month--ul').removeClass("show");
         $("#month--btn").html($(this).html());
         $(".pressyearBox .month").html($(this).html());
         $('.pressList ul li').removeClass("show");
         tableToShow.addClass("show");
      })
      $("#year--ul li:first-child").trigger('click');
   }

   function newsLetter(newsletterData){
      let tableContent = $(".pressList ul");
      let yearList = $("#year--ul");
      let quarterList = $("#month--ul");
      if($('#newsletter').length>0){
         $.each(newsletterData, function (i, element) {
            let publishedYear = element.year;
            let publishedQuarter = element.quater
            yearList.append('<li>' + publishedYear + '</li>')
            quarterList.append('<li>' + publishedQuarter + '</li>')
            tableContent.append('<li data-year='+element.year+' data-quater='+element.quater+'><div class="img-wrapper"><img src='+element.iconPath+' alt="newsletter-icon"></div> <div class="content-wrapper"><h3>'+element.title+'</h3><a href='+element.path+'>'+element.description+' <span><img src="/content/dam/hero-aem-website/in/icons/board-nav-arrow.png" alt=""></span></a></div></li>')
         })
      }
      else if($('#annual-report').length>0){
         $.each(newsletterData, function (i, element) {
            let publishedYear = element.year;
            yearList.append('<li>' + publishedYear + '</li>')
            tableContent.append('<li data-year='+element.year+'><div class="img-wrapper"><img src='+element.iconPath+' alt="newsletter-icon"></div> <div class="content-wrapper"><h3>'+element.title+'</h3><a href='+element.path+'>'+element.description+' <span><img src="/content/dam/hero-aem-website/in/icons/board-nav-arrow.png" alt=""></span></a></div></li>')
         })
      }

      removeDuplicates($("#year--ul li"));
      removeDuplicates($("#month--ul li"));

      $("#year--ul li").sort(function (a, b) {
         return parseInt($(b).text()) - parseInt($(a).text());
      }).appendTo("#year--ul");

      QuaterListOrder = ['Q4','Q3','Q2','Q1'];

      let yearReadyShow = $("#year--ul li:first-child").html()
      let quaterReadyShow = $("#month--ul li:first-child").html()
      let tableReadyShow;
      if($('#newsletter').length>0){
          tableReadyShow = $('.pressList ul li[data-year="' + yearReadyShow + '"][data-quater="' + quaterReadyShow + '"]');
      }
      else if($('#annual-report').length>0){
          tableReadyShow = $('.pressList ul li[data-year="' + yearReadyShow + '"]');
      }
      $("#year--btn").html(yearReadyShow);
      $("#month--btn").html(quaterReadyShow);
      tableReadyShow.addClass("d-flex");

      function redirect() {
         let inputQuater = $(this).html();
         let existYear = $('#year--btn').html();
         let tableToShow = $('.pressList ul li[data-quater="' + inputQuater + '"][data-year="' + existYear + '"]');
         $('#month--ul').removeClass("show");
         $("#month--btn").html($(this).html());
         $(".pressyearBox .month").html($(this).html());
         $('.pressList ul li').removeClass("d-flex media-separator-lines");
         tableToShow.addClass("d-flex");
         $('li.d-flex:last-child').addClass("media-separator-lines");
      }
      
      $("#year--ul li").click(function () {
         let inputYear = $(this).html();
         let tableToShow;
         if($('#newsletter').length>0){
            var arr1 = [];
            $("[data-year]").each(function (index) {
               if ($(this).attr('data-year') == inputYear) {
                  arr1.push($(this).attr('data-quater'))
               }
            });
            let uniqueChars = [...new Set(arr1)];
            let list = $("#month--ul");
            list.empty();
            let quater =  QuaterListOrder.filter(element => uniqueChars.includes(element));
            quater.forEach(function (data) {
               list.append($('<li>', {
                  html: data
               }));
            });
            $("#month--ul li").bind('click', redirect);
            let existQuater = $('#month--ul li:first-child').html();
            $("#month--btn").html(existQuater);
            $(".pressyearBox .month").html(existQuater);
            tableToShow = $('.pressList ul li[data-year="' + inputYear + '"][data-quater="' +existQuater+ '"]')
         }
         else if($('#annual-report').length>0){
            tableToShow = $('.pressList ul li[data-year="' + inputYear + '"]')
         }
         $('#year--ul').removeClass("show");
         $("#year--btn").html($(this).html());
         $(".pressyearBox .year").html($(this).html());
         $('.pressList ul li').removeClass("d-flex media-separator-lines");
         tableToShow.addClass("d-flex");
         $('li.d-flex:last-child').addClass("media-separator-lines");
      })
      $("#year--ul li:first-child").trigger('click');
   }
})