// Global state
const globalStateObject = {
  audioInstance: null,
  isMobile: false,
  isDesktop: false,
  scrollWithoutSticky: false,
};

// This is needed if the user scrolls down during page load and you want to make sure the page is scrolled to the top once it's fully loaded. This has Cross-browser support.
globalStateObject.scrollWithoutSticky = true;
window.scrollTo(0, 0);

// Class to control the background audio
class AudioController {
  constructor() {
    this.bgAudio = $("#pageBgMusic")[0];
    this.hoverMusic = $("#hoverMusic")[0];
    this.clickMusic = $("#clickMusic")[0];
  }

  playBgMusic() {
    this.resetBgMusicTime();
    this.bgAudio.play();
  }

  pauseBgMusic() {
    this.bgAudio.pause();
  }

  resetBgMusicTime() {
    this.bgAudio.currentTime = 0;
  }

  resumeBgMusic() {
    this.bgAudio.play();
  }

  playHoverMusic() {
    this.hoverMusic.play();
  }

  pauseHoverMusic() {
    this.hoverMusic.pause();
    this.hoverMusic.currentTime = 0;
  }

  playClickMusic() {
    this.clickMusic.currentTime = 0;
    this.clickMusic.play();
  }

  pauseClickMusic() {
    this.clickMusic.pause();
    this.clickMusic.currentTime = 0;
  }

  setBgMusicVolume(volume) {
    this.bgAudio.volume = volume;
  }
}

function startBgMusic() {
  globalStateObject.audioInstance.playBgMusic();
}

function pauseBgMusic() {
  globalStateObject.audioInstance.pauseBgMusic();
}

function setBgMusicVolume(volume = 1) {
  globalStateObject.audioInstance.setBgMusicVolume(volume);
}

function initAudioUtils() {
  globalStateObject.audioInstance = new AudioController();
}

function setWindowSize() {
  globalStateObject.isMobile = $(window).width() < 767;
  globalStateObject.isDesktop = $(window).width() >= 992;
}
setWindowSize();

function isMobile() {
  return globalStateObject.isMobile;
}

function isDesktop() {
  return globalStateObject.isDesktop;
}

function debounce(fn, d) {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, d);
  };
}
