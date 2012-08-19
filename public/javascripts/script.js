var map;
var mapOptions;
var geocoder;
var geocoder2;

var currentLat;
var currentLon;
var landingLat;
var landingLon;
var heading;

var interval;

var threw = false;

$(function () {

  var str  = $('#string')
    , map_canvas  = $('#map_canvas');
  var max = 0;
  var direction;
  var floatDistance;
  var movedDegree;
  var flag = "../images/beachflag.png";
  // limit 5 locations: if you obtain more than 5 locations, URL is too long and enable to write some messages.
  var floatingLocations;

  window.addEventListener('deviceorientation', function (e) {
    var c = -1 * e.webkitCompassHeading
      , a = e.webkitCompassAccuracy
      , d = $('#direction');
      //console.log(e.webkitCompassHeading);
    if(threw == false){
      d.css({'-webkit-transform': 'rotate(' + c + 'deg)'});
      heading = c;
    }
  }, false);






  //set map
  function initialize() {
    mapOptions = { zoom: 6, mapTypeId: google.maps.MapTypeId.ROADMAP };
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);


    if(navigator.geolocation) {
      geocoder = new google.maps.Geocoder();
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var currentMarker = new google.maps.Marker({
          map: map,
          position: pos,
          icon:flag,
          animation: google.maps.Animation.DROP
        });
        currentMarker.setMap(map);
        var currentInfo = new google.maps.InfoWindow();
        geocoder.geocode({'latLng': pos}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[6]) {
              map.setZoom(6);
              currentInfo.setContent(results[6].formatted_address);
              currentInfo.open(map, currentMarker);
            }
          } else {
            alert("Geocoder failed due to: " + status);
          }
        });
// todo:reverse geocoding

        //get current position
        currentLat = Math.ceil(position.coords.latitude*100)/100;
        currentLon = Math.ceil(position.coords.longitude*100)/100;
        alert("Current pos:" + currentLat + ", " + currentLon);
        map.setCenter(pos);
      }, function() {
        handleNoGeolocation(true);
      });
    } else {
      handleNoGeolocation(false);
    }
  }
  google.maps.event.addDomListener(window, 'load', initialize);
});

$(function(){
  function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }
    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };
    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
  }
});

