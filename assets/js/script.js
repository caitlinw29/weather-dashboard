var APIKey = "65566f3f953d22f68075807f0afd5b8b";
var city;
var lat;
var lon;
var searchButton = document.getElementById("search-button");
var currentCity = document.getElementById("currentCity");
var mainPage = document.getElementById("mainPage");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uv = document.getElementById("uv");

searchButton.addEventListener("click", getApi);


function getApi() {
    var input = document.getElementById("city").value.trim();
    city = input;
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    var today = moment();
    
    // fetch request gets the data for the city
    fetch(cityUrl)
      .then(function (response) {
        //if there is an error pulling the city data, inform that there was an error
        if (response.status !== 200) {
            alert("That city is not valid");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var iconcode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#weatherIcon').attr('src', iconURL);
        mainPage.className = "";
        currentCity.textContent = data.name;
        $("#currentTime").text(today.format("(MM/DD/YY)"));
        temp.textContent = "Temp: " + data.main.temp + "\xB0F";
        wind.textContent = "Wind: " + data.wind.speed + " MPH";
        humidity.textContent = "Humidity: " + data.main.humidity + "%";
        lat = data.coord.lat;
        lon = data.coord.lon;
        function fetchOneCall() {
            var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=imperial";
            // fetch request gets the data for the UV index
            fetch(uvUrl)
                .then(function (response) {
                return response.json();
                })
                .then(function (data) {
                console.log(data);
                uv.textContent = data.current.uvi;
                if (data.current.uvi < 3) {
                    uv.className = "favorable inline";
                } else if (data.current.uvi >=3 && data.current.uvi < 8) {
                    uv.className = "moderate inline";
                } else {
                    uv.className = "severe inline";
                }
            });
        }
        fetchOneCall();
      });

    
}

function saveCities() {

}
  

  

  
