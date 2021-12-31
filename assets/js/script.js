var APIKey = "65566f3f953d22f68075807f0afd5b8b";
var city;
var input = document.getElementById("city");
var lat;
var lon;
var cities;
var searchButton = document.getElementById("search-button");
var currentCity = document.getElementById("currentCity");
var mainPage = document.getElementById("mainPage");
var buttonPlaceholder = document.getElementById("buttonPlaceholder");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var uv = document.getElementById("uv");
var savedCity;
var btnPlusDelete;

//on click of search button, store city and run getApi for that city
searchButton.addEventListener("click", function(){
    //Get user input and save it as the city
    city = input.value.trim();
    getApi(city);
});
//enter key is hit, run getApi() by clicking search
input.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        searchButton.click();
    }
});
makeButtons();

function getApi(city) {
    //move aside components to left side
    document.getElementById("search").setAttribute("style", "width: 25%; padding: 0");
    searchButton.setAttribute("style", "width: 100%");
    input.setAttribute("style", "width: 100%");
    buttonPlaceholder.setAttribute("style", "width:100%");

    //clear input field
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
        savedCity = data.name;
        //set the icon up by pulling the code and using it along with the base url for the icons to create the correct url for the current icon png
        var iconcode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#weatherIcon').attr('src', iconURL);
        //add a tooltip with the weather condition 
        $('#currentIcon').find('.tooltiptext').text(data.weather[0].description);
        //Show mainPage since it was hidden until you click the button
        mainPage.className = "";
        //Update the city name
        currentCity.textContent = savedCity;
        //Update the date
        $("#currentDate").text(today.format("(MM/DD/YY)"));
        //update the temp, wind, and humidity
        //conversions for celsius and kp/h
        var curCTemp = convertTemp(data.main.temp);
        var curKPH = convertSpeed(data.wind.speed);
        temp.textContent = "Temp: " + data.main.temp.toFixed() + "\xB0F / " + curCTemp + "\xB0C";
        wind.textContent = "Wind: " + data.wind.speed.toFixed() + " MPH / " + curKPH + " KPH";
        humidity.textContent = "Humidity: " + data.main.humidity + "%";
        //set up the lat and lon to be pulled in the OneCallAPI URL below
        lat = data.coord.lat;
        lon = data.coord.lon;
        fetchOneCall();
        //if a button already exists for the city, return. We don't need to save it again.
        if(document.getElementById(savedCity)){
            return;
        }
        
        saveCities();  
        makeButtons(); 
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
            
            //set the icon up in 5 day forecast 
            //For each icon..
            $("[data-icon]").each(function() {
                //num is the number of the icon 1-5
                var num = $(this).data("icon");
                //plug num in to get the code for the day's icon
                var iconCode = data.daily[num].weather[0].icon;
                //plus iconCode in to the url
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                //set the src of the current day's icon to be the iconURL
                $(this).attr('src', iconURL);
                //set the span text to be the current weather conditions (tooltip)
                $(this).next().text(data.daily[num].weather[0].description);
            })

            //Set the temp, wind, and humidity in 5 day forecast
            $("[data-temp]").each(function() {
                //num is the number of the day 1-5
                var num = $(this).data("temp");
                var dailyCTemp = convertTemp(data.daily[num].temp.day);
                $(this).text("Temp: " + data.daily[num].temp.day.toFixed() + "\xB0F / " + dailyCTemp + "\xB0C");
            })

            $("[data-wind]").each(function() {
                var num = $(this).data("wind");
                var dailyKPH = convertSpeed(data.daily[num].wind_speed);
                $(this).text("Wind: " + data.daily[num].wind_speed.toFixed() + " MPH / " + dailyKPH + " KPH");
            })

            $("[data-humidity]").each(function() {
                var num = $(this).data("humidity");
                $(this).text("Humidity: " + data.daily[num].humidity + "%");
            })
    });
} 

//save the city name to localStorage to use when making a button
function saveCities() {
    cities = JSON.parse(localStorage.getItem("cities")) || [];

    var newCity = savedCity;
    cities.push(newCity);
    
    localStorage.setItem("cities", JSON.stringify(cities));
}

//make buttons for each city and append to buttonPlaceholder
function makeButtons(){
    //clear old list
    removeAllChildNodes(buttonPlaceholder);
    cities = JSON.parse(localStorage.getItem("cities"));
    cities = cities.sort();
    for (let i=0; i<cities.length; i++){
        //set up the div to hold the btn and deletion
        btnPlusDelete = document.createElement("div");
        btnPlusDelete.className = "btnPlusDelete";
        //make a button and set up the id, textContent, and className
        var citybtn = document.createElement("button");
        citybtn.setAttribute("id", cities[i]);
        citybtn.textContent = cities[i];
        citybtn.className = "newCity";
        //deletion will be an X to delete the saved city
        var deletion = document.createElement("span");
        deletion.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>";
        deletion.className = "deletion";
        //append the button and deletion to the div, then append div to page
        btnPlusDelete.appendChild(citybtn);
        btnPlusDelete.appendChild(deletion);
        buttonPlaceholder.appendChild(btnPlusDelete);
    }

    //for each city button, on click, run getApi with the city of the button
    $(".newCity").on("click", function(){
        city = this.id;
        getApi(city);
    })  
    //for each deletion, on click, delete the div and delete the city from localStorage
    $(".deletion").on("click", function() {
        //remove the div if deletion is clicked
        const btndelDiv = this.parentNode;
        btndelDiv.parentNode.removeChild(this.parentNode);
        //prevSibling is the button, target it's id for index
        let prevSibling = this.previousElementSibling;
        const index = cities.indexOf(prevSibling.id);
        //if index exists, splice that index out of the array
        if (index > -1) {
            cities.splice(index, 1);
        }
        //save new array
        localStorage.setItem("cities", JSON.stringify(cities));
    })
}

//remove the children of the buttonPlaceholder to clear the old list
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//functions for converting F to C and MPH to KPH
function convertTemp(fahrenheit){
    var celsius = ((fahrenheit - 32) * .5556).toFixed();
    return celsius;
}
function convertSpeed(mph){
    var kph = (mph * 1.609344).toFixed();
    return kph;
}