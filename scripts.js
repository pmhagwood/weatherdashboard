var cityName;
var mainDate = moment().format('L');
var cityArray = [];

// html for city info


function buildQueryURL() {
    // queryURL is the url to query the API
    var startURL = "http://api.openweathermap.org/data/2.5/weather?q=";
    var apiKey = "&appid=568b20af6adfa0aa216b56bfc3c3b3de";
    cityName = $("#search-city")
    .val()
    .trim();

    // console.log("city name: ", cityName);
    // console.log(startURL + cityName + apiKey);
    // console.log("date is: ", mainDate);
    

    // Build city history array
    if(cityArray.length < 8){
        cityArray.push(cityName);
    } else {
        cityArray.shift();
        cityArray.push(cityName);
    }
    $('.list-group').empty();
    for(var i=0; i < cityArray.length; i++){
        var btn = $('<button>')
        .addClass("list-group-item list-group-item-action city")
        .text(cityArray[i]);
        $('.list-group').prepend(btn);
        console.log('cityarray ', cityArray[i]);
    }
    return queryURL = startURL + cityName + apiKey;
}


function updatePage(city){
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
  
          var lat = response.coord.lat;
          var lon = response.coord.lon;
          var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi?&appid=ecc0be5fd92206da3aa90cc41c13ca56&lat=" + lat  + "&lon=" + lon;
  
          $.ajax({
              url: queryURLUV,
              method: 'GET'
          }).then(function (response2) {
              console.log(queryURLUV);
              var uvlresultsEl = $("<p>").text("UV Index: " + response2.value);
              $('.city-results').append(uvlresultsEl);
      
          });
      });
      // forecast URL for gathering info for forecast blocks
      var forcastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=568b20af6adfa0aa216b56bfc3c3b3de";
      // get the forecast API info
      
      $.ajax({
        url: forcastURL,
        method: "GET"
      }).then(function (response3){
            var results = response3.list;
          console.log('forcast info is: ', results);
          console.log('forecastURL is :', forcastURL);
        for (var i = 0; i <= results.length; i+=8){
            var date = results[i].dt_txt;
            var setDate = date.substr(0,10);
            var temp = results[i].main.temp;
            var setTemp = (temp - 273.15) * 1.8 + 32;
            console.log('date is ', setDate);
            console.log('temp is :', setTemp.toFixed(0), "°F");
            // add day + i 
        }
         
      });

}

// Function to empty out the articles
function clear() {
    $(".city-results").empty();
    $(".fiveday").empty();
  }


// .on("click") function associated with the Search Button
$(".submitbtn").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
    clear();
    
    buildQueryURL();
    updatePage();
    
  });

  // save city history to localstorage use that to populate page 