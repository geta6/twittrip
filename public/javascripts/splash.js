$(function () {
  var splash = $('#splash'), active = $('#spl_active');

  setTimeout(function () {
    active.fadeOut(360, function () {
      splash.fadeOut(240);
    });
  }, 1200);
});
