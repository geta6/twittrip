$ ->

  map   = $ '#map_canvas'
  stack = []
  stat  =
    threw : false
    power : 0
    heads : 0
  point =
    lat: 0
    lon: 0
    acc: 12700

  googlemaps = new google.maps.Map map[0],
    zoom      : 6
    mapTypeId : google.maps.MapTypeId.ROADMAP

  if navigator.geolocation
    navigator.geolocation.getCurrentPosition (pos) ->
      point.lat = pos.coords.latitude
      point.lon = pos.coords.longitude
      point.acc = pos.coords.accuracy
      center = new google.maps.LatLng point.lat, point.lon
      info = new google.maps.InfoWindow
        map      : googlemaps
        position : center
        content  : "[#{point.lat}, #{point.lon}]"
      lat = ~~(pos.coords.latitude*100)/100
      lon = ~~(pos.coords.longitude*100)/100
      googlemaps.setCenter center
      alert "Current pos:" + lat + ", " + lon
  else
    center = new google.maps.LatLng(60, 105)
    info = new google.maps.InfoWindow
      map      : googlemaps,
      position : center,
      content  : "Error: Your browser doesn't support location."
    map.setCenter center

  addMarker = (lat, lon) ->
    marker = new gogole.maps.marker
      position  : new google.maps.LatLng lat, lon
      title     : "TwitTrip"
      animation : google.maps.Animation.DROP
      icon      : '/images/beachflag.png'
    marker.setMap googlemaps

  onDeviceRotation = (compass, accuracy) ->
    stat.heads = compass
    map.css
      '-webkit-transform': "rotate(#{-1*compass}deg)"

  onDeviceAcceleration = (acceleration) ->
    acceleration = Math.abs acceleration.x + acceleration.y + acceleration.z
    switch true
      when 20 < acceleration
        stat.power = (acceleration > stat.power) ? acceleration : stat.power
      when stat.power != 0
        stat.threw = true
        distance   = ~~(stat.power * 100) / 10
        degree     = distance / 111
        interval   = ~~((degree / 5)*100)/100
        lat        = ~~(((point.lat + degree) + degree * Math.cos(stat.heads * Math.PI / 180)) * 100) / 100
        lon        = ~~((point.lon + degree * Math.sin(stat.heads * Math.PI / 180)) * 100) / 100
        console.log "Landing: moved to [#{lat}, #{lon}], #{degree} degree"

        stack.push lat: point.lat, lon: point.lon
        for i in [1..2]
          stack.push
            lat: ~~((stack[i-1] + interval) * 100) / 100
            lon: (~~((((point.lon - lon) / (point.lat - lat)) * ((point.lat + interval) - point.lat) + lon) * 100) / 100) + ~~(Math.random() * 100) / 100
        stack.push lat: lat, lon: lon

        for pos in stack
          addMarker stack[pos].lat, stack[pos].lon
        map.css
          '-webkit-transform': "rotate(#{-1*compass}deg)"
        # Finalize
        stat.power    = 0

  window.addEventListener 'deviceorientation', (e) ->
    onDeviceRotation e.webkitCompassHeading, e.webkitCompassAccuracy
  , false

  window.addEventListener 'devicemotion', (e) ->
    onDeviceAcceleration e.accelerationIncludingGravity
  , false
