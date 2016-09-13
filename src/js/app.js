/**
* @file info
* @author Donald Shen <donald930224@hotmail.com>
*/

var LOCATIONS = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
];

var MAP;
var INFO_WINDOW;
var MARKERS = [];


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
    });

    INFO_WINDOW = new google.maps.InfoWindow()

    function MarkerIcon(markerColor) {
        this.url = 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2'
        this.scaledSize = new google.maps.Size(21,34)
    }
    var defaultIcon = new MarkerIcon('0091ff')
    var highlightedIcon = new MarkerIcon('FFFF24')

    // Create a marker per location, and put into MARKERS array.
    LOCATIONS.forEach(function (l) {
        var marker = new google.maps.Marker({
            position: l.location,
            title: l.title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
        })
        MARKERS.push(marker);
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon)
        })
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon)
        })
        marker.addListener('click', function() {
            openInfoWindowOnMarker(marker)
        })
    });
}


function openInfoWindowOnMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE)
    window.setTimeout(function () {
        marker.setAnimation(null)
    }, 740);

    // Clear the infowindow content to give the streetview time to load.
    INFO_WINDOW.setContent(marker.title);
    INFO_WINDOW.open(map, marker);
}


function displayMakers(locations) {
    var bounds = new google.maps.LatLngBounds();
    MARKERS.forEach(function (marker) {
        if (locations.some(function (l) {
            return l.title === marker.title;
        })) {
            marker.setMap(map);
            bounds.extend(marker.position);
        } else {
            marker.setMap(null);
        }
    })
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}


function ViewModel() {
    var self = this;
    self.inputText = ko.observable('');
    self.locations = ko.computed(function () {
        var locations = ko.utils.arrayFilter(LOCATIONS, function (l) {
            return l.title.toLowerCase().search(self.inputText().toLowerCase()) !== -1;
        });
        displayMakers(locations);
        return locations;
    });
    self.openInfoWindow = function (location) {
        openInfoWindowOnMarker(MARKERS.filter(function (marker) {
            return marker.title === location.title;
        })[0]);
    };
}


function init() {
    initMap();
    ko.applyBindings(new ViewModel());
}
