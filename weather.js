var marker = undefined;
var apiKey = '953a017bbea6d7176936745ba1da12f7';
var response;

var list = {"clear-day":"CLEAR_DAY", "clear-night":"CLEAR_NIGHT", 
            "partly-cloudy-day":"PARTLY_CLOUDY_DAY",
            "partly-cloudy-night":"PARTLY_CLOUDY_NIGHT", 
            "cloudy":"CLOUDY", "rain":"RAIN", 
            "sleet":"SLEET", 
            "snow":"SNOW", 
            "wind":"WIND","fog":"FOG"};

var skycons = new Skycons({"color": "black"});
var ctx = document.getElementById("myChart").getContext('2d');
var chart;
var config; // configuration for chart.js


var app = new Vue({
          el: '.info',
          data: {
            temp: 'Current Temp.',
            date: 'Date',
            summary: 'The Weather today'
          }
        });



function initMap() {

    var currentLoc = getCurrentLocation();
    var map = new google.maps.Map(document.querySelector('#map'), {
        zoom: 4,
        center: currentLoc
    });

    map.addListener('click', function(e) {
        placeMarker(e.latLng, map);
        console.log(e.latLng.lat());
        console.log(e.latLng.lng());
        makeRequest(e.latLng.lat(), e.latLng.lng());
    });
}

function updateChart(response) {
    if (chart === undefined) {
        config = {
            type: 'line',
            data: {
                labels: getNextDays(),
                datasets: [ {
                    label: 'Max. Temp',
                    backgroundColor: "rgba(255,0,0,0.6)",
                    borderColor: "rgba(255,0,0,0.6)",
                    data: getMaxTempData(response),
                    fill: true
                },
                {
                    label: 'Min. Temp',
                    backgroundColor: "rgba(0,0,255,0.6)",
                    borderColor: "rgba(0,0,255,0.6)",
                    data: getMinTempData(response),
                    fill: true
                }

                ]
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Weather'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Days'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature (in Fahrenheit)'
                        }
                    }]
                }
            } 
        };
        chart = new Chart(ctx, config);
    } else {
        chart.destroy();
        config.data.datasets[0].data = getMaxTempData(response);
        config.data.datasets[1].data = getMinTempData(response);
        chart = new Chart(ctx,config);
    }
}

function placeMarker(latLng,map) {
    if (marker)
        marker.setMap(null);

    marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
}

//AJAX ... hmm
function ajaxRequest(url, callback) {
    $.ajax({
        url:url,
        dataType: 'jsonp',
        success: function(data) {
            callback(data);
        }
    });
}

// Make AJAX Request
function makeRequest(lat,lng) {
    var requestURL = 'https://api.darksky.net/forecast/'+apiKey+'/'+lat.toString()+','+lng.toString();
     // response to be used ... function will return the required data

    ajaxRequest(requestURL,function(d) {
        response = d;
        //console.log(response);
        setContent();
        updateChart(response);
    });
}

function getMaxTempData(response) {
    var tempArr = [];
    //console.log(response);
    for (let i=0; i < 7; ++i) {
        var day = response.daily.data[i];
        tempArr.push(day.temperatureHigh);
    }

    return tempArr;
}

function getMinTempData(response) {
    var tempArr = [];
    //console.log(response);
    for (let i=0; i < 7; ++i) {
        var day = response.daily.data[i];
        tempArr.push(day.temperatureLow);
    }
    return tempArr;
}

function setContent(){
    skycons.set("icon1", Skycons[list[response.currently.icon]]);
    skycons.play();
    app.temp = response.currently.temperature + ' F';
    app.date = Date(response.currently.time).slice(0,16);
    app.summary = response.currently.summary;
}



function getCurrentLocation() {
    
    var pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            
        }, function() {
                console.log('Geolocation failed');
          });
    } else {
            console.log('Geolocation failed')
    }
    console.log(pos);
    return pos || {lat: 28.7041, lng: 77.1025};
}

function getNextDays() {
    var today = new Date();
    var idx = today.getDay();

    var days = [];
    switch(idx) {
        case 1: days = ['Mon','Tue','Wed','Thurs','Fri','Sat','Sun'];
                break;
        case 2: days = ['Tue','Wed','Thurs','Fri','Sat','Sun','Mon'];
                break;
        case 3: days = ['Wed','Thurs','Fri','Sat','Sun','Mon','Tue'];
                break;
        case 4: days = ['Thurs','Fri','Sat','Sun','Mon','Tue','Wed'];
                break;
        case 5: days = ['Fri','Sat','Sun','Mon','Tue','Wed','Thurs'];
                break;
        case 6: days = ['Sat','Sun','Mon','Tue','Wed','Thurs','Fri'];
                break;
        case 7: days = ['Sun','Mon','Tue','Wed','Thurs','Fri','Sat'];
                break;
    }

    return days;
}

