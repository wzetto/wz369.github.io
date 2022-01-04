var osm_map = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.osm.org">OpenStreetMap</a>'
})

var google_map = new L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
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

var gpxFile = 'https://wzetto.github.io/wz369.github.io/yamanobo/baihaizi/baihaizi.gpx';
new L.GPX(gpxFile, {
  async: true,
  marker_options: {
    startIconUrl: false,
    endIconUrl: false,
    shadowUrl: false,
    //iconSize: [14, 28],
    //iconAnchor: [7, 28]
   },
  polyline_options: {
    color: '#DC143C',
    smoothFactor: 2.0,
    opacity: 0.8
  }
}).on('loaded', function(e) {
  map.fitBounds(e.target.getBounds());
}).addTo(map);

// ---------------------------------------------------
var iconStart = L.icon({
	iconUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/map_icon2.png',
	iconRetinaUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/map_icon2.png',
	iconSize: [14, 28],
    	iconAnchor: [7, 28],
	poupAnchor: [7, -10],
});
var iconEnd = L.icon({
	iconUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/map_icon3.png',
	iconRetinaUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/map_icon3.png',
	iconSize: [14, 28],
    	iconAnchor: [7, 28],
	poupAnchor: [7, -10],
});
var iconMax = L.icon({
	iconUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/7556_thin.png',
	iconRetinaUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/7556_thin.png',
	iconSize: [24, 25],
    	iconAnchor: [12, 25],
	poupAnchor: [7, -10],
});
var request = new XMLHttpRequest();
request.open('get', gpxFile, false);
request.send(null);
var gpxStr = request.responseText;
var parser = new DOMParser();
var gpx = parser.parseFromString(gpxStr, 'text/xml');
var elements = gpx.getElementsByTagName('trkpt');
var elementsAlt = gpx.getElementsByTagName('ele').innerText;
var startPoint = elements.item(0);
var endPoint = elements.item(elements.length-1);
var maxIndex = indexOfMax(elementsAlt);
var maxPoint = elements.item(maxIndex);
// ---------------------------------------------------
var start = gpxParse(startPoint);
posStr1 = '<span class="panel"><strong>StartPoint</strong><br>'
	+ start['dateStr'] + ' ' + start['timeStr'] + '<br>'
	+ 'La:' + start['lat'] + '<br>'
	+ 'Lo:' + start['lon'] + '<br>'
	+ 'Alt:' + start['ele'] + ' m</span>';
L.marker([start['lat'] , start['lon'] ], {icon: iconStart}).addTo(map).bindPopup(posStr1);
// ---------------------------------------------------
var end = gpxParse(endPoint);
posStr2 = '<span class="panel"><strong>EndPoint</strong><br>'
	+ end['dateStr'] + ' ' + end['timeStr'] + '<br>'
	+ 'La:' + end['lat'] + '<br>'
	+ 'Lo：' + end['lon'] + '<br>'
	+ 'Alt：' + end['ele'] + ' m</span>';
L.marker([end['lat'] , end['lon'] ], {icon: iconEnd}).addTo(map).bindPopup(posStr2);
// ---------------------------------------------------
var max = gpxParse(maxPoint);
posStr3 = '<span class="panel"><strong>HighestPoint</strong><br>'
	+ max['dateStr'] + ' ' + max['timeStr'] + '<br>'
	+ 'La:' + max['lat'] + '<br>'
	+ 'Lo：' + max['lon'] + '<br>'
	+ 'Alt：' + max['ele'] + ' m</span>';
L.marker([max['lat'] , max['lon'] ], {icon: iconMax}).addTo(map).bindPopup(posStr3);
// ---------------------------------------------------
function gpxParse(trkpt) {
	var timeTxt = trkpt.getElementsByTagName('time')[0].textContent;
	var time = new Date(timeTxt);
	return {
		lat: parseFloat(trkpt.getAttribute('lat')),
		lon: parseFloat(trkpt.getAttribute('lon')),
		time: time,
		dateStr: time.toLocaleDateString(),
		timeStr: time.toLocaleTimeString(),
		ele: trkpt.getElementsByTagName('ele')[0].textContent
	};
}

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}
