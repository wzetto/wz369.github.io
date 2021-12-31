var map = L.map('map_home').setView([35.023151, 135.804174], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3pldHRvIiwiYSI6ImNreHVnMTRuODVzdW4yeXFxYTgxM3dyanUifQ.lOyz4mpFDxjWo7qWeq6AYA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(map);

var marker = L.marker([35.062114, 135.831544]).addTo(map)
    .bindPopup('<b>比叡山</b>').openPopup();

var marker = L.marker([35.209292, 135.885878]).addTo(map)
    .bindPopup('<b>蓬莱山</b>').openPopup();

var marker = L.marker([35.264317, 135.896851]).addTo(map)
    .bindPopup('<b>武奈ヶ岳</b>').openPopup();

var marker = L.marker([35.417734, 136.406034]).addTo(map)
    .bindPopup('<b>伊吹山</b>').openPopup();

var marker = L.marker([35.280031, 136.376108]).addTo(map)
    .bindPopup('<b>霊仙山</b>').openPopup();

var marker = L.marker([35.933867, 136.600140]).addTo(map)
    .bindPopup('<b>荒島岳</b>').openPopup();

var marker = L.marker([31.180128, 130.527583]).addTo(map)
    .bindPopup('<b>開聞岳</b>').openPopup();

var marker = L.marker([33.852553, 134.093431]).addTo(map)
    .bindPopup('<b>剣山</b>').openPopup();

var marker = L.marker([33.839181, 133.986579]).addTo(map)
    .bindPopup('<b>三嶺</b>').openPopup();

var marker = L.marker([35.019621, 135.811883]).addTo(map)
    .bindPopup('<b>大文字山</b>').openPopup();



