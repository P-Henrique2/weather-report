const apiKey = "7de93540bec360d86d9986082e3e6fc1"; // <-- Replace with your API key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherDiv = document.getElementById('weather');
const forecastDiv = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    getForecast(city);
  }
});

// Fetch current weather
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      weatherDiv.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    const { main, weather, name } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    weatherDiv.innerHTML = `
      <h2>${name}</h2>
      <img class="weather-icon" src="${iconUrl}" alt="${weather[0].description}">
      <p>Temperature: ${main.temp} °C</p>
      <p>Humidity: ${main.humidity}%</p>
      <p>Condition: ${weather[0].description}</p>
    `;

    setBackground(weather[0].main);

  } catch (error) {
    weatherDiv.innerHTML = `<p>Error fetching weather data</p>`;
  }
}

// Fetch 5-day forecast
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== "200") {
      forecastDiv.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    // OpenWeatherMap gives 3-hour intervals; we'll pick 12:00 PM each day
    const forecastByDay = {};
    data.list.forEach(item => {
      if (item.dt_txt.includes("12:00:00")) {
        const date = item.dt_txt.split(" ")[0];
        forecastByDay[date] = item;
      }
    });

    forecastDiv.innerHTML = '';
    Object.values(forecastByDay).forEach(item => {
      const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
      const condition = item.weather[0].main;
      forecastDiv.innerHTML += `
        <div class="forecast-day" style="background-color:${getBgColor(condition)}">
          <h4>${item.dt_txt.split(" ")[0]}</h4>
          <img src="${iconUrl}" alt="${item.weather[0].description}">
          <p>${item.main.temp} °C</p>
          <p>${item.weather[0].description}</p>
        </div>
      `;
    });

  } catch (error) {
    forecastDiv.innerHTML = `<p>Error fetching forecast data</p>`;
  }
}

// Dynamic background for current weather
function setBackground(condition) {
  let color = '#e0f7fa';
  if (condition === 'Clear') color = '#f7d794';
  else if (condition === 'Clouds') color = '#dfe6e9';
  else if (condition === 'Rain') color = '#74b9ff';
  else if (condition === 'Snow') color = '#dff9fb';
  else if (condition === 'Thunderstorm') color = '#636e72';

  document.body.style.backgroundColor = color;
}

// Dynamic color for forecast cards
function getBgColor(condition) {
  if (condition === 'Clear') return '#f7b731';
  else if (condition === 'Clouds') return '#7f8fa6';
  else if (condition === 'Rain') return '#3c40c6';
  else if (condition === 'Snow') return '#dff9fb';
  else if (condition === 'Thunderstorm') return '#2f3640';
  else return '#576574';
}