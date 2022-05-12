var apiKey = "c897da12469fa121d634b40a11fa4de5";
let cityEl = $(".searched-city-name");
let dateEl = $(".date");
let imageEl = $(".weather-img");
let previousSearches = $(".search-history");
let searchBtn = $(".btn");
let searchInput = $(".search-input");
let temperatureEl = $(".temperature");
let windEl = $(".wind");
let humidEl = $(".humidity");
let uvIndexEl = $(".uvIndex");
let nextFiveDays = $(".future-forecast-cards");
var todayDate = moment().format("YYYY MMM DD");

searchBtn.on("click", function (e) {
  e.preventDefault();
  dateEl.text(`(${todayDate})`);
  returnWeatherData(searchInput.val());
});

if (JSON.parse(localStorage.getItem("previousSearch")) === null) {
  console.log("null");
} else {
  console.log("!null");
  displayPreviousSearch();
}

function displayPreviousSearch(cName) {
  previousSearches.empty();
  let pastSerchArr = JSON.parse(localStorage.getItem("previousSearch"));
  for (let i = 0; i < pastSerchArr.length; i++) {
    let recentSearch = $("<li>").attr("class", "previous-search");
    recentSearch.text(pastSerchArr[i]);
    previousSearches.prepend(recentSearch);
  }
}

//display weather data, current date, uv index colour
function weatherInformation(
  cName,
  cTemp,
  cHumid,
  cWind,
  cUvRating,
  cWeatherImg
) {
  cityEl.text(cName);
  dateEl.text(`(${todayDate})`);
  temperatureEl.text(`Temperature: ${cTemp} °F`);
  windEl.text(`Wind Speed: ${cWind} MPH`);
  humidEl.text(`Humidity: ${cHumid}%`);
  uvIndexEl.text(`UV Index: ${cUvRating}`);
  imageEl.attr("src", cWeatherImg);
  function uvColour() {
    if (cUvRating < 4) {
      $(".uvIndex").addClass("low-uvi");
    } else if (cUvRating > 8) {
      $(".uvIndex").addClass("high-uvi");
    } else {
      $(".uvIndex").addClass("mid-uvi");
    }
  }
  uvColour(cUvRating);
}

//User searches are saved into an array and checked to make sure they can not be double entered.
function returnWeatherData(userCityChoice) {
  let queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userCityChoice}&units=imperial&appid=${apiKey}`;
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (weatherData) {
    let cObject = {
      cName: weatherData.name,
      cTemp: weatherData.main.temp,
      cHumid: weatherData.main.humidity,
      cWind: weatherData.wind.speed,
      cUvRating: weatherData.coord,
      cWeatherImg: weatherData.weather[0].icon,
    };
    let queryUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${cObject.cUvRating.lat}&lon=${cObject.cUvRating.lon}&APPID=${apiKey}&units=imperial`;
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (cUv) {
      console.log(cUv.value);
      if (JSON.parse(localStorage.getItem("previousSearch")) == null) {
        let pastSerchArr = [];
        if (pastSerchArr.indexOf(cObject.cName) === -1) {
          pastSerchArr.push(cObject.cName);
          localStorage.setItem("previousSearch", JSON.stringify(pastSerchArr));

          let cWeatherImgDisplay = `https:///openweathermap.org/img/w/${cObject.cWeatherImg}.png`;
          weatherInformation(
            cObject.cName,
            cObject.cTemp,
            cObject.cHumid,
            cObject.cWind,
            cUv.value,
            cWeatherImgDisplay
          );
          displayPreviousSearch(cObject.cName);
        } else {
          console.log("ALREADY SEARCHED");
          let cWeatherImgDisplay = `https:///openweathermap.org/img/w/${cObject.cWeatherImg}.png`;
          weatherInformation(
            cObject.cName,
            cObject.cTemp,
            cObject.cHumid,
            cObject.cWind,
            cUv.value,
            cWeatherImgDisplay
          );
        }
      } else {
        let pastSerchArr = JSON.parse(localStorage.getItem("previousSearch"));
        if (pastSerchArr.indexOf(cObject.cName) === -1) {
          pastSerchArr.push(cObject.cName);
          localStorage.setItem("previousSearch", JSON.stringify(pastSerchArr));
          let cWeatherImgDisplay = `https:///openweathermap.org/img/w/${cObject.cWeatherImg}.png`;
          weatherInformation(
            cObject.cName,
            cObject.cTemp,
            cObject.cHumid,
            cObject.cWind,
            cUv.value,
            cWeatherImgDisplay
          );
          displayPreviousSearch(cObject.cName);
        } else {
          console.log("ALREADY SEARCHED");
          let cWeatherImgDisplay = `https:///openweathermap.org/img/w/${cObject.cWeatherImg}.png`;
          weatherInformation(
            cObject.cName,
            cObject.cTemp,
            cObject.cHumid,
            cObject.cWind,
            cUv.value,
            cWeatherImgDisplay
          );
        }
      }
    });
  });
  futureFiveDays();

  //Call and loop for the forecast for the next Five days
  function futureFiveDays() {
    nextFiveDays.empty();
    let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${userCityChoice}&APPID=${apiKey}&units=imperial`;
    $.ajax({
      url: queryUrl,
      method: "GET",
    }).then(function (fiveDayData) {
      for (let i = 7, j = 1; i < fiveDayData.list.length; i += 8, j++) {
        let cObject = {
          date: moment().add(j, "days").format("DD/MM/YYYY"),
          icon: fiveDayData.list[i].weather[0].icon,
          temperature: fiveDayData.list[i].main.temp,
          wind: fiveDayData.list[i].wind.speed,
          humidity: fiveDayData.list[i].main.humidity,
        };
        console.log(fiveDayData);
        let weatherImg = `https:///openweathermap.org/img/w/${cObject.icon}.png`;
        displayNextFiveDays(
          cObject.date,
          weatherImg,
          cObject.temperature,
          cObject.wind,
          cObject.humidity
        );
      }
    });
  }
}

//Card Creation
function displayNextFiveDays(date, image, temperature, wind, humidity) {
  let fiveCards = $("<div>").attr("class", "five-day-card");
  let futureDate = $("<h3>").attr("class", "future-box");
  let futureImg = $("<img>").attr("class", "weather-img");
  let futureTemp = $("<p>").attr("class", "future-box");
  let futureWind = $("<p>").attr("class", "future-box");
  let futureHumidity = $("<p>").attr("class", "future-box");

  nextFiveDays.append(fiveCards);
  futureDate.text(date);
  futureImg.attr("src", image);
  futureTemp.text(`Temp: ${temperature} °F`);
  futureWind.text(`Wind: ${wind} MPH`);
  futureHumidity.text(`Humidity: ${humidity}%`);
  fiveCards.append(
    futureDate,
    futureImg,
    futureTemp,
    futureWind,
    futureHumidity
  );
}
//On click function to draw back weather data from previous searches
$(document).on("click", ".previous-search", function () {
  let clickedPriorSearch = $(this);
  returnWeatherData(clickedPriorSearch.text());
});