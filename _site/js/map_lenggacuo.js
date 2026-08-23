var osm_map = new L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
})

var google_map = new L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var map = L.map('map',{
  layers: [osm_map]
});

var map_baselayer = {
  'OpenStreetMap': osm_map,
  'GoogleSatellite': google_map
};

L.control.layers(map_baselayer, null, {
  collapsed: true
}).addTo(map)

var gpx = 'lenggacuo1.gpx';
new L.GPX(gpx, {
  async: true,
  polyline_options: {
    color: '#DC143C',
    smoothFactor: 2.0
  }
}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
}).addTo(map);

var gpx2 = 'lengacuo2.gpx';
new L.GPX(gpx2, {
  async: true,
  polyline_options: {
    color: '#DC143C',
    smoothFactor: 2.0
  }
}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
}).addTo(map);
