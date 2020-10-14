var cityName;
var mainDate = moment().format('L');
var cityArray = [];

// html for city info

$(document).ready(function () {
    initializeLocalStorage();

    function buildQueryURL(cityName) {
        // queryURL is the url to query the API
        var startURL = "https://api.openweathermap.org/data/2.5/weather?q=";
        var apiKey = "&appid=568b20af6adfa0aa216b56bfc3c3b3de";
        // Checks for duplicates
        var cityString = cityArray.join("")
        if (cityString.toLowerCase().includes(cityName.toLowerCase()) === false) {
            // Build city history array
            if (cityArray.length < 8) {
                cityArray.push(cityName);
            } else {
                cityArray.shift();
                cityArray.push(cityName);
            }
        }


        $('.list-group').empty();
        for (var i = 0; i < cityArray.length; i++) {
            var btn = $('<button>')
                .addClass("list-group-item list-group-item-action city")
                .text(cityArray[i]);
            $('.list-group').prepend(btn);
            // console.log('cityarray ', cityArray[i]);
        }
        return queryURL = startURL + cityName + apiKey;
    }


    function updatePage(cityName) {
        // Make the AJAX request to the API - GETs the JSON data at the queryURL.
        // The data then gets passed as an argument to the updatePage function
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            //   console.log(response);
            //   console.log("openweather URL is: ", queryURL);

            var iconCode = response.weather[0].icon;

            var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
            //   console.log('weather icon URL:', iconUrl); 
            var currentIcon = $('<img>').attr("src", iconUrl);
            currentIcon.attr("style", "height: 60px; width: 60px");

            var cityNameEl = $("<h2>").text(response.name);
            var displayMainDate = cityNameEl.append(" (" + mainDate + ")");
            var tempF = (response.main.temp - 273.15) * 1.8 + 32;
            var tempEL = $("<p>").text("Temperature: " + tempF.toFixed(0) + " °F");
            var humidEl = $("<p>").text("Humidity: " + response.main.humidity + "%");
            var windEl = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
            // var uvEL = $("<p>").text("UV Index: " + )

            //   console.log('cityNameel:', cityNameEl);
            $('.city-results').append(displayMainDate, currentIcon, tempEL, humidEl, windEl);

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: queryURLUV,
                method: 'GET'
            }).then(function (response2) {
                //   console.log(queryURLUV);
                var uvlresultsEl = $("<p>").html("UV Index: " + "<span class='temp'>" + response2.value + "</span>");
                tempVal = response2.value;
                $('.city-results').append(uvlresultsEl);
                if (tempVal < 4){
                    $('.temp').css('background-color', 'rgb(73, 203, 114)');
                } else if (tempVal > 4 && tempVal < 8){
                    $('.temp').css('background-color', 'rgb(247, 237, 105)');
                } else if (tempVal > 8){
                    $('.temp').css('background-color', 'rgb(247, 91, 88)');
                }
            });
        }).catch(function (error){
           
            
            alert('Invalid City');
            location.reload();
        });
        // forecast URL for gathering info for forecast blocks
        var forcastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=568b20af6adfa0aa216b56bfc3c3b3de";
        // get the forecast API info

        $.ajax({
            url: forcastURL,
            method: "GET"
        }).then(function (response3) {
            var results = response3.list;
            // empty out the div 
            $(".fiveday").empty();
            // A loop for getting all the forecast info and putting it into variables. 
            for (var i = 0; i < results.length; i += 8) {

                // Put a div inside fiveday
                var forecastDiv = $("<div class='card shadow-sm text-white bg-info mx-auto mb-5 p-2' style='width: 9.4em; height: 12em;'>");

                // variables for all the results
                var date = results[i].dt_txt;
                var setD = date.substr(0, 10)
                var temp = results[i].main.temp;
                var tempConv = (temp - 273.15) * 1.8 + 32;
                var hum = results[i].main.humidity;

                // creating tags with the result items information.....
                var h5date = $("<h5 class='card-title'>").text(setD);
                var pTemp = $("<p class='card-text'>").text("Temp: " + tempConv.toFixed(0) + "°F");;
                var pHum = $("<p class='card-text'>").text("Humidity: " + hum);;
                //  get the weather icon
                var weatherIcon = results[i].weather[0].icon;
                var weathericonUrl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
                var wIcon = $('<img>').attr("src", weathericonUrl);
                wIcon.attr("style", "height: 40px; width: 40px");


                //append items to.......
                forecastDiv.append(h5date);
                forecastDiv.append(wIcon);
                forecastDiv.append(pTemp);
                forecastDiv.append(pHum);
                $(".fiveday").append(forecastDiv);
            }
            saveToLocalStorage(cityArray);
        });
    }

    //   Put object into localstorage
    function initializeLocalStorage() {
        var storage = JSON.parse(localStorage.getItem('cityArray'));
        if(storage){
            cityArray = storage;
           
            var city = cityArray[cityArray.length - 1];
            buildQueryURL(city);
            console.log(city);
            updatePage(city);
        }
        
    }

    function saveToLocalStorage(city) {
        localStorage.setItem('cityArray', JSON.stringify(city));
    }

    // Function to empty out the articles
    function clear() {
        $(".city-results").empty();
        $(".fiveday").empty();
        $("#search-city").val("");
    }


    // .on("click") function associated with the Search Button
    $(".submitbtn").on("click", function (event) {
        // This line allows us to take advantage of the HTML "submit" property
        // This way we can hit enter on the keyboard and it registers the search
        // (in addition to clicks). Prevents the page from reloading on form submit.
        event.preventDefault();

        cityName = $("#search-city")
            .val()
            .trim();


        buildQueryURL(cityName);
        updatePage(cityName);
        clear();
    });
    //   This is the list of buttons down the left side of screen
    $(document).on('click', '.city', function (event) {
        event.preventDefault();
        clear();
        cityName = $(this).text();
        console.log('Button Clicked');

        buildQueryURL(cityName);
        updatePage(cityName);
    });

    // save city history to localstorage use that to populate page 

});