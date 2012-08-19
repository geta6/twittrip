$(function () {
  var direction = $('#direction');
  window.addEventListener('deviceorientation', function (e) {
    var compass = e.webkitCompassHeading;
    direction.css({'-webkit-transform': 'rotate(' + (-1 * c) + 'deg)'});
    console.log('DIR ', -1*c);
  }, false);
});
