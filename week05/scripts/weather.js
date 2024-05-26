// Selecting HTML elements in the document
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// OpenWeatherMap API URL
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=imperial&appid=5f00e39a78a9a5377b98ed1479277065';

// Define an asynchronous function to fetch data from the API
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); 
      displayResults(data); 
      throw new Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

function displayResults(data) {

  currentTemp.innerHTML = `${data.main.temp.toFixed(1)}&deg;F`;

  // the weather icon 
  const iconSrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
  weatherIcon.setAttribute('src', iconSrc);
  weatherIcon.setAttribute('alt', data.weather[0].description);
//   weatherIcon.setAttribute('title', data.weather[0].description);

  captionDesc.textContent = data.weather[0].description;
}

apiFetch();
