var map = L.map('map_home').setView([35.023151, 135.804174], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

var trailFiles = [
















































































































































































































































    {
        url: "/yamanobo/baihaizi/baihaizi.gpx",
        title: "baihaizi"
    },



    {
        url: "/yamanobo/bunagatake/20210228bunagatake.gpx",
        title: "20210228bunagatake"
    },



    {
        url: "/yamanobo/bunagatake/20241215%E6%AD%A6%E5%A5%88%E3%83%B6%E5%B2%B3.gpx",
        title: "20241215武奈ヶ岳"
    },



    {
        url: "/yamanobo/fuji/20220816fuji.gpx",
        title: "20220816fuji"
    },



    {
        url: "/yamanobo/fujiwara/20221203%E8%97%A4%E5%8E%9F%E5%B2%B3.gpx",
        title: "20221203藤原岳"
    },



    {
        url: "/yamanobo/ibuki/210206_ibuki.gpx",
        title: "210206_ibuki"
    },



    {
        url: "/yamanobo/ibuki/ibuki_2501.gpx",
        title: "ibuki_2501"
    },



    {
        url: "/yamanobo/ibuki/ibuki_2601.gpx",
        title: "ibuki_2601"
    },



    {
        url: "/yamanobo/kaimon/20210322%E9%96%8B%E8%81%9E%E5%B2%B3.gpx",
        title: "20210322開聞岳"
    },



    {
        url: "/yamanobo/lenggacuo/lengacuo2.gpx",
        title: "lengacuo2"
    },



    {
        url: "/yamanobo/lenggacuo/lenggacuo1.gpx",
        title: "lenggacuo1"
    },



    {
        url: "/yamanobo/minya_konka/2020_minya_konka.gpx",
        title: "2020_minya_konka"
    },





    {
        url: "/yamanobo/minya_konka/231231_fullview.gpx",
        title: "231231_fullview"
    },



    {
        url: "/yamanobo/ryozen/20210410%E9%9C%8A%E4%BB%99%E5%B1%B1.gpx",
        title: "20210410霊仙山"
    },



    {
        url: "/yamanobo/ryozen/20220226%E9%9C%8A%E4%BB%99%E5%B1%B1.gpx",
        title: "20220226霊仙山"
    },



    {
        url: "/yamanobo/siguniang/2020_erguniang.gpx",
        title: "2020_erguniang"
    },



    {
        url: "/yamanobo/siguniang/2020_sanguniang.gpx",
        title: "2020_sanguniang"
    },



    {
        url: "/yamanobo/siguniang/2020_sanguniang_mark.gpx",
        title: "2020_sanguniang_mark"
    },



    {
        url: "/yamanobo/tiewadian/%E9%93%81%E7%93%A6%E6%AE%BF%E5%8D%95%E6%97%A5.gpx",
        title: "铁瓦殿单日"
    },



    {
        url: "/yamanobo/tsurugi-miune/20210920_tsurugi.gpx",
        title: "20210920_tsurugi"
    },



    {
        url: "/yamanobo/xiaomachang/xiaomachang.gpx",
        title: "xiaomachang"
    },



    {
        url: "/yamanobo/yala/yala.gpx",
        title: "yala"
    },



    {
        url: "/yamanobo/yamu/20230505%E9%9B%85%E5%A7%86.gpx",
        title: "20230505雅姆"
    },










];

var trailLayer = L.featureGroup().addTo(map);
var trailBounds = L.latLngBounds();

function pointFromGpxElement(point) {
    var lat = Number(point.getAttribute('lat'));
    var lon = Number(point.getAttribute('lon'));

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
    }

    return [lat, lon];
}

function collectPointSequence(parent, tagName) {
    var sequence = [];
    var points = parent.getElementsByTagName(tagName);

    for (var i = 0; i < points.length; i++) {
        var point = pointFromGpxElement(points[i]);

        if (point) {
            sequence.push(point);
        }
    }

    return sequence;
}

function addTrailPolyline(sequence, title) {
    if (sequence.length < 2) {
        return false;
    }

    var line = L.polyline(sequence, {
        color: '#DC143C',
        weight: 3,
        opacity: 0.85,
        smoothFactor: 2.0
    }).bindPopup('<b>' + title + '</b>');

    line.addTo(trailLayer);
    trailBounds.extend(line.getBounds());
    return true;
}

function drawTrailFromGpx(gpxText, title) {
    var gpx = new DOMParser().parseFromString(gpxText, 'text/xml');
    var parserError = gpx.getElementsByTagName('parsererror');
    var drewTrail = false;
    var segments;
    var routes;

    if (parserError.length > 0) {
        return false;
    }

    segments = gpx.getElementsByTagName('trkseg');
    for (var i = 0; i < segments.length; i++) {
        drewTrail = addTrailPolyline(collectPointSequence(segments[i], 'trkpt'), title) || drewTrail;
    }

    if (segments.length === 0) {
        drewTrail = addTrailPolyline(collectPointSequence(gpx, 'trkpt'), title) || drewTrail;
    }

    routes = gpx.getElementsByTagName('rte');
    for (var j = 0; j < routes.length; j++) {
        drewTrail = addTrailPolyline(collectPointSequence(routes[j], 'rtept'), title) || drewTrail;
    }

    return drewTrail;
}

function loadTrail(trail) {
    return fetch(trail.url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Could not load ' + trail.url);
            }

            return response.text();
        })
        .then(function(gpxText) {
            return drawTrailFromGpx(gpxText, trail.title);
        })
        .catch(function(error) {
            console.warn(error);
            return false;
        });
}

Promise.all(trailFiles.map(loadTrail)).then(function(results) {
    var loadedTrails = results.filter(Boolean).length;

    if (loadedTrails > 0 && trailBounds.isValid()) {
        map.fitBounds(trailBounds, {
            padding: [24, 24],
            maxZoom: 10
        });
    }
});

var marker_icon = L.icon({
    iconUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/map_icon2.png',
    iconRetinaUrl: 'https://wzetto.github.io/wz369.github.io/images/icon/map_icon2.png',
    iconSize: [14, 28],
    iconAnchor: [7, 28]
});

var marker = L.marker([35.062114, 135.831544], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>比叡山</b>').openPopup();

var marker = L.marker([35.209292, 135.885878], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>蓬莱山</b>').openPopup();

var marker = L.marker([35.264317, 135.896851], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>武奈ヶ岳</b>').openPopup();

var marker = L.marker([35.417734, 136.406034], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>伊吹山</b>').openPopup();

var marker = L.marker([35.280031, 136.376108], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>霊仙山</b>').openPopup();

var marker = L.marker([35.933867, 136.600140], {icon: marker_icon}).addTo(map)
    .bindPopup('<a href="https://wzetto.github.io/wz369.github.io/yamanobo/arashima/arashima.html" target="_blank" style="color:#002980;font-weight:bold;">荒島岳</a><br>標高：1523m<br>').openPopup();

var marker = L.marker([31.180128, 130.527583], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>開聞岳</b>').openPopup();

var marker = L.marker([33.852553, 134.093431], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>剣山</b>').openPopup();

var marker = L.marker([33.839181, 133.986579], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>三嶺</b>').openPopup();

var marker = L.marker([35.019621, 135.811883], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>大文字山</b>').openPopup();

var marker = L.marker([31.079485, 102.906316], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>三峰</b>').openPopup();

var marker = L.marker([31.069963, 102.908340], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>二峰</b>').openPopup();

var marker = L.marker([30.005885, 102.009729], {icon: marker_icon}).addTo(map)
    .bindPopup('<b>五色海子</b>').openPopup();
