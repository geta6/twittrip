(function () {
  var map;
  var mapOptions;
  var geocoder;
  var geocoder2;
  var geocoder3;
  var geocoder4;
  var geocoder5;
  var currentInfo;
  var currentMarker;
  var currentLat;
  var currentLon;
  var landingLat;
  var landingLon;
  var heading;
  var interval;
  var instanceOfInterval;
  var threw = false;
  var currentIcon = '../images/transparent.png';
  var infoimage = [];
  var flag = "../images/beachflag.png";
  var testPos;
  var testMarker;
  var pow;
  var debug = $('#debug');
  var gotGeo = false;

  var GetPoints = function (lat, lon, pow, deg, div) {
    div = div || 5;
    var points = [];
    $.ajax({
      url: '/throw',
      data: {lat:lat, lon:lon, pow:pow, deg:deg, div:div},
      type: 'GET',
      async: false,
      dataType: 'json',
      error: function (e) {
        alert('Something Error on GetPoints()');
      },
      success: function (data) {
        points = data;
      }
    });
    return points;
  }

  var GeoDecoder = function (lat, lon, lev) {
    lev = lev || 5;
    var res = {}
    $.ajax({
      url: '/geo',
      data: {lat: lat, lon: lon, lev: lev},
      type: 'GET',
      async: false,
      dataType: 'text',
      error: function (e) {
        alert('Something Error on GeoDecoder()');
      },
      success: function (data) {
        res = data
      }
    });
    return res;
    // res.address -> address
    // res.photo   -> [photo]
  }

  $(function () {
    var str  = $('#string')
    , map_canvas  = $('#map_canvas');
    var max = 0;
    var direction;
    var floatDistance;
    var movedDegree;
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

    window.addEventListener('devicemotion', function (e) {
      if(threw == false){//throw only once
        // var tempLat = new Array(4);
        // var tempLon = new Array(4);
        infoPos = [];
        marker = [];
        infoWin = [];
        geoInfo = [];
        var g = Math.abs(e.accelerationIncludingGravity.x) + Math.abs(e.accelerationIncludingGravity.y) + Math.abs(e.accelerationIncludingGravity.z);
        //console.log(g);
        if (28 < g) {
          max = (g > max) ? g : max;//適当に*10して単位はkm
       } else if (max != 0) {
          alert(max);
          floatDistance = Math.ceil(max*100); // tune up the parameter
          //alert(floatDistance +'kmほど漂いました');
          threw = true;
          pow = max*100;
          max = 0;
        }
        // movedDegree = floatDistance / 111;
        // //set landing pos
        // landingLat = Math.ceil(((currentLat + movedDegree) + movedDegree * Math.cos(heading * Math.PI/180))*100)/100;
        // landingLon = Math.ceil((currentLon + movedDegree * Math.sin(heading * Math.PI/180))*100)/100;
        // //add marker
        if(threw){
          var data = GetPoints(currentLat,currentLon,pow,heading);

          //add route to landing Pos
          // interval = Math.ceil((movedDegree / 5)*100)/100;
          // for(i=1;i<4;i++){
          //   //liner function for the route
          //   tempLat[0]=currentLat;
          //   tempLon[0]=currentLon;
          //   tempLat[4]=landingLat;
          //   tempLon[4]=landingLon;
          //   tempLat[i] = Math.ceil((tempLat[i-1]+interval)*100)/100;
          //   tempLon[i] = (Math.ceil((((currentLon - landingLon)/(currentLat - landingLat)) * ((currentLat + interval)-currentLat)+currentLon)*100)/100)+Math.ceil(Math.random()*100)/100;
          // }

          //post to flickr
          //need to post
          floatingLocations = [
            ['1',data[0].lat,data[0].lon,1],
            ['2',data[1].lat,data[1].lon,2],
            ['3',data[2].lat,data[2].lon,3],
            ['4',data[3].lat,data[3].lon,4],
            ['5',data[4].lat,data[4].lon,5]
          ];
          for(i=0;i<5;i++){
            var location = floatingLocations[i];
            // alert(data[i].lon);
            infoPos[i] = new google.maps.LatLng(data[i].lat,data[i].lon);
            marker[i] = new google.maps.Marker({
              position: infoPos[i],
              title: "tweet from twitTrip",
              animation: google.maps.Animation.DROP,
              icon: flag,
              map: map
            });
            // infoWin[i] = new google.maps.InfoWindow();
            // geoInfo[i] = new google.maps.Geocoder();
          }
          var flightCoordinates = [
            infoPos[0],
            infoPos[1],
            infoPos[2],
            infoPos[3],
            infoPos[4]
          ];
          var flightPath = new google.maps.Polyline({
            path: flightCoordinates,
            strokeColor: "#6666FF",
            strokeOpacity: 1.0,
            strokeWeight: 2
          });

          flightPath.setMap(map);
            // testPos = new google.maps.LatLng(35,135);
            // testMarker = new google.maps.Marker({
            //   position: testPos,
            //   title: "tweet from twitTrip",
            //   animation: google.maps.Animation.DROP,
            //   map: map
            // });

          var infoWindow2 = new google.maps.InfoWindow();
          var infoWindow3 = new google.maps.InfoWindow();
          var infoWindow4 = new google.maps.InfoWindow();
          var infoWindow5 = new google.maps.InfoWindow();

          geocoder2 = new google.maps.Geocoder();
          geocoder3 = new google.maps.Geocoder();
          geocoder4 = new google.maps.Geocoder();
          geocoder5 = new google.maps.Geocoder();

          for(i=0;i<5;i++){
            geoInfo[i] = GeoDecoder(data[i].lat, data[i].lon);
            // alert(geoInfo[i]);
            gotGeo = true;
            // debug.html(debug.html + " : " + geoInfo[i]);
          }
          if(gotGeo){
            infoWindow2.setContent(String(geoInfo[1]));
            infoWindow3.setContent(String(geoInfo[2]));
            infoWindow4.setContent(String(geoInfo[3]));
            infoWindow5.setContent(String(geoInfo[4]));
          }

          // geocoder2.geocode({'latLng': infoPos[1]}, function(results, status) {
          //   if (status == google.maps.GeocoderStatus.OK) {
          //     if (results[6]) {
          //       var contentStr = '<p>' +results[6].formatted_address + '<img src="../images/5.jpg" /></p>';
          //       infoWindow2.setContent('2' + results[6].formatted_address);
          //       //infoWindow2.open(map, marker[1]);
          //     }else{
          //       infoWindow2.setContent("On the sea");
          //       //infoWindow2.open(map, marker[1]);
          //     }
          //   }
          // });
          // geocoder3.geocode({'latLng': infoPos[2]}, function(results, status) {
          //   if (status == google.maps.GeocoderStatus.OK) {
          //     if (results[6]) {
          //       infoWindow3.setContent('3' + results[6].formatted_address);
          //       //infoWindow3.open(map, marker[2]);
          //     }else{
          //       infoWindow3.setContent("On the sea");
          //       //infoWindow3.open(map, marker[2]);
          //     }
          //   }
          // });
          // geocoder4.geocode({'latLng': infoPos[3]}, function(results, status) {
          //   if (status == google.maps.GeocoderStatus.OK) {
          //     if (results[6]) {
          //       infoWindow4.setContent('4' + results[6].formatted_address);
          //       //infoWindow4.open(map, marker[3]);
          //     }else{
          //       infoWindow4.setContent("On the sea");
          //       //infoWindow4.open(map, marker[3]);
          //     }
          //   }
          // });
          // geocoder5.geocode({'latLng': infoPos[4]}, function(results, status) {
          //   if (status == google.maps.GeocoderStatus.OK) {
          //     if (results[6]) {
          //       map.setZoom(4);
          //       infoWindow5.setContent('5' +  results[6].formatted_address);
          //       //infoWindow5.open(map, marker[4]);
          //     }else{
          //       infoWindow5.setContent("On the sea");
          //       //infoWindow5.open(map, marker[4]);
          //     }
          //   }
          // });

          //clickable
          google.maps.event.addListener(marker[0], 'click', function() {
            currentMarker.open(map, marker[0]);
          });
          google.maps.event.addListener(marker[1], 'click', function() {
            infoWindow2.open(map, marker[1]);
          });
          google.maps.event.addListener(marker[2], 'click', function() {
            infoWindow3.open(map, marker[2]);
          });
          google.maps.event.addListener(marker[3], 'click', function() {
            infoWindow4.open(map, marker[3]);
          });
          google.maps.event.addListener(marker[4], 'click', function() {
            infoWindow5.open(map, marker[4]);
          });
          // after throw, stop rotate
          map_canvas.css({'-webkit-transform': 'rotate(' + (-1 * 0) + 'deg)'});
        }
     }
    }, false);

    //set map
    function initialize() {
      mapOptions = {
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false
      };
      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

      if(navigator.geolocation) {
        instanceOfInterval = setInterval(function () {
          if (threw) {
            clearInterval(instanceOfInterval);
            $('#direction, #location').fadeOut(240);
          }
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);
          });
        }, 500);

        geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition(function(position) {

          //need to post
          var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          currentMarker = new google.maps.Marker({
            map: map,
            position: pos,
            icon:currentIcon,
            animation: google.maps.Animation.DROP
          });
          currentMarker.setMap(map);
          currentInfo = new google.maps.InfoWindow();
          geocoder.geocode({'latLng': pos}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[6]) {
                currentInfo.setContent(results[6].formatted_address);
              }
            }
            // add clickable marker
            google.maps.event.addListener(currentMarker, 'click', function() {
              currentInfo.open(map, currentMarker);
            });

            //simulate click
            var locIcon = document.getElementById("location");
            google.maps.event.addDomListener(locIcon, "click", function(){
              google.maps.event.trigger(currentMarker, "click");
            });

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
}());
