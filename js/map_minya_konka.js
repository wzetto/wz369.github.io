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

var gpxFile = 'https://wzetto.github.io/wz369.github.io/yamanobo/minya_konka/2020_minya_konka.gpx';
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
var elementsAlt = gpx.getElementsByTagName('ele');
var arrEle = [];
for (i=0; elementsAlt.length>i; i++){
	arrEle.push(elementsAlt[i].textContent);
}
var startPoint = elements.item(0);
var endPoint = elements.item(elements.length-1);
var maxIndex = indexOfMax(arrEle);
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

function distance(lat1, lon1, lat2, lon2, mode=true) {
	// la-lo trans
	radLat1 = lat1 * (Math.PI / 180);
	radLon1 = lon1 * (Math.PI / 180);
	radLat2 = lat2 * (Math.PI / 180);
	radLon2 = lon2 * (Math.PI / 180);
	
	radLatDiff = radLat1 - radLat2;
	radLonDiff = radLon1 - radLon2;
	radLatAve = (radLat1 + radLat2) / 2.0;
	
	a = mode ? 6378137.0 : 6377397.155; // Equatorial radius
	b = mode ? 6356752.314140356 : 6356078.963; // Polar radius
	e2 = mode ? 0.00669438002301188 : 0.00667436061028297; // First eccentricity^2
	a1e2 = mode ? 6335439.32708317 : 6334832.10663254; // Radius of curvature of the meridian on the equator
	sinLat = Math.sin(radLatAve);
	W2 = 1.0 - e2 * (sinLat*sinLat);
	M = a1e2 / (Math.sqrt(W2)*W2); // Meridian radius of curvature M
	N = a / Math.sqrt(W2); // Prime vertical radius of curvature
	t1 = M * radLatDiff;
	t2 = N * Math.cos(radLatAve) * radLonDiff;
	dist = Math.sqrt((t1*t1) + (t2*t2));
	return dist;
}

function time2str(time) {
	var timeHour = time / (1000 * 60 * 60);
	var timeMinute = (timeHour - Math.floor(timeHour)) * 60;
	var timeSecond = (timeMinute - Math.floor(timeMinute)) * 60;
	return ('00' + Math.floor(timeHour)).slice(-2) + ':' + ('00' + Math.floor(timeMinute)).slice(-2) + ':' + ('00' + Math.round(timeSecond)).slice(-2);
}

//================================================

var distTotal = 0;
var before = {};
var height_max = -10000;
var height_min = 10000;
var diffTime = time2str(end['time'].getTime() - start['time'].getTime());
var chartEle = [];

for (var i=0; i<(elements.length); i++) {
	let pos = gpxParse(elements.item(i));
	if (i > 0) {
		let before = gpxParse(elements.item(i-1));
		distTotal += distance(before['lat'], before['lon'], pos['lat'], pos['lon'], false);
	}
	height = parseFloat(pos['ele']);
	if (height_max < height) height_max = height;
	if (height_min > height) height_min = height;
	chartEle[i] = [pos['time'].getTime() + 60*60*9*1000, parseInt(height)];	// 日本時間
}
var distTotalKm = Math.round(distTotal/1000 * 1000) / 1000;
var subtitle = start['timeStr'] + '～' + end['timeStr'] + '　t:' + diffTime
	+ '　d:' + distTotalKm + 'km　Top:' + Math.round(height_max) + 'm　Bot:' + Math.round(height_min) + 'm';

chartView(chartEle, subtitle);

function chartView(chartEle, subtitle) {
chart = new Highcharts.Chart({
	chart: {
		renderTo: 'chart',
		zoomType: 'xy'
	},
	title: {
		text: 'Altitude - T Plot',
		style: {
			fontWeight: 'bold'
		}
	},
	subtitle: {
		text: subtitle
	},
	xAxis: {
		type: 'datetime'
	},
	yAxis: [{ // Primary yAxis
		title: {
			text: 'Altitude',
			style: {
				color: '#212121'
			}
		},
		labels: {
			formatter: function() {
				return Math.round((this.value)/1000) +'km';
			},
			style: {
				color: '#212121'
			}
		}
	}],
	tooltip: {
		formatter: function() {
			var dt = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
			var unit = {
				'Alt': 'm'
			}[this.series.name];
			return '<b>' + dt +'</b><br><b>'+ this.y + '</b> ' + unit;
		}
	},
	legend: {
		layout: 'vertical',
		align: 'left',
		verticalAlign: 'top',
		floating: true,
		backgroundColor: '#FFFFFF'
	},
	plotOptions: {
		area: {
			fillColor: {
				linearGradient: {x1:0, y1:0, x2:0, y2:1},
				stops: [
					[0, '#c74c5a'],
					[0.5, 'rgba(255, 255, 255, 0)']
				]
			},
			lineWidth: 1,
			marker: {
				enabled: false,
				states: {
					hover: {
						enabled: true,
						radius: 4
					}
				}
			},
			shadow: false,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null
		},
		spline: {
			lineWidth: 12,
			marker: {
				enabled: false,
			}
		}
	},
	series: [{
		name: 'Alt',
		color: '#9e0517',
		type: 'area',
		data: chartEle
	}]
});
}
