$(document).ready(function () {
    let pagePath = window.location.pathname;
    let slug = pagePath.split("/");
    let actualSlug = slug[1].replace(".html", "");
    let primary_category = window.location.origin;
    let fullSplit = primary_category.split("//");
    let pcSplit = fullSplit[1].split(".");
    let title = $("title").text();

    $('.nps--toclick').click(function () {
        if (window.digitalData) {
            window.digitalData = {
              event: "NPS feedback initiated",
              page:{
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
                country: current_country,
                Language: current_language,
              }
            }
        };
        $('<div class="grey-bg-2"></div>').appendTo('body').fadeIn(300);
        $('#feedback-modal').addClass('transitioning-div-visible');

        // Disable Scroll
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
        if ($('#vertical-sticky-mob').length) {
            $('#vertical-sticky-mob').css('z-index', 1);
        }
        if ($(window).width() >= 768) {
            $(this).addClass('transitioning-div-visible-448');
        }
        if ($(window).width() < 768) {
            $(this).css({
                opacity: 0,
            })
            $('#nps-feedback').css({
                width: '100%',
                right: 0,
            });
        }

    });

    $('.ratings-inner-wrap .rating-tile').click(function () {
        $(this).addClass('rating-selected');
        let clickIndex = $(this).index();
        let selectedRating = clickIndex + 1;
        if (window.digitalData) {
            window.digitalData = {
              event: "NPS rating selected",
              feedbackDetails:{
                rating: selectedRating.toString(),
              },
              page:{
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
                country: current_country,
                Language: current_language,
              }
            }
        };
        $('.ratings-select').addClass('d-none');
        $('.suggestion-select').removeClass('d-none');
        $('.suggestion-select .suggestions-wrap').eq(clickIndex).removeClass("d-none");
    })

    $('.reason-wrap .reason-tile').click(function () {
        let button = $('.suggestions-wrap #manual-sub-btn');
        button.removeAttr("disabled");
        $(this).toggleClass("tile--active");
        if ($('.reason-wrap .reason-tile.tile--active').length === 0) {
            button.attr("disabled", "disabled");
        }
    })

    $('.suggestions-wrap input.btn').click(function () {
        $('.suggestions-wrap').addClass('d-none');
        $('.suggestion-select').addClass('d-none');
        $('#feedback-modal .close').removeClass('d-none');
        $('#feedback-modal .close').addClass('thankyou-close');
        $('.thankyou-final').removeClass('d-none');
        serviceFormSubmit();
    })

    $('#feedback-modal .close').click(function () {
        let button = $('.suggestions-wrap #manual-sub-btn');
        let gradientDiv = $('.grey-bg-2');
        gradientDiv.fadeOut(800, function () {
            gradientDiv.remove();
            if ($('.ratings-select').hasClass('d-none')) {
                $('.ratings-select').removeClass('d-none');
            }
            $('.reason-tile').removeClass('tile--active');
            $('.suggestion-select,.suggestions-wrap,.thankyou-final').addClass('d-none');

            // Enable Scroll
            $('html, body').css({
                overflow: '',
                height: ''
            });
            button.attr("disabled", "disabled");
        }); 
        $('#feedback-modal').removeClass('transitioning-div-visible');
        $('.nps--toclick').removeClass("transitioning-div-visible-448");
        if ($(this).hasClass('thankyou-close')) {
            $('#nps-feedback').addClass('animate-close');
            setTimeout(function () {
                $('#nps-feedback').addClass('d-none');
            }, 500);
        }

        if ($(window).width() < 768) {
            $('.nps--toclick').css({
                opacity: 1,
            })
            $('#nps-feedback').css({
                width: '',
                right: '',
            });
        }
        if ($('#vertical-sticky-mob').length) {
            $('#vertical-sticky-mob').css('z-index', 6);
        }
    });

    // API Integration

    async function serviceFormSubmit() {
        var npsObj = {
            rating: $('.rating-selected').index() + 1,
            feedback1: $('.reason-tile.tile--active:nth(0) p').text().trim() || '',
            feedback2: $('.reason-tile.tile--active:nth(1) p').text().trim() || '',
            feedback3: $('.reason-tile.tile--active:nth(2) p').text().trim() || '',
            feedback4: $('.reason-tile.tile--active:nth(3) p').text().trim() || '',
            source: getOS()
        };

        let npsURL = $("#nps-feedback").attr("data-component-relativePath");
        var npsPath = npsURL.replace(
            "jcr:content",
            "_jcr_content"
        );

        $.ajax({
            url: npsPath,
            type: "POST",
            data: JSON.stringify(npsObj),
            dataType: "json",
            contentType: "application/json",
            success: function (resp) {
                console.log("nps success");
                sessionStorage.setItem("npsSumbitted", "yes");
                if (window.digitalData) {
                    window.digitalData = {
                      event: "NPS feedback submitted",
                      feedbackDetails:{
                        rating: npsObj.rating.toString(),
                        reasons: npsObj.feedback1 + '|' + npsObj.feedback2 + '|' + npsObj.feedback3 + '|' + npsObj.feedback4,
                      },
                      page:{
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
                        country: current_country,
                        Language: current_language,
                      }
                    }
                };
            },
            error: function (error) {
                console.log(error);
            },
        });
    }

    // NPS Visibility

    let npsSub = sessionStorage.getItem("npsSumbitted");
    if(npsSub != 'yes'){
        let inactivityTime = 10000;
        let fadeTimer;
        let fadeThreshold = 0.15;
    
        fadeTimer = setTimeout(function () {
            $('#nps-feedback').addClass('fade-in');
        }, inactivityTime);
    
        $(window).on('scroll', function () {
            clearTimeout(fadeTimer);
    
            let scrollPosition = $(window).scrollTop() / ($(document).height() - $(window).height());
    
            if (!$('#nps-feedback').hasClass('fade-in')) {
                if (scrollPosition > fadeThreshold) {
                    $('#nps-feedback').addClass('fade-in');
                } else {
                    fadeTimer = setTimeout(function () {
                        $('#nps-feedback').addClass('fade-in');
                    }, inactivityTime);
                }
            }
        });
    }
});