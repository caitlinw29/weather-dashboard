var APIKey = "65566f3f953d22f68075807f0afd5b8b";
var city;
var searchButton = document.getElementById('search-button');

function saveCity() {
    var input = document.getElementById("city").value.trim();
    city = input;
}

function getApi() {
    var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    // fetch request gets a list of all the cities and their data
    fetch(cityUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  }
  

  searchButton.addEventListener('click', saveCity);
  searchButton.addEventListener('click', getApi);

  
