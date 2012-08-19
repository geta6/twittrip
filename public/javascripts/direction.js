$(function () {
  window.addEventListener('deviceorientation', function (e) {
    var direction = $('#direction');
    var compass = e.webkitCompassHeading;
    direction.css({'-webkit-transform': 'rotate(' + (-1 * compass) + 'deg)'});
    console.log('DIR ' + compass);

  }, false);
});
