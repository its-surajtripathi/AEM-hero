$(document).ready(function () {
  try {
    let animateLeftFeed = gsap.timeline({
      scrollTrigger: {
        trigger: "#instagram-feed-container",
        start: isMobile() ? "top 75%" : "top 50%",
        end: "+=100",
        once: true, // Add this line to trigger the animation only once
        scrub: 2,
        onEnter: () => {
          $(".instagram-feed-header-text").shuffleElementText();
        },
      },
    });

    animateLeftFeed
      .add(textAnimation(".instagram-feed-header-wrapper", 70))
      .add(textAnimation(".instagram-feed-qrcode-list-wrapper", 40), "<0.1");

    cardViewWindowChanges();
  } catch (err) {
    console.error(err);
  }
});
function cardAnimation() {
  // Items
  const $items = document.querySelectorAll(".instagram-feed-image-card");
  const $cursors = document.querySelectorAll(".cursor");

  // Vars
  let progress = 50;
  let startX = 0;
  let activeIndex = 0;
  let isDown = false;
  let lastScrollTop = 0;
  let srollFromTop = true;

  // Contants
  const speedWheel = 0.03;
  const speedDrag = -0.1;

  // Get Z
  const getZindex = (array, index) =>
    array.map((_, i) =>
      index === i ? array.length : array.length - Math.abs(index - i)
    );

  const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    const lastChild = document.querySelectorAll(
      ".instagram-feed-image-card:last-child"
    )[0];
    const firstChild = document.querySelectorAll(
      ".instagram-feed-image-card:first-child"
    )[0];
    if (zIndex == $items.length) {
      item.style.setProperty("--opacity", 1);
      item.style.setProperty("--blur", 0 + "px");
      item.style.setProperty("--backgroundclr", `rgba(0, 0, 0, 0)`);
      item.style.setProperty("--heightpic", 19.62 + "rem");
      item.style.setProperty("--widthpic", 14.28 + "rem");
    } else if ($items.length - 1 == zIndex) {
      item.style.setProperty("--opacity", 0.99);
      item.style.setProperty("--blur", 1 + "px");
      item.style.setProperty("--backgroundclr", `rgba(0, 0, 0, 0.2)`);
      item.style.setProperty("--heightpic", 16.61875 + "rem");
      item.style.setProperty("--widthpic", 12.10394 + "rem");
    } else if ($items.length - 2 == zIndex) {
      item.style.setProperty("--opacity", 0.8);
      item.style.setProperty("--blur", 1 + "px");
      item.style.setProperty("--backgroundclr", `rgba(0, 0, 0, 0.4)`);
      item.style.setProperty("--heightpic", 14.57863 + "rem");
      item.style.setProperty("--widthpic", 12.36013 + "rem");
    } else {
      item.style.setProperty("--opacity", 0);
      item.style.setProperty("--backgroundclr", `rgba(0, 0, 0, 0.4)`);
      item.style.setProperty("--heightpic", 14.57863 + "rem");
      item.style.setProperty("--widthpic", 12.36013 + "rem");
    }
    if (
      (srollFromTop && item == lastChild && active == $items.length - 1) ||
      (!srollFromTop && item == firstChild && active == 0)
    ) {
      $("html").removeClass("overflow-hidden");
    }

    var activeValue = (index - active) / $items.length;
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", activeValue);
    item.style.setProperty("--itemshown", $items.length - 3.5);
    item.style.setProperty("--items", $items.length);
    item.style.setProperty("--itemhorizontalAxis", $items.length * 50 + "%");
    var verticalAxisValue =
      activeValue >= 0 ? $items.length * 5 : $items.length * 2;
    item.style.setProperty("--itemverticalAxis", verticalAxisValue + "%");
    var zAxisValue = activeValue >= 0 ? $items.length * 20 : $items.length * 10;
    item.style.setProperty("--itemzAxis", zAxisValue + "deg");
  };

  // Animate
  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    activeIndex = Math.floor((progress / 100) * ($items.length - 1));
    $items.forEach((item, index) => displayItems(item, index, activeIndex));
  };
  animate();

  // Click on Items
  $items.forEach((item, i) => {
    item.addEventListener("click", () => {
      progress = (i / $items.length) * 100;
      const selectedIndex = i;
      $items.forEach((item, index) => {
        const zIndex = getZindex([...$items], i)[index];
        if (zIndex == selectedIndex) {
          activeIndex = 0;
        }
        displayItems(item, index, selectedIndex);
      });
    });
  });

  // Handlers
  const handleWheel = e => {
    srollFromTop = e.deltaY > 0;
    const wheelProgress = e.deltaY * speedWheel;
    progress = progress + wheelProgress;
    animate();
  };

  const handleMouseMove = e => {
    if (e.type === "mousemove") {
      $cursors.forEach($cursor => {
        $cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      });
    }
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
  };

  const handleMouseDown = e => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  // scoping the insta-section element and calculating its position in the screen
  const $instaSectionElement = $(".intagram-image-gallery-section");

  $(window).scroll(function () {
    if (!$(".insta-feed").isInViewport()) {
      return;
    }
    const windowHeight = $(window).height();
    const windowScrollTop = $(window).scrollTop();
    const windowScrollBottom = windowScrollTop + windowHeight;
    const windowScrollCenter = windowScrollTop + windowHeight / 2;

    const instaSectionTop = $instaSectionElement.offset().top;
    const instaSectionHeight = $instaSectionElement.outerHeight();
    const instaSectionBottom = instaSectionTop + instaSectionHeight;

    const cardItems = document.querySelectorAll(".instagram-feed-image-card");

    var st = window.scrollY || document.documentElement.scrollTop;
    if (st > lastScrollTop) {
      // downscroll code
      srollFromTop = true;
    } else if (st < lastScrollTop) {
      // upscroll code
      srollFromTop = false;
    } // else was horizontal scroll
    lastScrollTop = st <= 0 ? 0 : st;

    if (
      windowScrollTop + 100 >= instaSectionTop &&
      windowScrollBottom <= instaSectionBottom &&
      activeIndex != cardItems.length - 1 &&
      activeIndex >= 0 &&
      !globalStateObject.scrollWithoutSticky
    ) {
      $(".intagram-image-gallery-section").get(0).scrollIntoView();
      $("html").addClass("overflow-hidden");
    }

    if (
      windowScrollCenter > instaSectionTop &&
      windowScrollCenter < instaSectionBottom
    ) {
      $(".instagram-feed-image-card").addClass("left-card-scroll-animation");
    }
  });

  // Listeners
  // document.addEventListener('wheel', handleWheel);
  var $instaFeedContainer = document.getElementById("instagram-feed-container");
  $instaFeedContainer.addEventListener("wheel", handleWheel);
  $instaFeedContainer.addEventListener("mousedown", handleMouseDown);
  $instaFeedContainer.addEventListener("mousemove", handleMouseMove);
  $instaFeedContainer.addEventListener("mouseup", handleMouseUp);
  // $instaFeedContainer.addEventListener("touchstart", handleMouseDown);
  // $instaFeedContainer.addEventListener("touchmove", handleMouseMove);
  // $instaFeedContainer.addEventListener("touchend", handleMouseUp);
}
function cardViewWindowChanges() {
  cardImageDesignChange();
  $(window).on("resize", function (event) {
    cardImageDesignChange();
  });
}

function initCarousel() {
  var customDotClick = false; // Flag variable

  function checkWidth() {
    return $(window).width() < 350;
  }
  $(".instagram-feed-image-slick-wrapper").on("init", function (event, slick) {
    var dotCount = slick.slideCount;
    var staticDots = '<ul class="slick-dots custom-dots">';

    // Add your custom li tags here
    staticDots += `
      
      <li class="prev-dot-prev" role="presentation" style="display: block">
        <button type="button" role="tab">1</button>
      </li>
      <li class="prev-dot" role="presentation" style="display: block">
        <button type="button" role="tab">2</button>
      </li>
      <li role="presentation" id="slick-active" class="slick-active" style="display: block">
        <button type="button" role="tab" aria-selected="true">3</button>
      </li>
      <li class="next-dot" role="presentation" style="display: block" class="">
        <button type="button" role="tab">4</button>
      </li>
      <li class="next-dot-next" role="presentation" style="display: block" class="">
        <button type="button" role="tab">5</button>
      </li>
      `;

    staticDots += "</ul>";

    $(this).find(".slick-dots").replaceWith(staticDots);
    var $prevDotPrev = $(this).find(".prev-dot-prev");
    var $nextDotNext = $(this).find(".next-dot-next");
    gsap.set($prevDotPrev, { scale: 0 });
    gsap.set($nextDotNext, { scale: 0 });
  });

  $(".instagram-feed-image-slick-wrapper").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    dots: true, // Enable Slick dots
    arrows: false,
    centerMode: true,
    centerPadding: checkWidth() ? "20%" : "30%",
    autoplay: true,
    autoplaySpeed: 3000, // Adjust the auto-play speed as needed
  });

  // Function to apply the GSAP scaling animation on the active slide
  function animateActiveSlide($activeSlide) {
    gsap.fromTo(
      $activeSlide,
      { scaleY: 0, x: 2, backgroundColor: "white" },
      {
        duration: 1,
        scaleY: 1,
        ease: "power2.out",
        x: 0,
        backgroundColor: "#fed500",
      }
    );
  }

  // Add click event listener to the custom dots (both "next" and "prev" buttons)
  $(".instagram-feed-image-slick-wrapper").on(
    "click",
    ".prev-dot",
    function () {
      customDotClick = true;
      var $activeSlide = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find("#slick-active>button");

      var $nextDot = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find(".next-dot>button");
      gsap.fromTo(
        $nextDot,
        { scale: (1.8, 1.35), y: 3, backgroundColor: "#fed500" },
        {
          scale: 1,
          duration: 0.5,
          y: 0,
          backgroundColor: "white",
          ease: "power2.in",
        }
      );
      var $nextDotNext = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find(".next-dot-next");
      gsap.fromTo(
        $nextDotNext,
        { scale: 0.6, ease: "power2.in", duration: 1 },
        { scale: 0, duration: 1 }
      );
      animateActiveSlide($activeSlide);
      setTimeout(function () {
        customDotClick = false;
      }, 1000); // Assuming the animation duration is 1000ms (adjust as needed)

      $(this).closest(".instagram-feed-image-slick-wrapper").slick("slickPrev");
    }
  );

  $(".instagram-feed-image-slick-wrapper").on(
    "click",
    ".next-dot",
    function () {
      customDotClick = true;

      var $activeSlide = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find("#slick-active>button");

      var $prevDot = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find(".prev-dot>button");
      gsap.fromTo(
        $prevDot,
        { scale: (1.8, 1.35), y: -3, backgroundColor: "#fed500" },
        {
          scale: 1,
          duration: 0.5,
          y: 0,
          backgroundColor: "white",
          ease: "power2.in",
        }
      );
      var $prevDotPrev = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find(".prev-dot-prev");
      gsap.fromTo(
        $prevDotPrev,
        { scale: 0.6, ease: "power2.in", duration: 1 },
        { scale: 0, duration: 1 }
      );

      animateActiveSlide($activeSlide);
      setTimeout(function () {
        customDotClick = false;
      }, 1000); // Assuming the animation duration is 1000ms (adjust as needed)

      $(this).closest(".instagram-feed-image-slick-wrapper").slick("slickNext");
    }
  );

  // Add the GSAP scaling animation on auto-play slide change (after the change)
  $(".instagram-feed-image-slick-wrapper").on(
    "beforeChange",
    function (event, slick, currentSlide) {
      var $activeSlide = $(this)
        .closest(".instagram-feed-image-slick-wrapper")
        .find("#slick-active>button");
      if (!customDotClick) {
        var $prevDot = $(this)
          .closest(".instagram-feed-image-slick-wrapper")
          .find(".prev-dot>button");
        gsap.fromTo(
          $prevDot,
          { scale: (1.8, 1.35), y: -3, backgroundColor: "#fed500" },
          {
            scale: 1,
            duration: 1,
            y: 0,
            backgroundColor: "white",
            ease: "power2.in",
          }
        );
        var $prevDotPrev = $(this)
          .closest(".instagram-feed-image-slick-wrapper")
          .find(".prev-dot-prev");
        gsap.fromTo(
          $prevDotPrev,
          { scale: 0.6, ease: "power2.in", duration: 1 },
          { scale: 0, duration: 1 }
        );
      }

      animateActiveSlide($activeSlide);
    }
  );
}

function cardImageDesignChange() {
  if (!isDesktop()) {
    $(".insta-card-image-section")
      .removeClass("instagram-feed-image-wrapper")
      .addClass("instagram-feed-image-slick-wrapper");
    initCarousel();
  } else {
    $(".insta-card-image-section")
      .addClass("instagram-feed-image-wrapper")
      .removeClass("instagram-feed-image-slick-wrapper");
    cardAnimation();
  }
}
