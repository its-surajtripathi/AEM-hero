$(document).ready(function () {
	if($('.prise-section')){
	    function populatePriceDropdowns(url, selector, keyword, skip) {
            if(url && selector[0] !== undefined){
	        fetch(url)
	          .then(function (response) {
				  if (!response.ok) {
					  // make the promise be rejected if we didn't get a 2xx response
					  throw new Error("Not 2xx response", { cause: response });
				  } else {
					  return response.text();
				  }
	          })
	          .then(function (html) {
				  if(keyword != 'pricedata')
	            		selector[0].innerHTML = html;
	              let form = $(selector).closest("form");
	              if (keyword == 'state') {
	                   //sort in ascending order
	                  form.find('[name="statename"]').parents(".cust-drop-down").find(".cust-dropdown-menu li").sort(sortAscending).appendTo( form.find('[name="statename"]').parents(".cust-drop-down").find(".cust-dropdown-menu"));
	                  let state;
                      let abbrState = form.find('[name="statename"]').attr('data-default-label');
					  if (!skip) {
						  state = form.find('[name="statename"]').attr('data-default-state');
					  }
                      if (!skip && locations){
	                      if ($(selector[0]).children('li:contains(' + locations.State + ')').attr('value')) {
	                          state = $(selector[0]).children('li:contains(' + locations.State + ')').attr('value');
	                          abbrState = locations.State;
	                          form.find('[name="statename"]').text(abbrState);
	                      }
	                  }
	                  form.find('[name="statename"]').attr('data-state-value',state);
	                  let citylist = form.find('[name="cityname"]').parents(".cust-drop-down").find(".cust-dropdown-menu ");
	                  populatePriceDropdowns(url.substr(0,url.indexOf('.')) + '.cities.' + state + '.html', citylist, "city")
	              }
	              if (keyword == 'city') {
					  let city = '';
	                   //sort in ascending order
	                  form.find('[name="cityname"]').parents(".cust-drop-down").find(".cust-dropdown-menu li").sort(sortAscending).appendTo( form.find('[name="cityname"]').parents(".cust-drop-down").find(".cust-dropdown-menu"));
                      let abbrCity = form.find('[name="cityname"]').attr('data-default-label');
                      let cityFound = false;
                      if (!skip) {
						 city = form.find('[name="cityname"]').attr('data-default-city');
						 
					  }else{
						cityFound = true;
					  }
					  
                      if (!skip && locations) {
	                      if ($(selector[0]).children('li:contains(' + locations.City.toLowerCase() + ')').attr('value')) {
	                          city = $(selector[0]).children('li:contains(' + locations.City.toLowerCase() + ')').attr('value');
	                          abbrCity = locations.City;
	                          form.find('[name="cityname"]').text(abbrCity);
	                          cityFound = true;
	                      }
	                  }
	                  if(cityFound){
						if(city != '')
							{
								let priceForm = form.find(".prise-form-info");
		                    	populatePriceDropdowns(url.replace('.cities.','.pricedata.').replace('.html','.') + city.toLowerCase() + '.html', priceForm, "pricedata")
							}
						
					  }else{
						city = form.find('[name="cityname"]').attr('data-default-city');
						let state = form.find('[name="statename"]').attr('data-default-state');
						form.find('[name="statename"]').text(form.find('[name="statename"]').attr('data-default-stateName'));
						let priceForm = form.find(".prise-form-info");
	                    populatePriceDropdowns(url.split('.cities')[0] +".pricedata."+state+"."+city+".html", priceForm, "pricedata")
					  }
	                  
	              }
	              if (keyword == 'pricedata') {
						$(selector[0]).find('.pricedata > li').slice(2).remove()
	              		$(selector[0]).find('.pricedata').append(html);
				  }

	          })
	          .catch(function (err) {
	            console.log("Something went wrong.", err);
	          });
            }
	      }
	    if ($(".prise-section").length > 1) {
	        $(".prise-section").each(function () {
	            let statelist = $(this).find('[name="statename"]').parents(".cust-drop-down").find(".cust-dropdown-menu ");
	            populatePriceDropdowns( $(this).find('[name="productpath"]').attr("value") + ".states.html",statelist, "state", false);
	        });
	    } else {
			let form = $(".prise-section");
	        let statelist = form.find('[name="statename"]').parents(".cust-drop-down").find(".cust-dropdown-menu ");
	        populatePriceDropdowns( form.find('[name="productpath"]').attr("value") + ".states.html",statelist, "state", false);
	    }
	    $(".prise-section .cust-dropdown-menu").on('click', 'li', function () {
	      let selectionGroup = $(this).parents(".cust-drop-down");
	      var button = selectionGroup.find(".dropdown-select");
	      button.text($(this).find('a')[0].innerHTML);
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
	          ".cities." +
	          $(this).attr("value") +
	          ".html";
	        form.find('[name="statename"]').attr('data-state-value',$(this).attr("value"));
	        form.find('[name="cityname"]').text(form.find('[name="cityname"]').attr('data-default-label'));
	        populatePriceDropdowns(cityPath, list, "city", true);
	      }
	      if ("cityname" == button.attr("name")) {
	        let list = form.find(".prise-form-info");
	        var cityPath =
	          form.find('[name="productpath"]').attr("value") +
	          ".pricedata." + form.find('[name="statename"]').attr('data-state-value')+"."+
	          $(this).attr("value") +
	          ".html";
	        populatePriceDropdowns(cityPath, list, "pricedata", false);
	      }
	    });
	    
	    function sortAscending(a, b) {
			return ($(b).text().toUpperCase()) <
				($(a).text().toUpperCase()) ? 1 : -1;
		}
	}
});
