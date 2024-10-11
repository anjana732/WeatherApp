let btn = document.getElementById('fetch-data');
console.log(btn)
const apiKey = "4e4badfe1b40ae8b01ddedeca3b8d667";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const url = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
let inputBox = document.getElementById('city-input')
let graphData = []
// const today = new Date()
// console.log(today);
// let day = document.getElementById('day')
// day.innerHTML = today.getDate();
// let dt = document.getElementById('date')
// dt.innerHTML = today.getDay()

const today = new Date();

// Format the day and date
const options = { weekday: 'short', day: 'numeric', month: 'short' };
const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(today);

console.log("formatted date",formattedDate);

let day = document.getElementById('day')
day.innerHTML = formattedDate;


async function forecast() {
    city = "Pune"
    try {
        let response = await fetch(url + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Network Response");

        }
        let data = await response.json();
        console.log("forcast data", data.list);
        let list = data.list;
        for (let index = 0; index < list.length; index++) {
            console.log("inside for loop")
            const currentDate = new Date();
            let apiDate = new Date((data.list[index].dt) * 1000);
            let temp = list[index].main.temp;
            console.log(temp);
            console.log("API Date: ", apiDate.getDate());
            console.log("System Date", currentDate.getDate());
            if(apiDate.getDate() == currentDate.getDate()){
                continue;
            }
            console.log(list[index]);

            graphData.push([apiDate.toLocaleDateString(), temp])
            index = index + 7

        }
        console.log("Graph Data: ",graphData);
    } catch (error) {
        console.log(error)
    }
}
forecast();
function drawGraph() {
    var dataSet = anychart.data.set(graphData);
    var chart = anychart.line();
    chart.xAxis().title("Date");
    chart.yAxis().title("Temperature");

    var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
    chart.line(firstSeriesData);

    chart.legend().enabled(true);
    chart.listen("chartdraw", function() {
        console.log("Chart drawn");
    });

    chart.listen("error", function(e) {
        console.log("Error drawing chart:", e);
    });
    chart.container("container");
    chart.draw();
}

async function main() {
    await forecast();
    drawGraph();
}
main();

console.log("Chart Data: ",graphData);
async function fetchData() {
    let city = document.getElementById('city-input').value;
    console.log(city);
    city = city ? city : "Patna";
    console.log("Function called");
    try {
        let response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error("Network Reponse was not OK");
        }
        data = await response.json();
        console.log("API Data",data);
        let location = document.getElementById('location');
        location.innerHTML = `${city}<span>,<span> ${data.sys.country}`;
        let temperature = document.getElementById('temperature');
        temperature.innerHTML = `${Math.round(data.main.temp)}°C`;
        let feelsLike = document.getElementById('feels-like')
        feelsLike.innerHTML = `${Math.round(data.main.feels_like)}°C`;
        let humidity = document.getElementById('humidity');
        humidity.innerHTML = ` ${data.main.humidity}%`;
        let windSpeed = document.getElementById('wind-speed');
        windSpeed.innerHTML = `${data.wind.speed} km/h`;
        console.log(data.wind.speed);
        let sunrise = document.getElementById('sunrise');
        let sunriseTime = new Date(data.sys.sunrise * 1000)
        console.log(sunriseTime);
        let sunRiseHour = sunriseTime.getHours();
        console.log("Hour:", sunRiseHour);
        let sunRiseMinute = sunriseTime.getMinutes();
        let sunRiseSec = sunriseTime.getSeconds();
        let formattedSunRise = `${sunRiseHour}:${sunRiseMinute}:${sunRiseSec}`;
        console.log(formattedSunRise);
        sunrise.innerHTML =formattedSunRise;
        let sunset = document.getElementById('sunset');
        let sunSetTime = new Date(data.sys.sunset * 1000);
        let formattedSunSet = `${sunSetTime.getHours()}:${sunSetTime.getMinutes()}:${sunSetTime.getSeconds()}`
        sunset.innerHTML = formattedSunSet;
        let desc = document.getElementById('description');
        desc.innerHTML = `${data.weather[0].description}`


    } catch (error) {
        console.log("wrong url");

    }

}
btn.addEventListener("click", fetchData);
inputBox.addEventListener('keypress', (e) => {
    console.log(e.key);
    if (e.key == "Enter") {
        fetchData();
    }
})

fetchData();