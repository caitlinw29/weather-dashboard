var APIKey = "65566f3f953d22f68075807f0afd5b8b";
var city;
var searchButton = document.getElementById("search-button");
var currentCity = document.getElementById("currentCity");
var weatherIcon = document.getElementById("weatherIcon");
var mainPage = document.getElementById("mainPage");

searchButton.addEventListener("click", getApi);

function getApi() {
    var input = document.getElementById("city").value.trim();
    city = input;
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    var today = moment();
    
    // fetch request gets the data for the city
    fetch(cityUrl)
      .then(function (response) {
        if (response.status !== 200) {
            alert("That city is not valid");
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        var iconcode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png";
        mainPage.className = "";
        $('#weatherIcon').attr('src', iconURL);
        currentCity.textContent = data.name;
        $("#currentTime").text(today.format("(MM/DD/YY)"));
      });
}

function saveCities() {

}
  

  

  
