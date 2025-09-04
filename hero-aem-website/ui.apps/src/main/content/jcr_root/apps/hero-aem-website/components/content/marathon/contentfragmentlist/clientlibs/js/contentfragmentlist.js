$(document).ready(function () {

  // Slider

  function enableSlick() {
    $('#fragment__list .fragment__list--wrap').slick({
      arrows: false,
      dots: false,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      autoplaySpeed: 3500,
      cssEase: 'linear',
      speed: 900,
      centerMode: true,
      centerPadding: '29px',
    });
  }

  function disableSlick() {
    $('#fragment__list .fragment__list--wrap').slick('unslick');
  }

  function checkViewport() {
    if ($(window).width() < 768) {
      enableSlick();
    } else {
      disableSlick();
    }
  }
  checkViewport();
  $(window).resize(function () {
    checkViewport();
  });

  // Masonary Grid
  if ($('#fragment__list-variation').length) {
    $('a.view__more--anchor').addClass('d-none');
    function resizeMasonryItem(item) {
      var grid = document.getElementsByClassName('fragment__list--wrap')[0],
        rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
        rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
      var rowSpan = Math.ceil((item.querySelector('article').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = 'span ' + rowSpan;
    }

    function resizeAllMasonryItems() {
      var allItems = document.getElementsByClassName('fragment__tile');
      for (var i = 0; i < allItems.length; i++) {
        resizeMasonryItem(allItems[i]);
      }
    }

    function waitForImages() {
      var allItems = document.getElementsByClassName('fragment__tile');
      for (var i = 0; i < allItems.length; i++) {
        imagesLoaded(allItems[i], function (instance) {
          var item = instance.elements[0];
          resizeMasonryItem(item);
        });
      }
    }

    var masonryEvents = ['load', 'resize'];
    masonryEvents.forEach(function (event) {
      window.addEventListener(event, resizeAllMasonryItems);
    });

    waitForImages();
  }
});
