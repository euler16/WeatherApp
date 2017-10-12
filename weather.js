var marker = undefined;
var apiKey = '953a017bbea6d7176936745ba1da12f7';

var response;

function initMap() {

    var currentLoc = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 4,
        center: currentLoc
    });

    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
        //console.log(e.latLng.lat());               
    });
}

function placeMarkerAndPanTo(latLng,map) {
    if (marker)
        marker.setMap(null);

    marker = new google.maps.Marker({
        position: latLng,
        map: map
    });

    var contentString = latLng.toString();
    var infowindow = new google.maps.InfoWindow({content: contentString});
    infowindow.open(map,marker);
    //map.panTo(latLng);
}

/*var httpRequest = new XMLHttpRequest();
console.log(httpRequest);

httpRequest.onload = function() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            //all fine
            response = JSON.parse(httpRequest.responseText);
            console.log(response);

        }

    } else {
        console.log('Request Waiting!!');
    }
};

function makeRequest(lat, long) {
    var requestURL = 'https://api.darksky.net/forecast/'+apiKey+'/'+lat.toString()+','+long.toString();
    httpRequest.open('GET', requestURL);
    httpRequest.withCredentials = true;
    httpRequest.setRequestHeader('Content-Type', 'text/plain');
    httpRequest.send();

}

*/

function ajaxRequest(url, callback) {
    $.ajax({
        url:url,
        dataType: 'jsonp',
        success: function(data) {
            callback(data);
        }
    });
}

function makeRequest(lat,lng) {
    var requestURL = 'https://api.darksky.net/forecast/'+apiKey+'/'+lat.toString()+','+lng.toString();
    var response; // response to be used ... function will return the required data

    ajaxRequest(requestURL,function(d) {
        response = d;
    });
}
makeRequest(-25.363,131.044);
