$(document).ready(function () {
  try {
    let animateLeftTestimonial = gsap.timeline({
      scrollTrigger: {
        trigger: '#testimonial-container',
        start: isMobile() ? 'top 75%' : 'top 40%',
        end: '+=100',
        scrub: 2,
        once: true, // Add this line to trigger the animation only once
        onEnter: () => {
          $('#testimonial-heading>p').shuffleElementText();
        },
      },
    });

    animateLeftTestimonial
      .add(textAnimation('#testimonial-heading>p', 50), 0)
      .add(textAnimation('#testimonial-description', 10), 0);

    initTestimonials();
  } catch (error) {
    console.error(error);
  }
});

function initTestimonials() {
  var $carouselContainer = $(
    '.testimonial-section-image-container .slick-container'
  );
  const $testimonialSection = $('.testimonial');
  var srollFromTop = true;
  var slideToBeDisplayed = 0;
  var currentSlide = 0;
  var lastScrollTop = 0;

  initCarousel();
  function initCarousel() {
    $carouselContainer.slick({
      vertical: true,
      verticalSwiping: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: true,
      arrows: false,
      cssEase: ' cubic-bezier(0, 0, 1.0, 0.6)',
      speed: 1000,
    });

    var classToAdd = 'slide-up-animation';
    $carouselContainer.on('beforeChange', function (ev, slick, current, next) {
      classToAdd = srollFromTop ? 'slide-up-animation' : 'slide-down-animation';
      let actives = $carouselContainer.find('.slick-active');
      $(actives).addClass('fading-square-image');
      if (srollFromTop) {
        actives.next().addClass(classToAdd);
      } else {
        actives.prev().addClass(classToAdd);
      }
    });

    $carouselContainer.on('afterChange', function (ev, slick, current, next) {
      setTimeout(() => {
        $('.fading-square-image').removeClass('fading-square-image');
        $('.' + classToAdd).removeClass(classToAdd);
      }, 250);
    });
  }

  if (isDesktop()) {
    $(window).scroll(function () {
      if ($(".testimonial").isInViewport()) {
        performScrollActions();
      }
    });
    document
      .getElementById('testimonial-container')
      .addEventListener('wheel', debounce(onWheelAction, 100));
  }

  function performScrollActions() {
    const windowHeight = $(window).height();
    const windowScrollTop = $(window).scrollTop();
    // To calculate bottom of screen
    const windowBottom = windowHeight + windowScrollTop;

    const testimonialSectionTop = $testimonialSection.offset().top;
    const testimonialSectionHeight = $testimonialSection.outerHeight();
    const testimonialSectionBottom =
      testimonialSectionTop + testimonialSectionHeight;

    var st = window.scrollY || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      // downscroll code
      srollFromTop = true;
    } else if (st < lastScrollTop) {
      // upscroll code
      srollFromTop = false;
    } // else was horizontal scroll
    lastScrollTop = st <= 0 ? 0 : st;
    currentSlide = $carouselContainer.slick('slickCurrentSlide');

    if (
      !globalStateObject.scrollWithoutSticky &&
      ((srollFromTop &&
        windowScrollTop > testimonialSectionTop - 1 &&
        currentSlide <= 0) ||
        (!srollFromTop &&
          windowBottom < testimonialSectionBottom + 1 &&
          currentSlide >= 2))
    ) {
      $('#testimonial-container').get(0).scrollIntoView();
      $('html').addClass('overflow-hidden');
    }
  }

  function onWheelAction(event) {
    if ($('#testimonial-container').isInViewport()) {
      srollFromTop = event.deltaY > 0;
      slideToBeDisplayed = currentSlide + (srollFromTop ? 1 : -1);
      slideToBeDisplayed =
        slideToBeDisplayed > 2
          ? 2
          : slideToBeDisplayed < 0
          ? 0
          : slideToBeDisplayed;
      $carouselContainer.slick('slickGoTo', slideToBeDisplayed);
      currentSlide = $carouselContainer.slick('slickCurrentSlide');
      if (
        (!srollFromTop && currentSlide == 0) ||
        (srollFromTop && currentSlide == 2)
      ) {
        $('html').removeClass('overflow-hidden');
      }
    } else {
      $('html').removeClass('overflow-hidden');
    }
  }
}
