(function() {
    var map = window.map;
    var mapElement;
    var mapShell;
    var map3dElement;
    var mapStatus;
    var modeButtons;
    var fullscreenButton;
    var fallbackActive = false;
    var map3d;
    var map3dPromise;
    var hoverPopup;
    var mapMode = '2d';
    var mapLibreVersion = '6.6.0';
    var emptyFeatureCollection = {
        type: 'FeatureCollection',
        features: []
    };

    if (!map || !map.getContainer || !window.L) {
        return;
    }

    mapElement = map.getContainer();
    mapShell = document.getElementById('map_shell') || mapElement;
    map3dElement = document.getElementById('map_3d');
    mapStatus = document.getElementById('map_status');
    modeButtons = document.querySelectorAll('[data-map-mode]');
    fullscreenButton = document.getElementById('map_fullscreen_button');

    function resizeMap() {
        window.requestAnimationFrame(function() {
            map.invalidateSize();

            if (map3d) {
                map3d.resize();
            }
        });
    }

    function syncFullscreenButton() {
        var active = fallbackActive;
        var label = active ? 'Exit fullscreen' : 'Enter fullscreen';

        if (fullscreenButton) {
            fullscreenButton.title = label;
            fullscreenButton.setAttribute('aria-label', label);
            fullscreenButton.setAttribute('aria-pressed', active ? 'true' : 'false');
        }

        resizeMap();
    }

    function enterFallbackFullscreen() {
        fallbackActive = true;
        mapShell.classList.add('map--fullscreen-fallback');
        document.documentElement.classList.add('map-fullscreen-fallback-active');
        syncFullscreenButton();
    }

    function exitFallbackFullscreen() {
        fallbackActive = false;
        mapShell.classList.remove('map--fullscreen-fallback');
        document.documentElement.classList.remove('map-fullscreen-fallback-active');
        syncFullscreenButton();
    }

    function toggleFullscreen() {
        if (fallbackActive) {
            exitFallbackFullscreen();
        } else {
            enterFallbackFullscreen();
        }
    }

    function setStatus(message) {
        if (!mapStatus) {
            return;
        }

        mapStatus.textContent = message || '';
        mapStatus.hidden = !message;
    }

    function setModeButtons(mode) {
        for (var i = 0; i < modeButtons.length; i++) {
            var active = modeButtons[i].getAttribute('data-map-mode') === mode;

            modeButtons[i].classList.toggle('is-active', active);
            modeButtons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
        }
    }

    function show2dMap() {
        mapMode = '2d';
        mapElement.hidden = false;

        if (map3dElement) {
            map3dElement.hidden = true;
        }

        setStatus('');
        setModeButtons(mapMode);
        resizeMap();
    }

    function show3dMap() {
        if (!map3dElement) {
            return;
        }

        mapMode = '3d';
        mapElement.hidden = true;
        map3dElement.hidden = false;
        setModeButtons(mapMode);

        if (map3d) {
            setStatus('');
            resizeMap();
            return;
        }

        setStatus('Loading 3D terrain...');
        ensure3dMap().then(function() {
            if (mapMode === '3d') {
                setStatus('');
                resizeMap();
            }
        }).catch(function(error) {
            console.error('Unable to initialize the 3D map.', error);
            setStatus('3D terrain is unavailable.');
        });
    }

    function loadStylesheet(url) {
        return new Promise(function(resolve, reject) {
            var existing = document.querySelector('link[data-maplibre-style]');
            var link;

            if (existing) {
                resolve();
                return;
            }

            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.setAttribute('data-maplibre-style', '');
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    function loadModule(url) {
        if (window.maplibregl) {
            return Promise.resolve();
        }

        return import(url).then(function(mapLibreModule) {
            window.maplibregl = mapLibreModule;
        });
    }

    function loadMapLibre() {
        var baseUrl = 'https://cdn.jsdelivr.net/npm/maplibre-gl@' + mapLibreVersion + '/dist/';

        if (window.maplibregl) {
            return Promise.resolve();
        }

        return Promise.all([
            loadStylesheet(baseUrl + 'maplibre-gl.css'),
            loadModule(baseUrl + 'maplibre-gl.mjs')
        ]);
    }

    function parseTrackPoint(element) {
        var elevationElement = element.getElementsByTagName('ele')[0];
        var latitude = Number(element.getAttribute('lat'));
        var longitude = Number(element.getAttribute('lon'));

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return null;
        }

        return {
            lat: latitude,
            lon: longitude,
            ele: elevationElement ? Number(elevationElement.textContent) : null
        };
    }

    function parseTrackElements(elements) {
        var points = [];

        for (var i = 0; i < elements.length; i++) {
            var point = parseTrackPoint(elements.item(i));

            if (point) {
                points.push(point);
            }
        }

        return points;
    }

    function parseGpxDocument(gpxDocument) {
        var segments = gpxDocument.getElementsByTagName('trkseg');
        var tracks = [];

        if (segments.length === 0) {
            return [parseTrackElements(gpxDocument.getElementsByTagName('trkpt'))];
        }

        for (var i = 0; i < segments.length; i++) {
            var points = parseTrackElements(segments.item(i).getElementsByTagName('trkpt'));

            if (points.length > 0) {
                tracks.push(points);
            }
        }

        return tracks;
    }

    function getTrackUrls() {
        var urls = [];
        var candidates;

        if (typeof window.gpxFile === 'string') {
            candidates = [window.gpxFile];
        } else {
            candidates = [window.gpx, window.gpx2];
        }

        for (var i = 0; i < candidates.length; i++) {
            if (typeof candidates[i] === 'string' && urls.indexOf(candidates[i]) === -1) {
                urls.push(candidates[i]);
            }
        }

        return urls;
    }

    function loadTracks() {
        if (window.elements && window.elements.length > 0) {
            return Promise.resolve([parseTrackElements(window.elements)]);
        }

        return Promise.all(getTrackUrls().map(function(url) {
            return window.fetch(url).then(function(response) {
                if (!response.ok) {
                    throw new Error('Unable to load ' + url);
                }

                return response.text();
            }).then(function(gpxText) {
                var gpxDocument = new DOMParser().parseFromString(gpxText, 'text/xml');

                return parseGpxDocument(gpxDocument);
            });
        })).then(function(trackGroups) {
            var tracks = [];

            for (var i = 0; i < trackGroups.length; i++) {
                tracks = tracks.concat(trackGroups[i]);
            }

            return tracks;
        });
    }

    function createLineData(tracks) {
        return {
            type: 'FeatureCollection',
            features: tracks.filter(function(points) {
                return points.length > 1;
            }).map(function(points) {
                return {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: points.map(function(point) {
                            return [point.lon, point.lat];
                        })
                    }
                };
            })
        };
    }

    function createMarkerData(tracks) {
        var features = [];
        var highestPoint = null;

        tracks.forEach(function(points) {
            if (points.length === 0) {
                return;
            }

            features.push(createPointFeature(points[0], 'start'));
            features.push(createPointFeature(points[points.length - 1], 'end'));

            points.forEach(function(point) {
                if (Number.isFinite(point.ele) && (!highestPoint || point.ele > highestPoint.ele)) {
                    highestPoint = point;
                }
            });
        });

        if (highestPoint) {
            features.push(createPointFeature(highestPoint, 'highest'));
        }

        return {
            type: 'FeatureCollection',
            features: features
        };
    }

    function createPointFeature(point, kind) {
        return {
            type: 'Feature',
            properties: {
                kind: kind
            },
            geometry: {
                type: 'Point',
                coordinates: [point.lon, point.lat]
            }
        };
    }

    function createTerrainStyle() {
        return {
            version: 8,
            sources: {
                satellite: {
                    type: 'raster',
                    tiles: [
                        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                    ],
                    tileSize: 256,
                    maxzoom: 18,
                    attribution: 'Imagery &copy; Esri and contributors'
                },
                terrain: {
                    type: 'raster-dem',
                    tiles: [
                        'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'
                    ],
                    encoding: 'terrarium',
                    tileSize: 256,
                    maxzoom: 15,
                    attribution: 'Terrain &copy; Mapzen / AWS Open Data'
                }
            },
            layers: [
                {
                    id: 'satellite',
                    type: 'raster',
                    source: 'satellite'
                }
            ],
            terrain: {
                source: 'terrain',
                exaggeration: 1.15
            },
            sky: {}
        };
    }

    function addTrackLayers(tracks) {
        map3d.addSource('trek-lines', {
            type: 'geojson',
            data: createLineData(tracks)
        });
        map3d.addLayer({
            id: 'trek-line-shadow',
            type: 'line',
            source: 'trek-lines',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': 'rgba(0, 0, 0, 0.65)',
                'line-width': 7
            }
        });
        map3d.addLayer({
            id: 'trek-line',
            type: 'line',
            source: 'trek-lines',
            layout: {
                'line-cap': 'round',
                'line-join': 'round'
            },
            paint: {
                'line-color': '#ff304f',
                'line-width': 4
            }
        });
        map3d.addSource('trek-markers', {
            type: 'geojson',
            data: createMarkerData(tracks)
        });
        map3d.addLayer({
            id: 'trek-markers',
            type: 'circle',
            source: 'trek-markers',
            paint: {
                'circle-radius': 6,
                'circle-color': [
                    'match',
                    ['get', 'kind'],
                    'start', '#48a9ff',
                    'end', '#ff304f',
                    '#ffffff'
                ],
                'circle-stroke-color': '#111111',
                'circle-stroke-width': 2,
                'circle-pitch-alignment': 'map'
            }
        });
        map3d.addSource('trek-hover', {
            type: 'geojson',
            data: emptyFeatureCollection
        });
        map3d.addLayer({
            id: 'trek-hover',
            type: 'circle',
            source: 'trek-hover',
            paint: {
                'circle-radius': 8,
                'circle-color': '#dc143c',
                'circle-stroke-color': '#ffffff',
                'circle-stroke-width': 2,
                'circle-pitch-alignment': 'map'
            }
        });
    }

    function waitForCenterElevation(done) {
        var deadline = Date.now() + 10000;

        function checkElevation() {
            var centerElevation = map3d.queryTerrainElevation(map3d.getCenter());

            if (Number.isFinite(centerElevation)) {
                done(centerElevation);
                return;
            }

            if (Date.now() >= deadline) {
                done(null);
                return;
            }

            map3d.triggerRepaint();
            window.requestAnimationFrame(checkElevation);
        }

        checkElevation();
    }

    function fit3dMapToTracks(tracks, done) {
        var bounds = new window.maplibregl.LngLatBounds();
        var boundsCamera;
        var pointCount = 0;

        tracks.forEach(function(points) {
            points.forEach(function(point) {
                bounds.extend([point.lon, point.lat]);
                pointCount++;
            });
        });

        if (pointCount === 0) {
            done();
            return;
        }

        boundsCamera = map3d.cameraForBounds(bounds, {
            padding: 46
        });

        if (!boundsCamera) {
            done();
            return;
        }

        map3d.once('idle', function() {
            waitForCenterElevation(function(centerElevation) {
                var terrainReady = Number.isFinite(centerElevation);
                var targetPitch = tracks.length > 1 ? 45 : 55;
                var zoomMargin = tracks.length > 1 ? 0.9 : 0.45;
                var targetZoom = Math.max(map3d.getZoom() - zoomMargin, 2);

                if (!terrainReady) {
                    map3d.setTerrain(null);
                } else {
                    map3d.setCenterClampedToGround(false);
                }

                window.requestAnimationFrame(function() {
                    map3d.stop();

                    if (terrainReady) {
                        map3d.setCenterElevation(centerElevation);
                    }

                    map3d.jumpTo({
                        zoom: targetZoom,
                        pitch: terrainReady ? targetPitch : 40,
                        bearing: 0,
                        elevation: terrainReady ? centerElevation : 0
                    });

                    done();
                });
            });
        });
        map3d.jumpTo({
            center: boundsCamera.center,
            zoom: Math.min(boundsCamera.zoom, 15),
            bearing: 0,
            pitch: 0,
            elevation: 0
        });
    }

    function initialize3dMap(tracks) {
        if (tracks.length === 0) {
            throw new Error('No GPX track points are available.');
        }

        map3d = new window.maplibregl.Map({
            container: map3dElement,
            style: createTerrainStyle(),
            center: [0, 0],
            zoom: 2,
            pitch: 0,
            bearing: 0,
            maxPitch: 85,
            maxZoom: 18,
            centerClampedToGround: true,
            canvasContextAttributes: {
                antialias: true
            },
            attributionControl: true
        });
        map3d.addControl(new window.maplibregl.NavigationControl({
            visualizePitch: true,
            showCompass: true,
            showZoom: true
        }), 'top-left');

        return new Promise(function(resolve) {
            map3d.once('load', function() {
                addTrackLayers(tracks);
                fit3dMapToTracks(tracks, function() {
                    resolve(map3d);
                });
            });
        });
    }

    function ensure3dMap() {
        if (!map3dPromise) {
            map3dPromise = Promise.all([
                loadMapLibre(),
                loadTracks()
            ]).then(function(results) {
                return initialize3dMap(results[1]);
            });
        }

        return map3dPromise;
    }

    function set3dHoverPoint(point, label) {
        var source;
        var popupContent;

        if (!map3d || !point) {
            return;
        }

        source = map3d.getSource('trek-hover');

        if (!source) {
            return;
        }

        source.setData({
            type: 'FeatureCollection',
            features: [createPointFeature(point, 'hover')]
        });

        if (!hoverPopup) {
            hoverPopup = new window.maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
                offset: 12
            });
        }

        popupContent = document.createElement('span');
        popupContent.textContent = label || '';
        hoverPopup.setDOMContent(popupContent).setLngLat([point.lon, point.lat]).addTo(map3d);
    }

    function clear3dHoverPoint() {
        var source;

        if (!map3d) {
            return;
        }

        source = map3d.getSource('trek-hover');

        if (source) {
            source.setData(emptyFeatureCollection);
        }

        if (hoverPopup) {
            hoverPopup.remove();
        }
    }

    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', toggleFullscreen);
    }

    syncFullscreenButton();
    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].addEventListener('click', function() {
            if (this.getAttribute('data-map-mode') === '3d') {
                show3dMap();
            } else {
                show2dMap();
            }
        });
    }

    window.mapExperience = {
        getMode: function() {
            return mapMode;
        },
        get3dMap: function() {
            return map3d;
        },
        showHoverPoint: set3dHoverPoint,
        clearHoverPoint: clear3dHoverPoint
    };

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && fallbackActive) {
            exitFallbackFullscreen();
        }
    });
}());