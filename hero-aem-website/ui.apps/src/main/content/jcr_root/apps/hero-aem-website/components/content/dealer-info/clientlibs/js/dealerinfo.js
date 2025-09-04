$(document).ready(function() {
    if ($('.near-you-section').length > 0) {
        arrangeData();

        if ($(".near-you-section").length > 1) {
            $(".near-you-section").each(function() {
                setState(this);
            });
        } else {
            let form = $(".near-you-section");
            setState(form);
        }
        function setState(selector) {
            if (locations) {
                let stateField = $(selector).find('[name="statename"]');
                let statelist = stateField.parents(".cust-drop-down").find(".cust-dropdown-menu ");
                if (statelist.children('li:contains(' + locations.State.toLowerCase() + ')').attr('value')) {
                    state = $(statelist).children('li:contains(' + locations.State.toLowerCase() + ')').attr('value');
                    abbrState = locations.State.toLowerCase();
                    stateField.text(abbrState);
                    stateField.attr('data-state-value', state);
                    let citylist = $(selector).find('[name="cityname"]').parents(".cust-drop-down").find(".cust-dropdown-menu ");
                    populateDealerDropdown($(selector).find('[name="productpath"]').attr("value") + '.dealercities.' + state + '.html', citylist, "city", false);
                }
            }
        }
     $(".near-you-section .cust-dropdown-menu").on('click', 'li', function() {
            let selectionGroup = $(this).parents(".cust-drop-down");
            var button = selectionGroup.find(".dropdown-select");
            button.text($(this).find('a')[0].innerHTML.replaceAll('&amp;', '&'));
            var form = $(this).closest("form");
            selectionGroup.find(".cust-dropdown-menu li").removeClass("active");
            $(this).addClass("active");
            if ("statename" == button.attr("name")) {
                let list = form
                    .find('[name="cityname"]')
                    .parents(".cust-drop-down")
                    .find(".cust-dropdown-menu ");
                var cityPath =
                    form.find('[name="productpath"]').attr("value") +
                    ".dealercities." +
                    $(this).attr("value") +
                    ".html";
                form.find('[name="statename"]').attr('data-state-value', $(this).attr("value"));
                populateDealerDropdown(cityPath, list, "city", true);
            }
            if ("cityname" == button.attr("name")) {
                let list = form.closest('.near-you-section').find(".near-you-slider");
                var cityPath =
                    form.find('[name="productpath"]').attr("value") +
                    ".dealerdata." + form.find('[name="statename"]').attr('data-state-value') + "." +
                    $(this).attr("value") +
                    ".html";
                populateDealerDropdown(cityPath, list, "dealerdata");
            }
        });

        function populateDealerDropdown(url, selector, keyword, skip) {
            if (url && selector[0] !== undefined) {
                fetch(url)
                    .then(function(response) {
                        if (!response.ok) {
                            // make the promise be rejected if we didn't get a 2xx response
                            throw new Error("Not 2xx response", {cause: response});
                        } else {
                            return response.text();
                        }
                    })
                    .then(function(html) {
                        if (keyword == 'city') {
                            let form = $(selector).closest("form");
                            if (locations && $(html).find('a:contains(' + locations.City.toLowerCase() + ')').length > 0) {
                                selector[0].innerHTML = html;
                                let city = '';
                                let abbrCity = form.find('[name="cityname"]').attr('data-default-label');
                                if (locations) {
                                    if ($(selector[0]).children('li:contains(' + locations.City.toLowerCase() + ')').attr('value')) {
                                        city = $(selector[0]).children('li:contains(' + locations.City.toLowerCase() + ')').attr('value');
                                        abbrCity = locations.City.toUpperCase();
                                    }
                                }
                                form.find('[name="cityname"]').text(abbrCity);
                                if(city != ''){
                                    let priceForm = form.closest('.near-you-section').find(".near-you-slider");
                                    populateDealerDropdown(url.replace('.dealercities.', '.dealerdata.').replace('.html', '.') + city.toLowerCase() + '.html', priceForm, "dealerdata")
                                }
                            } else if (!skip) {
                                let stateField = form.find('[name="statename"]');
                                let defaultState = stateField.data('default-label');
                                let statelist = stateField.parents(".cust-drop-down").find(".cust-dropdown-menu ");
                                let state = statelist.children('li:contains(' + defaultState + ')').attr('value');
                                stateField.text(defaultState);
                                stateField.attr('data-state-value', state);
                            } else if (skip) {
                                selector[0].innerHTML = html;
                                form.find('[name="cityname"]').text(form.find('[name="cityname"]').attr('data-default-label'));
                            }
                        }
                        if (keyword == 'dealerdata') {
                            if ($(selector[0]).hasClass('slick-initialized')) {
                                $(selector[0]).slick('unslick');
                            }
                            selector[0].innerHTML = html;
                            arrangeData();
                        }

                    })
                    .catch(function(err) {
                        console.log("Something went wrong.", err);
                    });
            }
        }
        function arrangeData() {
            if($('.near-you-wapper .near-you-slider').find('.near-you-common-div').length > 0){
                $('.near-you-wapper .near-you-slider').find('.near-you-common-div').each(function(index) {
                    let value = index % 3;
                    $(this).find('.near-img').replaceWith($('.dealer-'+value).html());
                });
            }
            $('.near-you-wapper .near-you-slider').slick({
                slidesToShow: 3.2,
                arrows: false,
                infinite: false,
                dots: true,
                responsive: [{
                        breakpoint: 1280,
                        settings: {
                            slidesToShow: 3.2,
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 2,
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 1.6,
                        }
                    }
                ]
            },500);
        }
    }

});