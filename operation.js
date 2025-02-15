let cities = [
    {
        arName:"ألاردن",
        EName:"JO",
        cName:"JO-AM"
    },
    {
        arName:"ألسعودية",
        EName:"SA",
        cName:"Makkah al Mukarramah"
    },
    {
        arName:"قطر",
        EName:"Qa",
        cName:"Ad Dawḩah"
    },
    {
        arName:"الكويت",
        EName:"KW",
        cName:"KW-KU"
    }
];

for(let city of cities){
    const content = `
        <option>${city.arName}</option>
    `
    document.getElementById("country").innerHTML += content;
}

window.onload = function() {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
        document.getElementById("country").value = storedCity;
        updateCityDetails(storedCity);
    }
}

document.getElementById("country").addEventListener("change", function(){
    document.getElementById("city-name").innerHTML = this.value;
    let cityName = "";
    let cn = "";
    for(let city of cities){
        if(city.arName == this.value){
            cityName = city.EName;
            cn = city.cName;
        }
    }
    localStorage.setItem("selectedCity", this.value);
    getPrayersTime(cityName, cn);
    updateCityDetails(this.value);
});

window.onload = function() {
    const storedCity = localStorage.getItem("selectedCity");
    if (storedCity) {
        document.getElementById("country").value = storedCity;
        document.getElementById("city-name").innerHTML = storedCity;
        let cityName = "";
        let cn = "";
        for (let city of cities) {
            if (city.arName === storedCity) {
                cityName = city.EName;
                cn = city.cName;
            }
        }
        getPrayersTime(cityName, cn);
        updateCityDetails(storedCity);
    }
}


function updateCityDetails(cityArName) {
    let cityName = "";
    let cn = "";
    for (let city of cities) {
        if (city.arName === cityArName) {
            cityName = city.EName;
            cn = city.cName;
        }
    }
    getPrayersTime(cityName, cn);
}

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById("current-time").innerText = `الوقت الحالي: ${timeString}`;
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

function getPrayersTime(country, cityName) {
    let params = {
        country: country,
        city: cityName
    };

    axios.get('https://api.aladhan.com/v1/calendarByCity', { params: params })
        .then(function (response) {
            const timings = response.data.data[0].timings;
            fillTime("fajir-time", timings.Fajr.replace(/\s*\(.*?\)/g, ''));
            fillTime("sun-time", timings.Sunrise.replace(/\s*\(.*?\)/g, ''));
            fillTime("dhur-time", timings.Dhuhr.replace(/\s*\(.*?\)/g, ''));
            fillTime("aser-time", timings.Asr.replace(/\s*\(.*?\)/g, ''));
            fillTime("sunset-time", timings.Sunset.replace(/\s*\(.*?\)/g, ''));
            fillTime("isha-time", timings.Isha.replace(/\s*\(.*?\)/g, ''));

            const readDate = response.data.data[0].date.readable;
            const weekDay = response.data.data[0].date.hijri.weekday.ar;
            const date = weekDay + " " + readDate;
            document.getElementById("date").innerHTML = date;

            console.log(response.data.data[0]);
        })
        .catch(function (error) {
            console.log(error);
        });
}

getPrayersTime("JO", "JO-AM");

function fillTime(id, time) {
    document.getElementById(id).innerHTML = time;
}