var map;
var mapOptions;
var geocoder;

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
    var c = e.webkitCompassHeading
      , a = e.webkitCompassAccuracy;
      //console.log(e.webkitCompassHeading);
    if(threw == false){
      map_canvas.css({'-webkit-transform': 'rotate(' + (-1 * c) + 'deg)'});
      heading = c;
    }
  }, false);


  window.addEventListener('devicemotion', function (e) {
    if(threw == false){//throw only once
      var tempLat = new Array(4);
      var tempLon = new Array(4);
      infoWindow = [new google.maps.InfoWindow({})]
      infoPos = [];
      marker = [];
      for(var i=0;i<5;i++){
        infoWindow[i]= new google.maps.InfoWindow();
      }

      var g = Math.abs(e.accelerationIncludingGravity.x) + Math.abs(e.accelerationIncludingGravity.y) + Math.abs(e.accelerationIncludingGravity.z);
      if (20 < g) {
        max = (g > max) ? g : max;//適当に*10して単位はkm
      } else if (max != 0) {
        floatDistance = Math.ceil(max*10); // tune up the parameter
        //alert(floatDistance +'kmほど漂いました');
        threw = true;
        max = 0;
      }

      movedDegree = floatDistance / 111;
      //set landing pos
      landingLat = Math.ceil(((currentLat + movedDegree) + movedDegree * Math.cos(heading * Math.PI/180))*100)/100;
      landingLon = Math.ceil((currentLon + movedDegree * Math.sin(heading * Math.PI/180))*100)/100;
      // console.log("landing Pos:" + landingLat + ", " + landingLon);
      console.log("moved" + movedDegree);
      console.log("landing Pos:" + landingLat + ", " + landingLon);


      //add marker
      if(threw){
        //add route to landing Pos
        interval = Math.ceil((movedDegree / 5)*100)/100;


        for(i=1;i<4;i++){
          //liner function for the route
          tempLat[0]=currentLat;
          tempLon[0]=currentLon;
          tempLat[4]=landingLat;
          tempLon[4]=landingLon;
          tempLat[i] = Math.ceil((tempLat[i-1]+interval)*100)/100;
          tempLon[i] = (Math.ceil((((currentLon - landingLon)/(currentLat - landingLat)) * ((currentLat + interval)-currentLat)+currentLon)*100)/100)+Math.ceil(Math.random()*100)/100;
        }
         //alert(tempLon[3]);

        //post to flickr
        floatingLocations = [
          ['current',tempLat[0],tempLon[0],1],
          ['2',tempLat[1],tempLon[1],2],
          ['3',tempLat[2],tempLon[2],3],
          ['4',tempLat[3],tempLon[3],4],
          ['landing',landingLat,landingLon,5]
        ];

        for(i=0;i<floatingLocations.length;i++){
          var location = floatingLocations[i];
          infoPos[i] = new google.maps.LatLng(tempLat[i],tempLon[i]);
          marker = new google.maps.Marker({
            position: infoPos[i],
            title: "twitTrip",
            animation: google.maps.Animation.DROP,
            icon: flag
          });
          marker.setMap(map);
          alert(infoPos[i]);
          alert(results[3].formatted_address);

          geocoder.geocode({'latLng': infoPos[i]}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[3]) {
              map.setZoom(3);
              infoWindow[i].setContent(results[3].formatted_address);
              infoWindow[i].open(map, marker);
            }
          } else {
            alert("Geocoder failed due to: " + status);
          }
        });
        }
        // after throw, stop rotate
        map_canvas.css({'-webkit-transform': 'rotate(' + (-1 * 0) + 'deg)'});
      }
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

