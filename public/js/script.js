var list, volumen = 100, rand, repeat, calidad = 'small';

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player, time_update_interval = 0;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('video', { events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange } });
}

var err = 0;
function onPlayerStateChange(event) {
  player.setPlaybackQuality(calidad);
  player.setVolume(volumen);
  switch (event.data) {
    case -1:
      //err = setInterval(function () { siguiente(); }, 1500);
      player.playVideo();
      break;
    case 1:
    case 3:
      clearInterval(err);
      break;
  }
}
function onPlayerReady() {
  player.playVideo();
  player.addEventListener('onStateChange', function (e) {
    if (e.data == 1) {
      onPlay();
    } else if (e.data == 0) {
      siguiente();
    } else if (e.data == 2) {
      onPause();
    }
  });
  player.setPlaybackQuality(calidad);
}

function new_play(video) {
  if (typeof (video) != "undefined") {
    player.loadVideoById({ 'videoId': video, 'suggestedQuality': calidad });
    player.setVolume(volumen);
  }
}


var timeout;
function onPlay() {
  console.log(list.find('li.playing'));
  play(list.find('li.playing'));
  //list.find('li.playing').find('.play b').text('Detener');
  timeout = setInterval(function () {
    $('.tiempo').text(time_set(player.getDuration()) + ' / ' + time_set(player.getCurrentTime()));
  }, 500);
}

function onPause() {
  $('li').find('.t').text('Play');
  pause(list.find('li.playing'));
  $('li.playing i').removeClass('fa-pause-circle-o');
  clearInterval(timeout);
}
var pause = function (elm) {
  var elm = elm;
  player.pauseVideo();
}

function time_set(totalSec) {
  var hours = parseInt(totalSec / 3600) % 24;
  var minutes = parseInt(totalSec / 60) % 60;
  var seconds = parseInt(totalSec % 60);
  if (hours != 0) var horas = (hours < 10 ? "0" + hours : hours) + ":";
  else var horas = '';
  return horas + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

var siguiente = function () {
  var next = list.find('li.playing').next();
  if (next.length == 0) {
    next = list.find('li:first-child');
  }
  if (next.attr('yt')) {
    play(next, next.attr('yt'));
  } else {
    play(next.next(), next.next().attr('yt'));
  }
}

var play = function (li, video) {
  var li = li;
  console.log(list);
  list.find('li').removeAttr('class');

  list.find('li .btn .pausar i').attr('class', 'far fa-play-circle');
  list.find('li .btn .pausar').find('b').text('Escuchar');
  list.find('li .btn .pausar').attr('class', 'play');

  list.find('.tiempo').remove();
  li.find('figure').append('<span class="tiempo"></span>');

  list.find('li .btn .play i').attr('class', 'far fa-play-circle');

  li.find('.btn .play i').attr('class', 'far fa-pause-circle');
  li.find('.btn .play b').text('Detener').parent().attr('class', 'pausar');
  li.addClass('playing');

  if (typeof (video) != "undefined") {
    new_play(video);
  } else {
    player.playVideo();
  }
  volumen = 100;
}


$(document).ready(function () {

  /* menu movil */

  $(document).on('click', '#bb', function () {
    var el = $(this), m = $('#mm');
    if (el.hasClass('abierto')) { m.slideUp(); el.removeAttr('class').find('i').attr('class', 'fa fa-bars'); }
    else { m.slideDown(); el.addClass('abierto').find('i').attr('class', 'fa fa-times'); }
    return false;
  });

  /* menu movil */


  list = $('.youtube');

  $(document).on('click', '.youtube li .btn .play', function () {
    var li = $(this).parent().parent().parent(), id = li.attr('yt');
    console.log(id, '>... play');

    play(li, id);
    return false;
  });

  $(document).on('click', '.descargar', function () {
    var el = $(this).parent().parent().parent(), id = el.attr('yt');
    $('.descarga').remove();
    $('<div>', { 'class': 'descarga' }).appendTo(el).html('<iframe style="width:100%;height:90px;" src="//dl.pazyvidaradio.com/buttons/' + id + '" style="" frameborder="0" scrolling="no"></iframe>');

    return false;
  });

  $(document).on('click', '.pausar', function () {


    var el = $(this), texto = el.find('b');
    if (texto.text() == 'Detener') {
      console.log('pause');
      player.pauseVideo();
      el.find('i').attr('class', 'far fa-play-circle');
      el.find('b').text('Escuchar');
      //    el.attr('class','play');
    } else {
      if (el.parent().parent().parent().hasClass('playing') == false) {
        console.log('play nuevo id');
        play(el.parent().parent(), el.parent().parent().attr('yt'));
        $('.youtube li').removeClass('playing');
        el.parent().parent().addClass('playing');
      } else {
        console.log('continuar play id');
        player.playVideo();
      }
    }

    return false;
  });


  $(document).on('click', 'nav > .fa', function () {
    var n = $(this), m = n.parent().find('ul');
    if (!m.is(':visible')) { m.slideDown('fast'); }
    else { m.slideUp('fast'); }
  });

  $(window).resize(function () {
    var ancho = $(window).width();
    if (ancho > 767) {
      $('#nav ul').removeAttr('style');
      $('.nav').removeClass('active');
    }
  });
});
