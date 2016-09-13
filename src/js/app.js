/**
* @file info
* @author Donald Shen <donald930224@hotmail.com>
*/

var LOCATIONS = [
    {title: '1教育厅宿舍', location: {lat: 23.135018, lng: 113.298225}},
    {title: '1盈彩美居', location: {lat: 23.113651, lng: 113.418201}},
    {title: '2太古汇', location: {lat: 23.133955, lng: 113.331465}},
    {title: '2正佳广场', location: {lat: 23.132171, lng: 113.3269843}},
    {title: '3优衣库', location: {lat: 23.134897, lng: 113.321216}},
];

var MAP;
var INFO_WINDOW;
var MARKERS = [];


function initMap() {
    var guangzhou = {lat: 23.12911, lng: 113.264385};
    map = new google.maps.Map(document.getElementById('map'), {
        center: guangzhou,
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
            // Clear the infowindow content to give the streetview time to load.
            INFO_WINDOW.setContent('hi');

            INFO_WINDOW.open(map, marker)
            marker.setAnimation(google.maps.Animation.BOUNCE)
            window.setTimeout(function () {
                marker.setAnimation(null)
            }, 730);
        })
    });
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
    self.inputText = ko.observable();
    self.locations = ko.computed(function () {
        var locations = ko.utils.arrayFilter(LOCATIONS, function (l) {
            return l.title.search(self.inputText()) !== -1;
        });
        displayMakers(locations);
        return locations;
    });
}


function init() {
    initMap();
    ko.applyBindings(new ViewModel());
}
