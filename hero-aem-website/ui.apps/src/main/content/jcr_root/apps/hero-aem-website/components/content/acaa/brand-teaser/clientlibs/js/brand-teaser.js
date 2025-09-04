$(document).ready(function () {
  try {
    setTimeout(function () {
      window.scrollTo(0, 0);
      if ($(".bike-intro").isInViewport()) {
        if ($(window).width() > 991) {
          $("html").addClass("overflow-hidden");
        }
      }
      globalStateObject.scrollWithoutSticky = false;
    }, 1500);
    initTeaser();
    onLoadAnimationState();
    playbgVideo();
    mobileViewBgVideoAnimation();

    // on scroll, transition function triggered
    var isMobile = $(window).width() <= 767 ? true : false;
    $(window).scroll(function () {
      brandTeaserBgVideoAnimation(isMobile);
    });
  } catch (error) {
    console.error(error);
  }
});

// mobile-view bg video animation
function mobileViewBgVideoAnimation() {
  if ($(window).width() <= 767) {
    $(".acaa-bg-loop-video-wrapper, .acaa-bg-video-wrapper").remove();
  } else {
    $(".acaa-bg-mobile-video-wrapper").remove();
  }
}

// dynamically setting value for mobile & desktop view
function bgVideoAnimationValue(opacityValue, translateValue, scaleValue) {
  const $brandTeaserBgVideo = $(
    ".acaa-bg-loop-video-wrapper, .acaa-bg-video-wrapper, .acaa-bg-mobile-video-wrapper"
  );
  $brandTeaserBgVideo.css("opacity", opacityValue);
  $brandTeaserBgVideo.css(
    "transform",
    `scale(${scaleValue}) translateY(${translateValue}%)`
  );
}

// play non-loop video once text-animation ends
function playbgVideo() {
  setTimeout(function () {
    const $video = $(".acaa-bg-video")[0];
    if ($video) {
      $video.play();
    }
  }, 11000);
  setTimeout(function () {
    $(".acaa-bg-video-wrapper").remove();
  }, 21500);
}

function showOnItsWayHeaderText() {
  $(".acaa-header-button-wrapper .cmp-text").removeClass("d-none");
  $(".brand-teaser-page .on-its-way").addClass("d-none");
}

function hideOnItsWayHeaderText() {
  $(".acaa-header-button-wrapper .cmp-text").addClass("d-none");
  $(".brand-teaser-page .on-its-way").removeClass("d-none");
}

// preset animation on page load
function onLoadAnimationState() {
  const $brandTeaserBgVideo = $(
    ".acaa-bg-loop-video-wrapper, .acaa-bg-video-wrapper"
  );
  $brandTeaserBgVideo.css("opacity", 1);
  $brandTeaserBgVideo.css("transform", "scale(1) translateY(-16%)");
}

// Brand Teaser background video animation
function brandTeaserBgVideoAnimation(isMobile) {
  const windowHeight = $(window).height();
  const windowScrollTop = $(window).scrollTop();

  // formula to calculate bottom of screen
  const windowBottom = windowHeight + windowScrollTop;

  // formula to calculate the center of screen
  const windowCenter = windowScrollTop + windowHeight / 2;

  // scoping the brand-teaser sections and calculating its position in the screen
  const $bikeIntroSection = $(".bike-intro");
  const $testimonialSection = $(".testimonial");
  const $currentTrendsSection = $(".current-trends");
  const $instaFeedSection = $(".insta-feed");
  const $leadGenInviteSection = $(".leadgen-invite");
  const $preTeaserSection = $(".pre-teaser");

  // calculating each section top, bottom, height, center
  const bikeIntroSectionTop = $bikeIntroSection.offset().top;
  const bikeIntroSectionHeight = $bikeIntroSection.outerHeight();
  const bikeIntroSectionBottom = bikeIntroSectionTop + bikeIntroSectionHeight;

  // testimonial-section
  const testimonialSectionTop = $testimonialSection.offset().top;
  const testimonialSectionHeight = $testimonialSection.outerHeight();

  const testimonialSectionCenter =
    testimonialSectionTop + testimonialSectionHeight / 2;

  // current-trends-section
  const currentTrendsSectionTop = $currentTrendsSection.offset().top;
  const currentTrendsSectionHeight = $currentTrendsSection.outerHeight();

  const currentTrendsSectionCenter =
    currentTrendsSectionTop + currentTrendsSectionHeight / 2;

  // insta-feed section
  const instaFeedSectionTop = $instaFeedSection.offset().top;
  const instaFeedSectionHeight = $instaFeedSection.outerHeight();
  const instaFeedSectionCenter =
    instaFeedSectionTop + instaFeedSectionHeight / 2;

  // lead-gen section
  const leadGenInviteSectionTop = $leadGenInviteSection.offset().top;
  const leadGenInviteSectionHeight = $leadGenInviteSection.outerHeight();

  const leadGenInviteSectionCenter =
    leadGenInviteSectionTop + leadGenInviteSectionHeight / 2;

  // pre-teaser section
  const preTeaserSectionTop = $preTeaserSection.offset().top;
  const preTeaserSectionHeight = $preTeaserSection.outerHeight();
  const preTeaserSectionBottom = preTeaserSectionTop + preTeaserSectionHeight;

  // if each section comes to center of the viewport, transition triggers
  if (
    windowScrollTop > bikeIntroSectionTop - 1 &&
    windowCenter < bikeIntroSectionBottom
  ) {
    var translateValue = isMobile ? 0 : -16;
    bgVideoAnimationValue(1, translateValue, 1);
    if (!globalStateObject.scrollWithoutSticky) {
      hideOnItsWayHeaderText();
    } else {
      showOnItsWayHeaderText();
    }
    setBgMusicVolume(1);
  } else if (
    windowBottom > testimonialSectionTop &&
    windowScrollTop < testimonialSectionCenter
  ) {
    var opacityValue = isMobile ? 0.2 : 0.1;
    var translateValue = isMobile ? 10 : -10;
    var scaleValue = isMobile ? 0.8 : 1;
    bgVideoAnimationValue(opacityValue, translateValue, scaleValue);
    showOnItsWayHeaderText();
    setBgMusicVolume(0.2);
  } else if (
    windowCenter > currentTrendsSectionTop &&
    windowScrollTop < currentTrendsSectionCenter
  ) {
    var opacityValue = isMobile ? 0.2 : 0.1;
    var translateValue = isMobile ? 10 : -10;
    var scaleValue = isMobile ? 0.85 : 1.1;
    bgVideoAnimationValue(opacityValue, translateValue, scaleValue);
    showOnItsWayHeaderText();
  } else if (
    windowCenter > instaFeedSectionTop &&
    windowScrollTop < instaFeedSectionCenter
  ) {
    var opacityValue = isMobile ? 0.2 : 0.1;
    var translateValue = isMobile ? 10 : -10;
    var scaleValue = isMobile ? 0.9 : 1.2;
    bgVideoAnimationValue(opacityValue, translateValue, scaleValue);
    showOnItsWayHeaderText();
  } else if (
    windowCenter > leadGenInviteSectionTop &&
    windowScrollTop < leadGenInviteSectionCenter
  ) {
    var opacityValue = isMobile ? 0.3 : 0.2;
    var translateValue = isMobile ? 10 : -10;
    var scaleValue = isMobile ? 0.95 : 1.3;
    bgVideoAnimationValue(opacityValue, translateValue, scaleValue);
    showOnItsWayHeaderText();
    $(".acaa-header").removeClass("fade-up");
    $(".on-its-way").css("top", "72px");
    setBgMusicVolume(0.2);
  } else if (
    windowCenter > preTeaserSectionTop &&
    windowScrollTop < preTeaserSectionBottom
  ) {
    var translateValue = isMobile ? 0 : -20;
    var scaleValue = isMobile ? 1 : 1.5;
    bgVideoAnimationValue(1, translateValue, scaleValue);
    hideOnItsWayHeaderText();
    $(".acaa-header").addClass("fade-up");
    $(".on-its-way").css("top", "25px");
    setBgMusicVolume(1);
  }
}

function initTeaser() {
  // initAudioUtils function needs to be called to enable the background and button music
  initAudioUtils();
  displayOnItsWay();

  // $("#animateText").randomTextFromStart();
  // $(".animate-btn-text").randomTextOnHover();

  $(".bg-music-controller .mouse-cursor-button").click(function () {
    toggleMusicHandler($(this));
  });

  var $muteTextEle = $(".bg-music-controller .mute-btn-text");
  const muteText = $muteTextEle.data("mute-text");
  const unmuteText = $muteTextEle.data("unmute-text");
  function toggleMusicHandler(_this) {
    if (_this.hasClass("playing")) {
      pauseBgMusic();
      _this.removeClass("playing").addClass("muted");
      $muteTextEle.text(unmuteText);
    } else {
      startBgMusic();
      _this.removeClass("muted").addClass("playing");
      $muteTextEle.text(muteText);
    }
  }

  // to display on-its-way in mobile on load
  function displayOnItsWay() {
    if ($(window).width() <= 767) {
      hideOnItsWayHeaderText();
    } else {
      setTimeout(function () {
        if ($(".bike-intro").isInViewport()) {
          hideOnItsWayHeaderText();
        }
      }, 21500);
    }
  }

  // loadFBXModel();
  // initGLTFModel();

  // [TODO]: Remove unused code once the model format is finalized
  //   const container = document.getElementById("container");
  //   function loadFBXModel() {
  //     const scene = new Scene();
  //     //   scene.add(new AxesHelper(5));

  //     const light = new PointLight();
  //     light.position.set(0.8, 1.4, 1.0);
  //     scene.add(light);

  //     const ambientLight = new AmbientLight();
  //     scene.add(ambientLight);

  //     const camera = new PerspectiveCamera(
  //       40,
  //       window.innerWidth / window.innerHeight,
  //       0.5,
  //       999
  //     );
  //     camera.position.set(5, 5, 15);

  //     const renderer = new WebGLRenderer();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //     container.appendChild(renderer.domElement);

  //     const controls = new OrbitControls(camera, renderer.domElement);
  //     controls.enableDamping = true;
  //     controls.target.set(0, 1, 0);
  //     //   controls.minDistance = 5;
  //     //   controls.maxDistance = 15;

  //     const fbxLoader = new FBXLoader();

  //     fbxLoader.load(
  //       "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-premia-site/resources/models/xbot.fbx",
  //       (object) => {
  //         scene.add(object);
  //         animate();
  //       },
  //       (xhr) => {
  //         console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );

  //     window.addEventListener("resize", onWindowResize, false);
  //     function onWindowResize() {
  //       camera.aspect = window.innerWidth / window.innerHeight;
  //       camera.updateProjectionMatrix();
  //       renderer.setSize(window.innerWidth, window.innerHeight);
  //       render();
  //     }

  //     //   const stats = new Stats();
  //     //   document.body.appendChild(stats.dom);

  //     function animate() {
  //       requestAnimationFrame(animate);

  //       controls.update();

  //       render();

  //       // stats.update();
  //     }

  //     function render() {
  //       renderer.render(scene, camera);
  //     }
  //   }

  //   async function initGLTFModel() {
  //     let renderer, scene, camera, controls;
  //     renderer = new WebGLRenderer();
  //     renderer.setPixelRatio(window.devicePixelRatio);
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //     renderer.toneMapping = ACESFilmicToneMapping;
  //     renderer.toneMappingExposure = 1.35;
  //     container.appendChild(renderer.domElement);

  //     scene = new Scene();

  //     camera = new PerspectiveCamera(
  //       40,
  //       window.innerWidth / window.innerHeight,
  //       0.01,
  //       10
  //     );
  //     camera.position.set(-0.35, -0.2, 0.35);

  //     controls = new OrbitControls(camera, renderer.domElement);
  //     controls.target.set(0, -0.08, 0.11);
  //     controls.minDistance = 0.1;
  //     controls.maxDistance = 2;
  //     controls.zoomSpeed = -0.1;
  //     controls.enableRotate = false;
  //     controls.addEventListener("change", render);
  //     controls.update();

  //     const rgbeLoader = new RGBELoader().setPath(
  //       "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-premia-site/resources/textures/"
  //     );
  //     const gltfLoader = new GLTFLoader().setPath(
  //       "/etc.clientlibs/hero-aem-website/clientlibs/clientlib-premia-site/resources/models/"
  //     );

  //     const [texture, gltf] = await Promise.all([
  //       rgbeLoader.loadAsync("royal_esplanade_1k.hdr"),
  //       gltfLoader.loadAsync("AnisotropyBarnLamp.glb"),
  //     ]);

  //     // environment
  //     texture.mapping = EquirectangularReflectionMapping;

  //     scene.background = texture;
  //     scene.backgroundBlurriness = 0.5;
  //     scene.environment = texture;

  //     // model
  //     scene.add(gltf.scene);

  //     render();

  //     window.addEventListener("resize", onWindowResize);

  //     function onWindowResize() {
  //       camera.aspect = window.innerWidth / window.innerHeight;

  //       camera.updateProjectionMatrix();

  //       renderer.setSize(window.innerWidth, window.innerHeight);

  //       render();
  //     }

  //     function render() {
  //       renderer.render(scene, camera);
  //     }
  //   }
}
