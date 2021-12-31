var map = L.map('map');
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
}).addTo(map);

var gpx = 'https://wzetto.github.io/wz369.github.io/yamanobo/ibuki/210206_ibuki.gpx';
new L.GPX(gpx, {async: true}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
}).addTo(map);
