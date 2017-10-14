function initMap()
{
    var tempadd;
    var counter = 0;
    var type_temp ;
    var uluru = {lat: 28.7041, lng: 77.1025};
    var map = new google.maps.Map(document.getElementById('map'),{
        zoom: 6,
        center: uluru
    });
    // var marker = new google.maps.Marker({
    //     position: uluru,
    //     map: map,
    // });
    var Data=[];
    var cord;
    google.maps.event.addListener(map , 'click', function (event)
    {
        console.log(event);

        var clientID= 'e9513f260b2bb4cfff509d2238e813fa';
        var endPoint= 'https://api.darksky.net/forecast/';
        console.log(event.latLng.lat());
        var parameters= '/'+ event.latLng.lat() +',' +event.latLng.lng() ;
        var url= endPoint + clientID + parameters;

        
        function AjaxRequest(url , callback) {
            $.ajax({url: url, dataType: 'jsonp', success: function (data){
                callback(data);
            }})
        };
        AjaxRequest(url, function (d) {
             Data.push(d);
             console.log(Data);
             type_temp = d.currently.icon;
             // console.log("\n\n\n"+"2"+"\n\n\n");
             cord={coords: event.latLng , type_of_weather: type_temp , position1: counter};
             codeLatLng(event.latLng.lat(),event.latLng.lng() );
             counter = counter + 1 ;
        });
        // console.log("\n\n\n"+"1"+"\n\n\n");
        
    });

    function change_card(type_of_weather)
    {
 
        $('#summary_changed').text(type_of_weather);

        if( type_of_weather == "clear-night" )
        {
            helper( "6" );
        }
        else if( type_of_weather == "clear-day" )
        {
            helper( "5" );
        }
        else if( type_of_weather == "rain" )
        {
            helper( "2" );
        }
        else if( type_of_weather == "snow" )
        {
            helper( "0" );
        }
        else if( type_of_weather == "sleet" )
        {
            helper( "2" );
        }
        else if( type_of_weather == "wind" )
        {
            helper( "1" );
        }
        else if( type_of_weather == "fog" )
        {
            helper( "6" );
        }
        else if( type_of_weather == "cloudy" )
        {
            helper( "6" );
        }
        else if( type_of_weather == "partly-cloudy-day" )
        {
            helper( "6" );
        }
        else if( type_of_weather == "partly-cloudy-night" )
        {
            helper( "6" );
        }
        else
        {
            helper( "3" );   
        }
    }

    function addMarker(props)
    {
        //console.log(props.coords);
        var marker = new google.maps.Marker({
            position:props.coords,
            map:map

        });
        marker.type_of_weather = props.type_of_weather ;
        marker.position1 = props.position1 ;
        change_card( marker.type_of_weather );
        change_chart_data( marker.position1 );
        if (true)
        {
            var te = tempadd + '</br><h1> ' + marker.type_of_weather + ' <h1>';
            var infoWindow = new google.maps.InfoWindow({
                content : te
            });
            marker.addListener('mouseover' , function () {
                infoWindow.open(map, marker);
                change_card( marker.type_of_weather );
                change_chart_data( marker.position1 );
            })

            marker.addListener('mouseout' , function () {
                infoWindow.close();
            })

            marker.addListener('click' , function () {
                populate_it( marker.position1 );
            })

        }
        if( props.iconImage )
        {
            marker.setIcon();
        }

    }

    function select_content( address )
    { 
        tempadd = '<h4>' + address + '<h4>'; 
        addMarker(cord);
    }

    function codeLatLng(lat, lng)
    {

        var latlng = new google.maps.LatLng(lat, lng);
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log("hello" + results);
                if (results[1]) {
           
                    tempadd = results[0].formatted_address;
                    select_content(tempadd);
                    
                }
                else {
                    alert("No results found");
                }
            }
            else {
                alert("Geocoder failed due to: " + status);
            }
        });
    }


    var ctx = document.getElementById('myChart').getContext('2d');
    function change_chart_data( d )
    {
        // console.log("\n\n\n\nsize is : "+Data.length+"\n"+d+"\n\n\n\n");
        var info = Data[d].daily.data;
        
        // console.log(info);

        var labels_g = [];
        console.log("");
        for( var i=0 ; i<info.length ; i++ )
        {
            labels_g.push('M'); 
        }

        var data_1 = [];
        var data_2 = [];
        for( var i=0 ; i<info.length ; i++ )
        {
            data_1.push(info[i].apparentTemperatureMin);
            data_2.push(info[i].apparentTemperatureMax);

        }

        console.log("\n\n\n\nsize is : "+data_1.length+"\n"+"\n\n\n\n");
        console.log("\n\n\n\nsize is : "+data_2.length+"\n"+"\n\n\n\n");

        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels_g,
            datasets: [{
              label: 'Min. Temp',
              data: data_1,
              backgroundColor: "rgba(153,255,51,0.6)"
            }, {
              label: 'Max. Temp',
              data: data_2,
              backgroundColor: "rgba(255,153,0,0.6)"
            }]
          }
        });
    }

    $('#cross_icon').click(function(){
         $("#hello").css("display", "none");
    })    

    function populate_it( d )
    {
        var info = Data[d].currently;

        // $("#hello").css("display", "none");
        $("#hello").css("display", "block");
        
        $('#temperature1').text('Temperature ji : '+info.temperature);
        $('#summary1').text('Summary : '+info.summary);
        $('#nearestStormDistance1').text('Nearest Storm Distance : '+info.nearestStormDistance);
        $('#precipIntensity1').text('Precipitation Intensity : '+info.precipIntensity);
        $('#precipProbability1').text('Precipitation Probability : '+info.precipProbability);
        $('#dewPoint1').text('Dew Point : '+info.dewPoint);
        $('#humidity1').text('Humidity : '+info.humidity);
        $('#windSpeed1').text('Wind Speed : '+info.windSpeed);
        $('#visibility1').text('Visibility : '+info.visibility);
        $('#cloudCover1').text('Cloud Cover : '+info.cloudCover);
        $('#pressure1').text('Pressure : '+info.pressure);
        $('#ozone1').text('Ozone : '+info.ozone);
        
    }

}