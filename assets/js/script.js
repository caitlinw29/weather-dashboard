var APIKey = "65566f3f953d22f68075807f0afd5b8b";
var city;
var input = document.getElementById("city");
var lat;
var lon;
var cities = [];
var searchButton = document.getElementById("search-button");
var currentCity = document.getElementById("currentCity");
var mainPage = document.getElementById("mainPage");
var buttonPlaceholder = document.getElementById("buttonPlaceholder");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uv = document.getElementById("uv");
var temp1 = document.getElementById("future1temp");
var wind1 = document.getElementById("future1wind");
var humidity1 = document.getElementById("future1humidity");
var temp2 = document.getElementById("future2temp");
var wind2 = document.getElementById("future2wind");
var humidity2 = document.getElementById("future2humidity");
var temp3 = document.getElementById("future3temp");
var wind3 = document.getElementById("future3wind");
var humidity3 = document.getElementById("future3humidity");
var temp4 = document.getElementById("future4temp");
var wind4 = document.getElementById("future4wind");
var humidity4 = document.getElementById("future4humidity");
var temp5 = document.getElementById("future5temp");
var wind5 = document.getElementById("future5wind");
var humidity5 = document.getElementById("future5humidity");

//on click of search button, or enter key is hit, run getApi()
searchButton.addEventListener("click", getApi);
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});

function getApi() {
    //Get user input and save it as the city
    city = input.value.trim();
    input.value = "";
    //pass in the current city to the API call
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    var today = moment();
    
    // fetch request gets the data for the city
    fetch(cityUrl)
      .then(function (response) {
        //if there is an error pulling the city data, inform user that there was an error reading city name
        if (response.status !== 200) {
            alert("That city is not valid");
        }
        return response.json();
      })
      .then(function (data) {
        //set the icon up by pulling the code and using it along with the base url for the icons to create the correct url for the current icon
        var iconcode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#weatherIcon').attr('src', iconURL);
        //Show mainPage since it was hidden until you click the button
        mainPage.className = "";
        //Update the city name
        currentCity.textContent = data.name;
        //Update the date
        var currentDate = $("#currentDate").text(today.format("(MM/DD/YY)"));
        //update the temp, wind, and humidity
        temp.textContent = "Temp: " + data.main.temp + "\xB0F";
        wind.textContent = "Wind: " + data.wind.speed + " MPH";
        humidity.textContent = "Humidity: " + data.main.humidity + "%";
        //set up the lat and lon to be pulled in the OneCallAPI URL
        lat = data.coord.lat;
        lon = data.coord.lon;
      
        fetchOneCall();
        if(document.getElementById(data.name)){
            return;
        }
        var citybtn = document.createElement("button");
        citybtn.setAttribute("id", data.name);
        citybtn.textContent = data.name;
        citybtn.className = "newCity";
        citybtn.setAttribute("style", "cursor: pointer")
        buttonPlaceholder.appendChild(citybtn);
       
        // saveCities();   
    });
}


function fetchOneCall() {
    //Pull the lat and lon of the current city
    var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=,minutely,hourly,alerts&appid=" + APIKey + "&units=imperial";
    // fetch request gets the data for UV and forecast
    fetch(uvUrl)
        .then(function (response) {
            return response.json();
            })
        .then(function (data) {
            var tomorrow  = moment().add(1,'days');
            var twoDays  = moment().add(2,'days');
            var threeDays  = moment().add(3,'days');
            var fourDays  = moment().add(4,'days');
            var fiveDays  = moment().add(5,'days');

            //set up UV index
            var todayUV = data.current.uvi;
            uv.textContent = todayUV;

            //Use the UV index ranges for the if...elseif...else statement
            //decides what color the UV will be - green, orange, red
            if (todayUV < 3) {
                uv.className = "favorable inline";
            } else if (todayUV >=3 && todayUV < 8) {
                uv.className = "moderate inline";
            } else {
                uv.className = "severe inline";
            }

            //Update the date for 5 day forecast
            $("#futuredate1").text(tomorrow.format("MM/DD/YY"));
            $("#futuredate2").text(twoDays.format("MM/DD/YY"));
            $("#futuredate3").text(threeDays.format("MM/DD/YY"));
            $("#futuredate4").text(fourDays.format("MM/DD/YY"));
            $("#futuredate5").text(fiveDays.format("MM/DD/YY"));
            
            //set the icon up in 5 day forecast by pulling the code and using it along with the base url for the icons to create the correct url for the current icon
            var iconcode1 = data.daily[1].weather[0].icon;
            var iconURL1 = "http://openweathermap.org/img/w/" + iconcode1 + ".png";
            $('#weatherIcon1').attr('src', iconURL1);
            var iconcode2 = data.daily[2].weather[0].icon;
            var iconURL2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
            $('#weatherIcon2').attr('src', iconURL2);
            var iconcode3 = data.daily[3].weather[0].icon;
            var iconURL3 = "http://openweathermap.org/img/w/" + iconcode3 + ".png";
            $('#weatherIcon3').attr('src', iconURL3);
            var iconcode4 = data.daily[4].weather[0].icon;
            var iconURL4 = "http://openweathermap.org/img/w/" + iconcode4 + ".png";
            $('#weatherIcon4').attr('src', iconURL4);
            var iconcode5 = data.daily[5].weather[0].icon;
            var iconURL5 = "http://openweathermap.org/img/w/" + iconcode5 + ".png";
            $('#weatherIcon5').attr('src', iconURL5);

            //Set the temp, wind, and humidity in 5 day forecast
            temp1.textContent = "Temp: " + data.daily[1].temp.day + "\xB0F";
            wind1.textContent = "Wind: " + data.daily[1].wind_speed + " MPH";
            humidity1.textContent = "Humidity: " + data.daily[1].humidity + "%";
            temp2.textContent = "Temp: " + data.daily[2].temp.day + "\xB0F";
            wind2.textContent = "Wind: " + data.daily[2].wind_speed + " MPH";
            humidity2.textContent = "Humidity: " + data.daily[2].humidity + "%";
            temp3.textContent = "Temp: " + data.daily[3].temp.day + "\xB0F";
            wind3.textContent = "Wind: " + data.daily[3].wind_speed + " MPH";
            humidity3.textContent = "Humidity: " + data.daily[3].humidity + "%";
            temp4.textContent = "Temp: " + data.daily[4].temp.day + "\xB0F";
            wind4.textContent = "Wind: " + data.daily[4].wind_speed + " MPH";
            humidity4.textContent = "Humidity: " + data.daily[4].humidity + "%";
            temp5.textContent = "Temp: " + data.daily[5].temp.day + "\xB0F";
            wind5.textContent = "Wind: " + data.daily[5].wind_speed + " MPH";
            humidity5.textContent = "Humidity: " + data.daily[5].humidity + "%";
    });
} 

function saveCities() {
    cities = JSON.parse(localStorage.getItem("cities"));

    var newCity = {
        name: currentCity.textContent,
        date: currentDate
    };


    cities.push(newCity);
    
    localStorage.setItem("savedCity[i]", JSON.stringify(cities));

    JSON.parse(localStorage.getItem("cities"));
    
    $(".newCity").each(function() {
        $(".newCity").on("click", function(){
            localStorage.getItem("savedCity[i]");
        })
    });
        
}

  
