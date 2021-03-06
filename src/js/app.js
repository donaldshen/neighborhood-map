'use strict';
/**
* @file Contains viewmodel and map facility.
* @author Donald Shen <donald930224@hotmail.com>
*/

/**
* Global variables.
*/
var LOCATIONS = [
    ['Statue of Liberty National Monument', 40.689249,-74.0445],
    ['Time Square', 40.758895,-73.985131],
    ['Headquarters of the United Nations', 40.748876,-73.968009],
    ['Wall Street', 40.706001,-74.008801],
    ['Chinatown, Manhattan', 40.715751,-73.997031],
    ['Central Park', 40.782865,-73.965355],
];
LOCATIONS = LOCATIONS.map(function (l) {
    return {title: l[0], latLng: {lat: l[1], lng: l[2]}};
});
var MAP;
var INFO_WINDOW;
var MARKERS = [];

/**
* Create MAP, INFO_WINDOW and MARKERS.
*/
function initMap() {
    MAP = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
    });

    INFO_WINDOW = new google.maps.InfoWindow();

    function MarkerIcon(markerColor) {
        this.url = 'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor + '|40|_|%E2%80%A2';
        this.scaledSize = new google.maps.Size(21,34);
    }
    var defaultIcon = new MarkerIcon('0091ff');
    var highlightedIcon = new MarkerIcon('FFFF24');

    LOCATIONS.forEach(function (l) {
        var marker = new google.maps.Marker({
            position: l.latLng,
            title: l.title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            map: MAP,
        });
        MARKERS.push(marker);
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        marker.addListener('click', function() {
            openInfoWindowOnMarker(marker);
        });
    });
}

/**
* Open INFO_WINDOW related to the marker.
* @param {google.maps.Marker} marker
*/
function openInfoWindowOnMarker(marker) {
    INFO_WINDOW.setContent('');
    // One bounce
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function () {
        marker.setAnimation(null);
    }, 1440);
    console.log(marker.wiki);
    // Cache wiki contents after first successfully ajax request.
    if (typeof marker.wiki === 'undefined') {
        // Request for wiki content
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&callback=wikiCallback&format=json';
        $.ajax(wikiUrl, {
            dataType: 'jsonp',
        }).done(function (response) {
            var title = response[0];
            var intro = response[2][0] || 'There is no info.';
            var link = response[3][0] || 'https://www.google.com/#q=' + title;
            var content = '<div class="infowindow"><a href="' + link +
            '" target="_blank" rel="noopener noreferrer">' + title +
            '</a><p>' + intro + '</p></div>';
            INFO_WINDOW.setContent(content);

            marker.wiki = content;
        }).fail(function (jqXHR, textStatus) {
            INFO_WINDOW.setContent('<div class="infowindow">Failed to get wikipedia resources.</div>');
        });
    } else {
        INFO_WINDOW.setContent(marker.wiki);
    }

    INFO_WINDOW.open(MAP, marker);
}

/**
* Display the markers related to locations on map.
* @param {Object[]} locations
* @param {string} locations[].title - Use to match marker.
*/
function displayMakers(locations) {
    var bounds = new google.maps.LatLngBounds();
    MARKERS.forEach(function (marker) {
        if (locations.some(function (l) {
            return l.title === marker.title;
        })) {
            marker.setVisible(true);
            bounds.extend(marker.position);
        } else {
            marker.setVisible(false);
        }
    });
    // Extend the boundaries of the map for each marker
    MAP.fitBounds(bounds);
}

/**
* Create the viewmodel of knockout.
*/
function ViewModel() {
    var self = this;
    self.inputText = ko.observable('');
    self.locations = ko.computed(function () {
        // Find common subsequence between inputText and LOCATIONS
        var input = self.inputText().toLowerCase();
        var locations = ko.utils.arrayFilter(LOCATIONS, function (l) {
            var title = l.title.toLowerCase();
            for (var i = 0; i < input.length; i++) {
                var index = title.indexOf(input[i]);
                if (index === -1) {
                    return false;
                } else {
                    title = title.slice(index);
                }
            }
            return true;
        });
        displayMakers(locations);
        return locations;
    });
    self.openInfoWindow = function (location) {
        openInfoWindowOnMarker(MARKERS.filter(function (marker) {
            return marker.title === location.title;
        })[0]);
    };
    self.showListView = ko.observable(true);
    self.toggleListView = function () {
        self.showListView(!self.showListView());
    }
}

/**
* Called back by google maps request.
*/
function init() {
    initMap();
    ko.applyBindings(new ViewModel());
}

function mapError() {
    window.alert('Failed to load google maps');
}
