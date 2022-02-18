var map = L.map('map_home').setView([35.023151, 135.804174], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3pldHRvIiwiYSI6ImNreHVnMTRuODVzdW4yeXFxYTgxM3dyanUifQ.lOyz4mpFDxjWo7qWeq6AYA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(map);

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
