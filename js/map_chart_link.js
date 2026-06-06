(function() {
    function hasReportChart() {
        return window.map && window.chart && window.elements && window.elements.length > 0;
    }

    function parseTrackPoints(elements) {
        var points = [];
        var jstOffset = 60 * 60 * 9 * 1000;

        for (var i = 0; i < elements.length; i++) {
            var trkpt = elements.item(i);
            var timeElement = trkpt.getElementsByTagName('time')[0];
            var eleElement = trkpt.getElementsByTagName('ele')[0];
            var lat = Number(trkpt.getAttribute('lat'));
            var lon = Number(trkpt.getAttribute('lon'));
            var time;

            if (!timeElement || !Number.isFinite(lat) || !Number.isFinite(lon)) {
                continue;
            }

            time = new Date(timeElement.textContent).getTime() + jstOffset;
            points.push({
                lat: lat,
                lon: lon,
                time: time,
                ele: eleElement ? Number(eleElement.textContent) : null
            });
        }

        return points;
    }

    function nearestPointByTime(points, time) {
        var left = 0;
        var right = points.length - 1;
        var mid;

        if (points.length === 0) {
            return null;
        }

        if (time <= points[0].time) {
            return points[0];
        }

        if (time >= points[right].time) {
            return points[right];
        }

        while (left <= right) {
            mid = Math.floor((left + right) / 2);

            if (points[mid].time === time) {
                return points[mid];
            }

            if (points[mid].time < time) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return Math.abs(points[left].time - time) < Math.abs(points[right].time - time)
            ? points[left]
            : points[right];
    }

    function formatHoverLabel(point) {
        var time = Highcharts.dateFormat('%H:%M:%S', point.time);
        var altitude = Number.isFinite(point.ele) ? Math.round(point.ele) + ' m' : '';

        return altitude ? time + '<br>' + altitude : time;
    }

    function installChartMapLink() {
        var chart;
        var trackPoints;
        var hoverMarker;
        var hoverStyle = {
            radius: 7,
            color: '#ffffff',
            weight: 2,
            fillColor: '#DC143C',
            fillOpacity: 0.95,
            opacity: 1
        };

        if (!hasReportChart()) {
            return;
        }

        chart = window.chart;
        trackPoints = parseTrackPoints(window.elements);

        if (!chart.series || chart.series.length === 0 || trackPoints.length === 0) {
            return;
        }

        hoverMarker = L.circleMarker([trackPoints[0].lat, trackPoints[0].lon], hoverStyle)
            .addTo(window.map)
            .bindTooltip('', {
                direction: 'top',
                offset: [0, -8],
                opacity: 0.92
            });
        hoverMarker.setStyle({
            opacity: 0,
            fillOpacity: 0
        });

        function showHoverPoint(event) {
            var normalizedEvent = chart.pointer.normalize(event);
            var chartPoint = chart.series[0].searchPoint(normalizedEvent, true);
            var trackPoint;
            var latlng;

            if (!chartPoint) {
                return;
            }

            trackPoint = nearestPointByTime(trackPoints, chartPoint.x);

            if (!trackPoint) {
                return;
            }

            latlng = [trackPoint.lat, trackPoint.lon];
            hoverMarker.setLatLng(latlng);
            hoverMarker.setStyle(hoverStyle);
            hoverMarker.setTooltipContent(formatHoverLabel(trackPoint));
            hoverMarker.openTooltip();
            hoverMarker.bringToFront();

            if (!window.map.getBounds().pad(-0.05).contains(latlng)) {
                window.map.panInside(latlng, {
                    padding: [24, 24],
                    animate: false
                });
            }
        }

        function hideHoverPoint() {
            hoverMarker.closeTooltip();
            hoverMarker.setStyle({
                opacity: 0,
                fillOpacity: 0
            });
        }

        Highcharts.addEvent(chart.container, 'mousemove', showHoverPoint);
        Highcharts.addEvent(chart.container, 'touchmove', showHoverPoint);
        Highcharts.addEvent(chart.container, 'mouseleave', hideHoverPoint);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', installChartMapLink);
    } else {
        installChartMapLink();
    }
}());
