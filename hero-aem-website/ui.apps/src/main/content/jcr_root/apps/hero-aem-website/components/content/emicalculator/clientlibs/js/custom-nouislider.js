$(document).ready(function() {
	if($(".emi-range-slider").length > 0){
		var sliderFormat = document.getElementById('emiAmountSlider');
		var sliderFormat2 = document.getElementById('emiInterestRateSlider');
		var sliderFormat3 = document.getElementById('emiDurationSlider');
		// sliderFormat.style.margin = '0 auto 160px';
		noUiSlider.create(sliderFormat, {
		  range: {
		    'min': parseInt($('#emiAmountTxt').attr("amount-lower-limit")),
		    'max': parseInt($('#emiAmountTxt').attr("amount-upper-limit"))
		  },
		  snap: false,
		  start: parseInt($('#emiAmountTxt').attr("default-amount")),
		  step: 1,
		  connect: [true, false],
		  behaviour: 'tap-drag',
		  format: {
		    to: function (value) {
		      return value;
		    },
		    from: function (value) {
		      return value.replace(',-', '');
		    }
		  }
		});
		
		var inputFormat = document.getElementById('emiAmountTxt');
		sliderFormat.noUiSlider.on('update', function (values, handle) {
		  inputFormat.value = PriceComma(Math.round(values[handle]));
		  calculateEMI(this);
		});
		
		inputFormat.addEventListener('change', function () {
		  formatValue = this.value;
		  sliderFormat.noUiSlider.set(formatValue);
		  calculateEMI(this);
		});
		
		
		// Range slider for slide 4
		
		noUiSlider.create(sliderFormat2, {
		  range: {
		    'min': parseInt($('#emiInterestRateTxt').attr("interest-lower-limit")),
		    'max': parseInt($('#emiInterestRateTxt').attr("interest-upper-limit"))
		  },
		  snap: false,
		  start: parseFloat($('#emiInterestRateTxt').attr("default-interest")),
		  step: 0.1,
		  connect: [true, false],
		  behaviour: 'tap-drag',
		  format: {
		    to: function (value) {
		      return value;
		    },
		    from: function (value) {
		      return value.replace(',-', '');
		    }
		  }
		});
		
		
		
		var inputFormat2 = document.getElementById('emiInterestRateTxt');
		
		sliderFormat2.noUiSlider.on('update', function (values, handle) {
		  inputFormat2.value = values[handle];
		  calculateEMI(this);
		});
		
		inputFormat2.addEventListener('change', function () {
		  sliderFormat2.noUiSlider.set(this.value);
		  calculateEMI(this);
		});
		
		
		// Range slider for slide 4
		
		noUiSlider.create(sliderFormat3, {
		  range: {
		    'min': parseInt($('#emiDurationTxt').attr("duration-lower-limit")),
		    'max': parseInt($('#emiDurationTxt').attr("duration-upper-limit"))
		  },
		  snap: false,
		  start: parseInt($('#emiDurationTxt').attr("default-duration")),
		  step: 1,
		  connect: [true, false],
		  behaviour: 'tap-drag',
		  format: {
		    to: function (value) {
		      return value;
		    },
		    from: function (value) {
		      return value.replace(',-', '');
		    }
		  }
		});
		
		
		
		var inputFormat3 = document.getElementById('emiDurationTxt');
		sliderFormat3.noUiSlider.on('update', function (values, handle) {
		  inputFormat3.value = Math.round(values[handle]);
		  calculateEMI(this);
		});
		
		inputFormat3.addEventListener('change', function () {
		  sliderFormat3.noUiSlider.set(this.value);
		  calculateEMI(this);
		});
		
		
		function calculateEMI() {
		  var emi = 0;
		  var P = 0;
		  var n = 1;
		  var r = 0;
		
		  if ($("#emiAmountTxt").val() !== "") {
		    formatVal = $("#emiAmountTxt").val().replace(/,/g,'').replace(/₹ /g,'');
		    P = formatVal;
		  }
		
		  if ($("#emiInterestRateTxt").val() !== "") {
		    r = parseFloat(parseFloat($("#emiInterestRateTxt").val()) / 100);
		  }
		
		  if ($("#emiDurationTxt").val() !== "") {
		    n = parseFloat($("#emiDurationTxt").val());
		  }
		
		  if (P !== 0 && n !== 0 && r !== 0) {
		    emi = parseFloat((P * r / 12) * [Math.pow((1 + r / 12), n)] / [Math.pow((1 + r / 12), n) - 1]);
		  }
		
		  var res = PriceComma(emi.toFixed(0));
		
		  $(".payment-div-h3 span").html(res);
		}
		
		function PriceComma(x){
		  // var x = emi.toFixed(0);
		  x = x.toString();
		  var lastThree = x.substring(x.length - 3);
		  var otherNumbers = x.substring(0, x.length - 3);
		  if (otherNumbers != '')
		  lastThree = ',' + lastThree;
		  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		}
		
		$("#emiAmountTxt").on('focus', function(){
		  $(this).select();
		});
}
});