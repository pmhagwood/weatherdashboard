var cityName;
var mainDate = moment().format('L');

// html for city info


function buildQueryURL() {
    // queryURL is the url to query the API
    var startURL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var apiKey = "&appid=568b20af6adfa0aa216b56bfc3c3b3de";
    cityName = $("#search-city")
    .val()
    .trim();

    console.log("city name: ", cityName);
    console.log(startURL + cityName + apiKey);
    console.log("date is: ", mainDate);
    return queryURL = startURL + cityName + apiKey;
}



// .on("click") function associated with the Search Button
$(".submitbtn").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();

    
    buildQueryURL();
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response){
        console.log(response);
        console.log(queryURL);
        var currentweather = response.weather[0].main;

        console.log ("current weather: ", currentweather);

        if (currentweather === "Rain") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather=== "Clouds") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        } else if (currentweather === "Clear") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Drizzle") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
         else if (currentweather === "Snow") {
            var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
            currentIcon.attr("style", "height: 60px; width: 60px");
        }
        var cityNameEl = $("<h2>").text(response.name);
        var displayMainDate = cityNameEl.append(" (" + mainDate + ")");
        var tempF = (response.main.temp - 273.15) * 1.8 + 32;
        var tempEL = $("<p>").text("Temperature: " + tempF.toFixed(2) + " °F");
        var humidEl = $("<p>").text("Humidity: " + response.main.humidity + "%");
        var windEl = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
        // var uvEL = $("<p>").text("UV Index: " + )
        
        console.log('cityNameel:', cityNameEl);
        $('.city-results').append(displayMainDate, currentIcon, tempEL, humidEl, windEl);
    });
  });