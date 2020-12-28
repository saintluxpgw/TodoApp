const weather = document.querySelector(".js-weather"),
    weatherIcon = document.querySelector(".js-weather_icon");

const API_KEY = config.MY_KEY;
const COORDS = 'coords';

function getIcon(iconID){
    // icon source = https://erikflowers.github.io/weather-icons/
    const currentIcon = document.createElement("icon");
    const iconList = {
        '01d' : "wi-day-sunny",
        '02d' : "wi-day-cloudy",
        '03d' : "wi-cloud",
        '04d' : "wi-cloudy",
        '09d' : "wi-rain",
        '10d' : "wi-day-rain",
        '11d' : "wi-thunderstorm",
        '13d' : "wi-snow",
        '50d' : "wi-fog",
        '01n' : "wi-night-clear",
        '02n' : "wi-night-alt-cloudy",
        '03n' : "wi-cloud",
        '04n' : "wi-cloudy",
        '09n' : "wi-rain",
        '10n' : "wi-rain",
        '11n' : "wi-thunderstorm",
        '13n' : "wi-night-alt-snow",
        '50n' : "wi-night-fog"
    };
    /*
    key 값으로 숫자가 먼저 오면 iconList.iconID시 오류남
    참고 : JavaScript Object[‘key’] vs Object.key 차이
    https://medium.com/sjk5766/javascript-object-key-vs-object-key-%EC%B0%A8%EC%9D%B4-3c21eb49b763
    */
    const iconClass = iconList[iconID];
    currentIcon.classList.add('wi', iconClass);
    weatherIcon.appendChild(currentIcon);
}

function getWeather(lat, lon){
    //fecth는 서버에 요청을 보내고 자료를 받아옴
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`).then(function(response) {
        return response.json();
    }).then(function(json){
        const temp = json.main.temp;
        const place = json.name;
        const tempSpan = document.createElement('span');
        const placeSpan = document.createElement('span');
        tempSpan.classList.add("temp");
        tempSpan.innerText = `${temp}°`;
        placeSpan.classList.add("place");
        placeSpan.innerText = ` @ ${place}`;
        weather.appendChild(tempSpan);
        weather.appendChild(placeSpan);

        const icon = json.weather[0].icon;
        getIcon(icon);
    })
}

function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSuccess(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(lantitude, longitude);
}

function handleGeoError(){
    console.log('can\'t access geo location');
}

function askForCoords(){
    console.log(navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError));
}

function loadCoords(){
    const loadedCoords = localStorage.getItem(COORDS);
    if (loadedCoords === null) {
        askForCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords)
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }

}

function init(){
    loadCoords();
}
init();