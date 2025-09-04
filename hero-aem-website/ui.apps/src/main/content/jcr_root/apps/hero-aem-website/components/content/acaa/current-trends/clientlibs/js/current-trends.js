function initCorousel() {
  let customDotClick = false; // Flag variable
  $(".card-animation-effect").on("init", function (event, slick) {
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
    gsap.set($prevDotPrev, { scale: (0, 0) });
    gsap.set($nextDotNext, { scale: (0, 0) });
  });
  $(".card-animation-effect").slick({
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    speed: 300,
    centerMode: true,
    variableWidth: true,
    arrows: false,
    autoplay: false,
    swipe: true,
  });
  // Function to apply the GSAP scaling animation on the active slide
  function animateActiveSlide($activeSlide) {
    gsap.fromTo(
      $activeSlide,
      { scaleX: 0, x: 2, backgroundColor: "white" },
      {
        scaleX: 1,
        duration: 1,
        ease: "power2.out",
        x: 0,
        backgroundColor: "#FED500",
      }
    );
  }
  // Add click event listener to the custom dots (both "next" and "prev" buttons)
  $(".card-animation-effect").on("click", ".prev-dot", function () {
    customDotClick = true;
    var $activeSlide = $(this)
      .closest(".card-animation-effect")
      .find("#slick-active>button");
    var $nextDot = $(this)
      .closest(".card-animation-effect")
      .find(".next-dot>button");
    gsap.fromTo(
      $nextDot,
      { scale: (1, 1.4), x: -1, backgroundColor: "#FED500" },
      {
        scale: 1,
        duration: 0.5,
        x: 0,
        backgroundColor: "white",
        ease: "power2.in",
      }
    );
    var $nextDotNext = $(this)
      .closest(".card-animation-effect")
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
    $(this).closest(".card-animation-effect").slick("slickPrev");
  });
  $(".card-animation-effect").on("click", ".next-dot", function () {
    customDotClick = true;
    var $activeSlide = $(this)
      .closest(".card-animation-effect")
      .find("#slick-active>button");
    var $prevDot = $(this)
      .closest(".card-animation-effect")
      .find(".prev-dot>button");
    gsap.fromTo(
      $prevDot,
      { scale: (1, 1.4), x: -1, backgroundColor: "#FED500" },
      {
        scale: 1,
        duration: 0.5,
        x: 0,
        backgroundColor: "white",
        ease: "power2.in",
      }
    );
    var $prevDotPrev = $(this)
      .closest(".card-animation-effect")
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
    $(this).closest(".card-animation-effect").slick("slickNext");
  });
  // Add the GSAP scaling animation on auto-play slide change (after the change)
  $(".card-animation-effect").on(
    "beforeChange",
    function (event, slick, currentSlide) {
      var $activeSlide = $(this)
        .closest(".card-animation-effect")
        .find("#slick-active>button");
      if (!customDotClick) {
        var $prevDot = $(this)
          .closest(".card-animation-effect")
          .find(".prev-dot>button");
        gsap.fromTo(
          $prevDot,
          { scale: (1, 1.4), x: -1, backgroundColor: "#FED500" },
          {
            scale: 1,
            duration: 0.5,
            x: 0,
            backgroundColor: "white",
            ease: "power2.in",
          }
        );
        var $prevDotPrev = $(this)
          .closest(".card-animation-effect")
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

function tiltCard(event) {
  const card = event.currentTarget;
  const cardRect = card.getBoundingClientRect();

  const cardCenterX = cardRect.left + card.offsetWidth / 2;
  const cardCenterY = cardRect.top + card.offsetHeight / 2;

  const tiltAmountX = (event.clientX - cardCenterX) * 0.05;
  const tiltAmountY = (event.clientY - cardCenterY) * -0.05;

  card.style.transform = `perspective(62.5rem) rotateX(${tiltAmountY}deg) rotateY(${tiltAmountX}deg)`;
}

function resetCard(event) {
  const card = event.currentTarget;
  card.style.transform = "perspective(62.5rem) rotateX(0deg) rotateY(0deg)";
}

$(document).ready(() => {
  try {
    let animateLeftTrends = gsap.timeline({
      scrollTrigger: {
        trigger: "#current-trends-container",
        start: isMobile() ? "top 75%" : "top 50%",
        end: "+=100",
        once: true, // Add this line to trigger the animation only once
        scrub: 2,
        onEnter: () => {
          $(".left-testimonial-heading").shuffleElementText();
        },
      },
    });
    animateLeftTrends
      .add(textAnimation("#left-testimonial-heading", 45), 0)
      .add(textAnimation(".left-testimonial-sub-heading", 5), 0)
      .add(textAnimation(".left-testimonial-social-media-logo", -45), 0);

    let picCard = document.querySelectorAll(".testimonial-pic-card");
    let withoutPicCard = document.querySelectorAll(".testimonial-non-pic-card");
    let animationCardEffect = document.querySelector(".primary");
    let animationCardEffectClone = document.querySelector(".secondary");
    let timeTakenForAnimation = 18;
    let animationContainerHeight = animationCardEffect.scrollHeight;
    let screenHeight = window.innerHeight;
    let ratio = (animationContainerHeight / screenHeight).toFixed(2);
    let primaryAnimationPause;
    let secondaryAnimationPause;
    let animateTriggered;

    animationCardEffectClone.style.top = `105%`;

    const KeyframeForMoreThanScreenSizePrimary = [
      { right: "0px", top: "0px" },
      { right: "0px", top: `${-animationContainerHeight - 24}px` },
    ];

    const KeyframeForMoreThanScreenSizeSecondary = [
      { right: "0px", top: `${animationContainerHeight + 24}px` },
      { right: "0px", top: "0" },
    ];

    const timing = {
      delay: 1000,
      duration: ratio * timeTakenForAnimation * 1000,
      iterations: Infinity,
    };
    if ($(window).width() > 767 && ratio <= 1) {
      animationCardEffect.style.top = "10%";
      animationCardEffect.style.right = "0%";
    }

    document.addEventListener("scroll", function () {
      if (
        $(".testimonial-container").isInViewport() &&
        $(window).width() > 767 &&
        ratio > 1
      ) {
        if (
          !animateTriggered &&
          (primaryAnimationPause || secondaryAnimationPause)
        ) {
          animateTriggered = true;
          setTimeout(() => {
            primaryAnimationPause.play();
            secondaryAnimationPause.play();
          }, 1000);
        }
        if (
          !animateTriggered &&
          (!primaryAnimationPause || !secondaryAnimationPause)
        ) {
          animateTriggered = true;
          primaryAnimationPause = animationCardEffect.animate(
            KeyframeForMoreThanScreenSizePrimary,
            timing
          );
          secondaryAnimationPause = animationCardEffectClone.animate(
            KeyframeForMoreThanScreenSizeSecondary,
            timing
          );
        }
      } else {
        if (
          (primaryAnimationPause || secondaryAnimationPause) &&
          (!$(".testimonial-container").isInViewport() || $(window).width < 767)
        ) {
          animateTriggered = false;
          primaryAnimationPause.pause();
          secondaryAnimationPause.pause();
        }
      }
    });

    if ($(window).width() > 767) {
      animationCardEffect.addEventListener("mouseenter", function () {
        if (primaryAnimationPause || secondaryAnimationPause) {
          primaryAnimationPause.pause();
          secondaryAnimationPause.pause();
        }
      });

      animationCardEffectClone.addEventListener("mouseenter", function () {
        if (primaryAnimationPause || secondaryAnimationPause) {
          primaryAnimationPause.pause();
          secondaryAnimationPause.pause();
        }
      });

      animationCardEffect.addEventListener("mouseover", function () {
        if (primaryAnimationPause || secondaryAnimationPause) {
          primaryAnimationPause.pause();
          secondaryAnimationPause.pause();
        }
      });

      animationCardEffectClone.addEventListener("mouseover", function () {
        if (primaryAnimationPause || secondaryAnimationPause) {
          primaryAnimationPause.pause();
          secondaryAnimationPause.pause();
        }
      });

      animationCardEffect.addEventListener("mouseleave", function () {
        if (primaryAnimationPause || secondaryAnimationPause) {
          primaryAnimationPause.play();
          secondaryAnimationPause.play();
        }
      });

      animationCardEffectClone.addEventListener("mouseleave", function () {
        if (primaryAnimationPause || secondaryAnimationPause) {
          primaryAnimationPause.play();
          secondaryAnimationPause.play();
        }
      });
    }

    [...picCard, ...withoutPicCard].forEach(function (ele) {
      ele.addEventListener("mousemove", event => tiltCard(event));
      ele.addEventListener("mouseleave", event => {
        resetCard(event);
      });
    });
    if ($(window).width() <= 767) {
      initCorousel();
    }
  } catch (err) {
    console.log(err);
  }
});
