var mapTrump;
var mapHillary;
var markers;
var bounds;
var iconSet;
var myoverlay;

var mapStyle = [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#b9bec8"},{"visibility":"on"}]}];

function initMap() {
    mapTrump = new google.maps.Map(document.getElementById('mapTrump'), {
        center: {lat: 41.850033, lng: -95.6500523},
        zoom: 4,
        styles: mapStyle
    });

    mapHillary = new google.maps.Map(document.getElementById('mapHillary'), {
        center: {lat: 41.850033, lng: -95.6500523},
        zoom: 4,
        styles: mapStyle
    });

    markers = [];
    bounds = new google.maps.LatLngBounds();
    myoverlay = new google.maps.OverlayView();
    myoverlay.draw = function () {
        this.getPanes().markerLayer.id='markerLayer';
    };
    myoverlay.setMap(map);
}

(function(){
    if (document.querySelectorAll('#mapTrump').length > 0){
        if (document.querySelector('html').lang)
            lang = document.querySelector('html').lang;
        else
            lang = 'en';

        var js_file = document.createElement('script');
        js_file.type = 'text/javascript';
        js_file.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&key=AIzaSyBB1GouO2xUF7nJnxiN9yZB0CRS3ABtKCI&language=' + lang;
        document.getElementsByTagName('body')[0].appendChild(js_file);
    }

    var socket = io.connect('http://localhost:3000');

    socket.on('position', function (data) {
        console.log(data);
        if (data.candidate === 'trump') {
            addMarker(data, mapTrump);
        } else if(data.candidate === 'hillary') {
            addMarker(data, mapHillary);
        }
    });


    function addMarker(tweet, candidateMap) {
        var position = new google.maps.LatLng(tweet.geo.lat, tweet.geo.long);

        markers.push(
            new google.maps.Marker({
            position: position,
            map: candidateMap,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                strokeOpacity: 0,
                fillOpacity: tweet.sentiment.score,
                fillColor: tweet.sentiment.color
            }
            })
        );

        bounds.extend(position);
    }



})();
