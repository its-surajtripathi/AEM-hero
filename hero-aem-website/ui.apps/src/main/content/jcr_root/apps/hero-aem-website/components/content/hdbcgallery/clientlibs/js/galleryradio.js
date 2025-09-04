$(document).ready(function () {

  const audiodefault = $('.radio-jingles-wrap .content-hdbc--slider-wrap .hdbc-gallery-tile a:first').attr('href');
  let audio;
  let volumeRange = document.getElementById('volume');
  let seekbar = document.getElementById('seekbar');

  
  $('.radio-jingles-wrap .hdbc-gallery-tile').on('click', function(){
      $('.radio-jingles-wrap #btnPlay img').removeClass('d-none');
      $('.radio-jingles-wrap #btnPause img').addClass('d-none');
      $('.radio-jingles-wrap #btnMute img').removeClass('d-none');
      $('.radio-jingles-wrap #btnVolume img').addClass('d-none');
      console.log('Audio', document.getElementById("anchorAudioTag"), $(this).find("a").attr('href'))
      if ($(this).find("audio").attr('src') === 'undefined') {
      document.getElementById("audioFileTag").setAttribute('src', audiodefault);
      } else {
      document.getElementById("audioFileTag").setAttribute('src', $(this).find("a").attr('href'));
      }
      
      audio = document.getElementById("audioFileTag");
      
      audio.play();
      audio.addEventListener('timeupdate', UpdateTheTime, false);
      audio.addEventListener('durationchange', SetSeekBar, false);
      if (audio.muted) {
          audio.muted = false;
          volumeRange.value = audio.volume;
      }
      volumeRange.value = audio.volume;
  });

  $('.radio-jingles-wrap #btnPause').click(function () {
    $('#btnPlay img').removeClass('d-none');
    $('#btnPause img').addClass('d-none');
    if (audio.paused) {
        audio.play();
    } else if (audio.ended) {
        audio.currentTime = 0;
        audio.play();
    }
  });

  $('.radio-jingles-wrap .music_volume .quarterly-clickable-container').click(function (clickEvent) {
    clickEvent.preventDefault();
    clickEvent.stopPropagation();
  })

  $('.radio-jingles-wrap #btnPlay').click(function () {
      
    console.log('Audio', audio);
    if (audio.play) {
      $('#btnPause img').removeClass('d-none');
      $('#btnPlay img').addClass('d-none');
      audio.pause();
    }
  })

  $('.radio-jingles-wrap #btnMute').click(function () {
      if (!audio.muted) {
          $('#btnVolume img').removeClass('d-none');
          $('#btnMute img').addClass('d-none');
          audio.muted = true;
          volumeRange.value = 0;
      }
  })

  $('.radio-jingles-wrap #btnVolume').click(function () {
      if (audio.muted) {
          $('#btnMute img').removeClass('d-none');
          $('#btnVolume img').addClass('d-none');
          audio.muted = false;
          volumeRange.value = audio.volume;
      }
    })

    $('.radio-jingles-wrap #galleryRadioDownload').click(function () {
      window.open($(this).parent().parent().parent().find('#audioFileTag').attr('src'));
    })

  $('.radio-jingles-wrap #volume').change(function () {
    var myVol = volumeRange.value;
      audio.volume = myVol;
      if (myVol == 0) {
          audio.muted = true;
      } else {
          audio.muted = false;
      }
  });

  $('.radio-jingles-wrap #seekbar').change(function () {
    audio.currentTime = seekbar.value;
  });

  // fires when page loads, it sets the min and max range of the video
  function SetSeekBar() {
      seekbar.min = 0;
      seekbar.max = audio.duration;
  }

  function UpdateTheTime() {
      var sec = audio.currentTime;
      sec = sec % 3600;
      var min = Math.floor(sec / 60);
      sec = Math.floor(sec % 60);
      if (sec.toString().length < 2) sec = "0" + sec;
      if (min.toString().length < 2) min = "0" + min;
      document.getElementById('lblTime').innerHTML = min + ":" + sec;
      const durationMinutes = Math.floor(Math.round(audio.duration) / 60);
      const durationSeconds = Math.round(audio.duration) - durationMinutes * 60;
      document.getElementById('lblTimeDuration').innerHTML = durationMinutes + ":" + durationSeconds;
      if (audio.currentTime === audio.duration) {
        $('#btnPause img').removeClass('d-none');
        $('#btnPlay img').addClass('d-none');
      }
      seekbar.min = audio.startTime;
      seekbar.max = audio.duration;
      seekbar.value = audio.currentTime;
  }

  $(".radio-jingles-wrap #audioModalRadio").on('hide.bs.modal', function(){
    if (audio.play) {
      audio.pause();
    }
    audio.removeAttribute('src');
  });
});
