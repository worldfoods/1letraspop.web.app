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

function friendly_url(str, max) {
  if (max === undefined) max = 32;
  var a_chars = new Array(
    new Array("a", /[áàâãªÁÀÂÃ]/g),
    new Array("e", /[éèêÉÈÊ]/g),
    new Array("i", /[íìîÍÌÎ]/g),
    new Array("o", /[òóôõºÓÒÔÕ]/g),
    new Array("u", /[úùûÚÙÛ]/g),
    new Array("c", /[çÇ]/g),
    new Array("n", /[Ññ]/g)
  );
  // Replace vowel with accent without them
  for (var i = 0; i < a_chars.length; i++)
    str = str.replace(a_chars[i][1], a_chars[i][0]);
  // first replace whitespace by -, second remove repeated - by just one, third turn in low case the chars,
  // fourth delete all chars which are not between a-z or 0-9, fifth trim the string and
  // the last step truncate the string to 32 chars
  return str.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9\-]/g, '').replace(/\-{2,}/g, '-').replace(/(^\s*)|(\s*$)/g, '').substr(0, max);
}
//(function(d,z,s){s.src='//'+d+'/401/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('glizauvo.net',4854757,document.createElement('script'))

var autoComplete = function () { function a(a) { function b(a, b) { return a.classList ? a.classList.contains(b) : new RegExp("\\b" + b + "\\b").test(a.className) } function c(a, b, c) { a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c) } function d(a, b, c) { a.detachEvent ? a.detachEvent("on" + b, c) : a.removeEventListener(b, c) } function e(a, d, e, f) { c(f || document, d, function (c) { for (var d, f = c.target || c.srcElement; f && !(d = b(f, a));)f = f.parentElement; d && e.call(f, c) }) } if (document.querySelector) { var f = { selector: 0, source: 0, minChars: 3, delay: 150, offsetLeft: 0, offsetTop: 1, cache: 1, menuClass: "", renderItem: function (a, b) { b = b.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); var c = new RegExp("(" + b.split(" ").join("|") + ")", "gi"); return '<li class="autocomplete-suggestion" data-val="' + a + '"><a class="click_fast" href="./search?q=' + friendly_url(a) + '">' + a.replace(c, "<b>$1</b>") + "</a></li>" }, onSelect: function (a, b, c) { } }; for (var g in a) a.hasOwnProperty(g) && (f[g] = a[g]); for (var h = "object" == typeof f.selector ? [f.selector] : document.querySelectorAll(f.selector), i = 0; i < h.length; i++) { var j = h[i]; j.sc = document.createElement("ul"), j.sc.className = "autocompletador" + f.menuClass, j.autocompleteAttr = j.getAttribute("autocomplete"), j.setAttribute("autocomplete", "off"), j.cache = {}, j.last_val = "", j.updateSC = function (a, b) { var c = j.getBoundingClientRect(); if (j.sc.style.width = Math.round(c.right - c.left) + "px", !a && (j.sc.style.display = "block", j.sc.maxHeight || (j.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(j.sc, null) : j.sc.currentStyle).maxHeight)), j.sc.suggestionHeight || (j.sc.suggestionHeight = j.sc.querySelector(".autocomplete-suggestion").offsetHeight), j.sc.suggestionHeight)) if (b) { var d = j.sc.scrollTop, e = b.getBoundingClientRect().top - j.sc.getBoundingClientRect().top; e + j.sc.suggestionHeight - j.sc.maxHeight > 0 ? j.sc.scrollTop = e + j.sc.suggestionHeight + d - j.sc.maxHeight : 0 > e && (j.sc.scrollTop = e + d) } else j.sc.scrollTop = 0 }, c(window, "resize", j.updateSC), $("#search").after(j.sc), e("autocomplete-suggestion", "mouseleave", function (a) { var b = j.sc.querySelector(".autocomplete-suggestion.selected"); b && setTimeout(function () { b.className = b.className.replace("selected", "") }, 20) }, j.sc), e("autocomplete-suggestion", "mouseover", function (a) { var b = j.sc.querySelector(".autocomplete-suggestion.selected"); b && (b.className = b.className.replace("selected", "")), this.className += " selected" }, j.sc), e("autocomplete-suggestion", "mousedown", function (a) { if (b(this, "autocomplete-suggestion")) { var c = this.getAttribute("data-val"); j.value = c, f.onSelect(a, c, this), j.sc.style.display = "none" } }, j.sc), j.blurHandler = function () { try { var a = document.querySelector(".autocompletador:hover") } catch (a) { var a } a ? j !== document.activeElement && setTimeout(function () { j.focus() }, 20) : (j.last_val = j.value, j.sc.style.display = "none", setTimeout(function () { j.sc.style.display = "none" }, 350)) }, c(j, "blur", j.blurHandler); var k = function (a) { var b = j.value; if (j.cache[b] = a, a.length && b.length >= f.minChars) { for (var c = "", d = 0; d < a.length; d++)c += f.renderItem(a[d], b); j.sc.innerHTML = c, j.updateSC(0) } else j.sc.style.display = "none" }; j.keydownHandler = function (a) { var b = window.event ? a.keyCode : a.which; if ((40 == b || 38 == b) && j.sc.innerHTML) { var c, d = j.sc.querySelector(".autocomplete-suggestion.selected"); return d ? (c = 40 == b ? d.nextSibling : d.previousSibling, c ? (d.className = d.className.replace("selected", ""), c.className += " selected", j.value = c.getAttribute("data-val")) : (d.className = d.className.replace("selected", ""), j.value = j.last_val, c = 0)) : (c = 40 == b ? j.sc.querySelector(".autocomplete-suggestion") : j.sc.childNodes[j.sc.childNodes.length - 1], c.className += " selected", j.value = c.getAttribute("data-val")), j.updateSC(0, c), !1 } if (27 == b) j.value = j.last_val, j.sc.style.display = "none"; else if (13 == b || 9 == b) { var d = j.sc.querySelector(".autocomplete-suggestion.selected"); d && "none" != j.sc.style.display && (f.onSelect(a, d.getAttribute("data-val"), d), setTimeout(function () { j.sc.style.display = "none" }, 20)) } }, c(j, "keydown", j.keydownHandler), j.keyupHandler = function (a) { var b = window.event ? a.keyCode : a.which; if (!b || (35 > b || b > 40) && 13 != b && 27 != b) { var c = j.value; if (c.length >= f.minChars) { if (c != j.last_val) { if (j.last_val = c, clearTimeout(j.timer), f.cache) { if (c in j.cache) return void k(j.cache[c]); for (var d = 1; d < c.length - f.minChars; d++) { var e = c.slice(0, c.length - d); if (e in j.cache && !j.cache[e].length) return void k([]) } } j.timer = setTimeout(function () { f.source(c, k) }, f.delay) } } else j.last_val = c, j.sc.style.display = "none" } }, c(j, "keyup", j.keyupHandler), j.focusHandler = function (a) { j.last_val = "\n", j.keyupHandler(a) }, f.minChars || c(j, "focus", j.focusHandler) } this.destroy = function () { for (var a = 0; a < h.length; a++) { var b = h[a]; d(window, "resize", b.updateSC), d(b, "blur", b.blurHandler), d(b, "focus", b.focusHandler), d(b, "keydown", b.keydownHandler), d(b, "keyup", b.keyupHandler), b.autocompleteAttr ? b.setAttribute("autocomplete", b.autocompleteAttr) : b.removeAttribute("autocomplete"), document.body.removeChild(b.sc), b = null } } } } return a }(); !function () { "function" == typeof define && define.amd ? define("autoComplete", function () { return autoComplete }) : "undefined" != typeof module && module.exports ? module.exports = autoComplete : window.autoComplete = autoComplete }(), $(function () {
  new autoComplete({
    selector: "#search", minChars: 1, source: function (a, b) { $.ajax({ url: "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=" + a, type: "GET", dataType: "jsonp", success: function (a) { b(a[1]) } }) }, onSelect: function (a, b, c) {
      location.href = './search?q=' + friendly_url(b);
      $(".frm_search").submit()
    }
  })
});