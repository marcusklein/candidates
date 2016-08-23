'use strict';

var Twitter = require('twitter');
var NodeGeocoder = require('node-geocoder');
var sentiment = require('sentiment');

 
var client = new Twitter({
  consumer_key: 'SfK5F3tXZOrkSay283ohtUyHg',
  consumer_secret: '60Ad8SaKVwSUtHJWRvVIZjvcuqIee2T6FC9lWwdvpZDBjRAzQE',
  access_token_key: '548836327-GuTO3cV32VrndSCKiQ1gcYhyfSME6jASzb1fMDMW',
  access_token_secret: 'uHmDMosGx2kqUM5vwah80WHwVyemGTXmcr7ZDfmryZmca'
});
 
var streamTrump = client.stream('statuses/filter', {track: 'trump'});
var streamHillary = client.stream('statuses/filter', {track: 'hillary'});


var options = {
  provider: 'teleport',
};
var geocoder = NodeGeocoder(options);

var openStream = function(socket) {
    streamTrump.on('data', function(event) {
        try {
            if(event.user.location) {
                getGeocode(event.user.location, function (geoData) {
                    getSentiment(event.text, function(sentData){
                        socket.emit('position', { candidate: 'trump', geo: geoData, sentiment: sentData });
                    });
                });
            }
        } catch(e) {
            console.log("stream shat itself");
        }
    });

    streamHillary.on('data', function(event) {
        try {
            if(event.user.location) {
                getGeocode(event.user.location, function (geoData) {
                    getSentiment(event.text, function(sentData){
                        socket.emit('position', { candidate: 'hillary', geo: geoData, sentiment: sentData });
                    });
                });
            }
        } catch(e) {
            console.log("stream shat itself");
        }
    });
}

function getGeocode(location, callback) {
    geocoder.geocode(location)
    .then(function(res) {
        if(res.length) {
            if(res[0].latitude && res[0].longitude) {
                callback({ lat: res[0].latitude, long: res[0].longitude })
            }
        }
    })
    .catch(function(err) {
        console.error(err);
    });
}

function getSentiment(text, callback) {
    var sent = sentiment(text);
    var score, tone, color;

    if (sent.score < 0) {
        tone = '-';
        score = (sent.score * -1) / 10;
        color = 'red';
    } else if(sent.score > 0) {
        tone = '+';
        score = (sent.score) / 10;
        color = 'blue';
    } else {
        tone = '=';
        score = 0;
        color = 'blue';
    }

    callback({
        tone: tone,
        score: score,
        color: color
    });
}


var closeStream = function() {
    stream.destroy();
}

module.exports = {
    openStream: openStream,
    closeStream: closeStream
}