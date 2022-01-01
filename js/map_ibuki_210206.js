var osm_map = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
})

var kokudo_map = new L.L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
  attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});

var map = L.map('map',{
  layers: [kokudo_map]
});

var map_baselayer = {
  'OpenStreetMap': osm_map,
  '国土地理院': kokudo_map
};

L.control.layers(map_baselayer, null, {
  collapsed: true
}).addTo(map)

var gpx = 'https://wzetto.github.io/wz369.github.io/yamanobo/ibuki/210206_ibuki.gpx';
new L.GPX(gpx, {
  async: true,
  polyline_options: {
    color: 'red',
    smoothFactor: 2.0
  }
}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
  map.fitBounds(e.target.get_distance());
  map.fitBounds(e.target.get_elevation_gain());
}).addTo(map);
