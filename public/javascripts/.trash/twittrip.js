
  $(function() {
    var addMarker, center, googlemaps, info, map, onDeviceAcceleration, onDeviceRotation, point, stack, stat;
    map = $('#map_canvas');
    stack = [];
    stat = {
      threw: false,
      power: 0,
      heads: 0
    };
    point = {
      lat: 0,
      lon: 0,
      acc: 12700
    };
    googlemaps = new google.maps.Map(map[0], {
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var center, info, lat, lon;
        point.lat = pos.coords.latitude;
        point.lon = pos.coords.longitude;
        point.acc = pos.coords.accuracy;
        center = new google.maps.LatLng(point.lat, point.lon);
        info = new google.maps.InfoWindow({
          map: googlemaps,
          position: center,
          content: "[" + point.lat + ", " + point.lon + "]"
        });
        lat = ~~(pos.coords.latitude * 100) / 100;
        lon = ~~(pos.coords.longitude * 100) / 100;
        googlemaps.setCenter(center);
        return alert("Current pos:" + lat + ", " + lon);
      });
    } else {
      center = new google.maps.LatLng(60, 105);
      info = new google.maps.InfoWindow({
        map: googlemaps,
        position: center,
        content: "Error: Your browser doesn't support location."
      });
      map.setCenter(center);
    }
    addMarker = function(lat, lon) {
      var marker;
      marker = new gogole.maps.marker({
        position: new google.maps.LatLng(lat, lon),
        title: "TwitTrip",
        animation: google.maps.Animation.DROP,
        icon: '/images/beachflag.png'
      });
      return marker.setMap(googlemaps);
    };
    onDeviceRotation = function(compass, accuracy) {
      stat.heads = compass;
      return map.css({
        '-webkit-transform': "rotate(" + (-1 * compass) + "deg)"
      });
    };
    onDeviceAcceleration = function(acceleration) {
      var degree, distance, i, interval, lat, lon, pos, _i, _len, _ref;
      acceleration = Math.abs(acceleration.x + acceleration.y + acceleration.z);
      switch (true) {
        case 20 < acceleration:
          return stat.power = (_ref = acceleration > stat.power) != null ? _ref : {
            acceleration: stat.power
          };
        case stat.power !== 0:
          stat.threw = true;
          distance = ~~(stat.power * 100) / 10;
          degree = distance / 111;
          interval = ~~((degree / 5) * 100) / 100;
          lat = ~~(((point.lat + degree) + degree * Math.cos(stat.heads * Math.PI / 180)) * 100) / 100;
          lon = ~~((point.lon + degree * Math.sin(stat.heads * Math.PI / 180)) * 100) / 100;
          console.log("Landing: moved to [" + lat + ", " + lon + "], " + degree + " degree");
          stack.push({
            lat: point.lat,
            lon: point.lon
          });
          for (i = 1; i <= 2; i++) {
            stack.push({
              lat: ~~((stack[i - 1] + interval) * 100) / 100,
              lon: (~~((((point.lon - lon) / (point.lat - lat)) * ((point.lat + interval) - point.lat) + lon) * 100) / 100) + ~~(Math.random() * 100) / 100
            });
          }
          stack.push({
            lat: lat,
            lon: lon
          });
          for (_i = 0, _len = stack.length; _i < _len; _i++) {
            pos = stack[_i];
            addMarker(stack[pos].lat, stack[pos].lon);
          }
          map.css({
            '-webkit-transform': "rotate(" + (-1 * compass) + "deg)"
          });
          return stat.power = 0;
      }
    };
    window.addEventListener('deviceorientation', function(e) {
      return onDeviceRotation(e.webkitCompassHeading, e.webkitCompassAccuracy);
    }, false);
    return window.addEventListener('devicemotion', function(e) {
      return onDeviceAcceleration(e.accelerationIncludingGravity);
    }, false);
  });
