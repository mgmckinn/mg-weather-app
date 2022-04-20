const cityStore = {
"city": []
}

const apiKey = "9c8716aaec7ef646065188dbf4369ca6";

const loadPage = function (){
    const citiesFromLocalStorage =localStorage.getItem("cities");
    if (citiesFromLocalStorage != null) {
        cityStore = JSON.parse(citiesFromLocalStorage);

        $("#cityStore").html("");

        for (let i = 0; i < cityStore.city.length; i++) {
            const cityLi = $("<li class= 'box history-city'>");
            cityLi.html(cityStore.city[i]);
            $("#cityStore").append(cityLi);
        }

    }
}

const weather = null;

const populateWeather = function () {
    const cityDiv = $("#currentLocation");
    cityDiv.html($("#cityName").val().toUpperCase() + " (" + moment().format('L') + ") " + '<img src="' + currentWeather.currentIcon + '">');

    $("#cityTemp").html("Temp: " + currentWeather.currentTemp + '°F');
    $("#cityWind").html("Wind: " + currentWeather.currentWind + 'MPH');
    $("cityHumid").html("Humidity: " + currentWeather.currentHumid + '%');
    $("#cityUvi").html("UV Index: " + currentWeather.currentUvi);

    if(currentWeather.currentUvi < 3) {
        $("#cityUvi").addClass("uvi-purple");
    } else if (currentWeather.currentUvi >= 3 && currentWeather.currentUvi < 6) {
        $("#cityUvi").addClass("uvi-orange");
    } else {
        $("#cityUvi").addClass("uvi-red");
    }

    const numbers = ['One', 'Two', 'Three', 'Four', 'Five'];

    for (var i = 0; i < 5; i++) {
        $("#forecast" + numbers[i] + "Date").html(moment().add(i+1, 'days').format('L'));
        $("#forecast" + numbers[i] + "Icon").html('<img src="' + currentWeather.forecast[i].icon + '">');
        $("#forecast" + numbers[i] + "Temp").html("Temp: " + currentWeather.forecast[i].temp + '°F');
        $("#forecast" + numbers[i] + "Wind").html("Wind: " + currentWeather.forecast[i].wind + ' MPH');
        $("#forecast" + numbers[i] + "Humid").html("Humidity: " + currentWeather.forecast[i].humid + ' %');
    }
}

var getWeather = function () {
    var cityName = $("#cityName").val();
    var locationUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    const result = fetch(locationUrl, { method: "get" })
        .then(response => response.json())
        .then(data => {
            const lon = data.coord.lon;
            const lat = data.coord.lat;
            return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial");
        })
        .then(response => response.json())
        .catch(err => {
            console.log('Request failed', err)
        })
    result.then(onecall => {

        const weather = {
            "currentDate": onecall.current.dt,
            "currentIcon": "http://openweathermap.org/img/wn/" + onecall.current.weather[0].icon + ".png",
            "currentTemp": onecall.current.temp,
            "currentWind": onecall.current.wind_speed,
            "currentHumid": onecall.current.humidity,
            "currentUvi": onecall.current.uvi,
            "forecast": [{
                "date": onecall.daily[1].dt,
                "icon": "http://openweathermap.org/img/wn/" + onecall.daily[1].weather[0].icon + ".png",
                "temp": onecall.daily[1].temp.day,
                "wind": onecall.daily[1].wind_speed,
                "humid": onecall.daily[1].humidity,
            }, {
                "date": onecall.daily[2].dt,
                "icon": "http://openweathermap.org/img/wn/" + onecall.daily[2].weather[0].icon + ".png",
                "temp": onecall.daily[2].temp.day,
                "wind": onecall.daily[2].wind_speed,
                "humid": onecall.daily[2].humidity,
            }, {
                "date": onecall.daily[3].dt,
                "icon": "http://openweathermap.org/img/wn/" + onecall.daily[2].weather[0].icon + ".png",
                "temp": onecall.daily[3].temp.day,
                "wind": onecall.daily[3].wind_speed,
                "humid": onecall.daily[3].humidity,
            }, {
                "date": onecall.daily[4].dt,
                "icon": "http://openweathermap.org/img/wn/" + onecall.daily[5].weather[0].icon + ".png",
                "temp": onecall.daily[4].temp.day,
                "wind": onecall.daily[4].wind_speed,
                "humid": onecall.daily[4].humidity
            }, {
                "date": onecall.daily[5].dt,
                "icon": "http://openweathermap.org/img/wn/" + onecall.daily[5].weather[0].icon + ".png",
                "temp": onecall.daily[5].temp.day,
                "wind": onecall.daily[5].wind_speed,
                "humid": onecall.daily[5].humidity
            }]
        }

        currentWeather = weather;
        populateWeather();
    })
};

$(document).on("click", "button", function () {
    cityStore.city.push($("#cityName").val().toUpperCase());
    getWeather();
    localStorage.setItem("cities", JSON.stringify(cityStore));
    loadPage();

});

$(document).on("click", ".history-city", function () {
    $("#cityName").val($(this).text());
    getWeather();
});

loadPage();