/**
* @file Map function.
* @author Donald Shen <donald930224@hotmail.com>
*/

function mapEngine() {
    'use strict';

    var map;

    initMap();


    function initMap() {
        var guangzhou = {lat: 23.12911, lng: 113.264385};
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
            center: guangzhou,
            zoom: 13,
        });
    }
}
