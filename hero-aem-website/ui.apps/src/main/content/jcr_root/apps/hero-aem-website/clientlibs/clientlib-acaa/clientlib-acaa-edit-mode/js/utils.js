// Global state
const globalStateObject = {
  audioInstance: null,
  isMobile: false,
  scrollWithoutSticky: false
};

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
}

function startBgMusic() {
  globalStateObject.audioInstance.playBgMusic();
}

function pauseBgMusic() {
  globalStateObject.audioInstance.pauseBgMusic();
}

function initAudioUtils() {
  globalStateObject.audioInstance = new AudioController();
}

function setWindowSize() {
  globalStateObject.isMobile = $(window).width() < 767;
}
setWindowSize();

function isMobile() {
  return globalStateObject.isMobile;
}
