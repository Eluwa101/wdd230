// hamburger button
const hamButton = document.querySelector('#menu');
const navigation = document.querySelector('.navigation');

hamButton.addEventListener('click', () => {
  navigation.classList.toggle('open'); 
	
  hamButton.classList.toggle('open');
});

// Get the theme toggle button
const themeToggle = document.getElementById('theme-toggle');

// Function to toggle between Light mode and Dark mode
function toggleTheme() {
  document.body.classList.toggle('dark-mode'); 

  const currentTheme = document.body.classList.contains('dark-mode') ? 'Dark Mode' : 'Light Mode';
  themeToggle.textContent = `Toggle ${currentTheme}`;
}

themeToggle.addEventListener('click', toggleTheme);



// Dates Js
document.addEventListener("DOMContentLoaded", function() {
    function updateElementWithDate(elementId, date) {
        var element = document.getElementById(elementId);
        element.textContent = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    updateElementWithDate("year", new Date());

    updateElementWithDate("lastModified", new Date(document.lastModified));
});

// Visits

// Here getting the element
const visitsElement = document.getElementById('visits');
function updateVisitCounter() {
    let visitCount = localStorage.getItem('visitCount');

// If no visit count exists, make it to be 0
    if (!visitCount) {
        visitCount = 0;
    }
    // otherwise
    visitCount++;

    // do the setitem in localStorage
    localStorage.setItem('visitCount', visitCount);
    visitsElement.textContent = visitCount;
}
updateVisitCounter();


// for the weather condition update
// select HTML elements in the document
const cityElement = document.querySelector('#city');
const weatherElement = document.querySelector('#weather');
const tempElement = document.querySelector('#temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// can change the city when moving to new loaction
const apiKey = '5f00e39a78a9a5377b98ed1479277065';
const lat = 7.78;
const lon = 4.55;
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

async function apiFetch() {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            displayResults(data);
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        console.error(error);
    }
}

function displayResults(weatherData) {
    const city = weatherData.name;
    const temp = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;

    cityElement.textContent = city;
    weatherElement.textContent = weatherDescription;
    tempElement.textContent = `${temp} °F`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = weatherDescription;
    captionDesc.textContent = `Weather in ${city}`;
}

apiFetch();
