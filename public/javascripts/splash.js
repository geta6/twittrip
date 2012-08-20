$(function () {
  var splash = $('#splash'), inactive = $('#spl_inactive');

  setTimeout(function () {
    inactive.fadeOut(360, function () {
      splash.fadeOut(240);
    });
  }, 960);
});
