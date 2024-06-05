// JavaScript code for handling the hamburger menu
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    hamburgerBtn.addEventListener('click', function () {
        mainNav.classList.toggle('active');
        hamburgerIcon.style.display = hamburgerIcon.style.display === 'none' ? 'inline-block' : 'none';
        closeIcon.style.display = closeIcon.style.display === 'none' ? 'inline-block' : 'none';
    });
});

// JavaScript code for getting the last modified date of the page
const lastModified = document.lastModified;
document.getElementById('last-modified').textContent = lastModified;


document.addEventListener('DOMContentLoaded', () => {
    const visitMessage = document.getElementById('visit-message');
    const lastVisit = localStorage.getItem('lastVisit');
    const currentVisit = new Date();
    
    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const lastVisitDate = new Date(lastVisit);
        const timeDifference = currentVisit - lastVisitDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        } else if (daysDifference === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        } else {
            visitMessage.textContent = `You last visited ${daysDifference} days ago.`;
        }
    }
    
    localStorage.setItem('lastVisit', currentVisit);
    
    const lastModified = document.getElementById('last-modified');
    lastModified.textContent = document.lastModified;
});

document.addEventListener('DOMContentLoaded', () => {
    const timestamp = document.getElementById('timestamp');
    const now = new Date();
    timestamp.value = now.toISOString();
});



// directory


document.addEventListener("DOMContentLoaded", () => {
    const gridButton = document.querySelector("#grid");
    const listButton = document.querySelector("#list");
    const display = document.querySelector("article");

    gridButton.addEventListener("click", () => {
        display.classList.add("grid");
        display.classList.remove("list");
    });

    listButton.addEventListener("click", showList);

    function showList() {
        display.classList.add("list");
        display.classList.remove("grid");
    }

    fetch("scripts/members.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(member => {
                const section = document.createElement("section");
                section.innerHTML = `
                    <img src="images/${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank">The Website</a>
                    <p>Membership Level: ${member.membershipLevel}</p>
                `;
                display.appendChild(section);
            });
        });
});


document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById('banner');
    const advertSpotlight = document.getElementById('advert-spotlight');
    const today = new Date().getDay();
    console.log(today);

    if (today < 1 || today > 3) {
        banner.style.display = 'none';
    }

    // Function to close the banner
    window.closeBanner = () => {
        banner.style.display = 'none';
    };

    fetch('scripts/members.json')
        .then(response => response.json())
        .then(data => {
            const eligibleMembers = data.filter(member => ['Silver', 'Gold'].includes(member.membershipLevel));
            const shuffledMembers = eligibleMembers.sort(() => 0.5 - Math.random());
            const selectedMembers = shuffledMembers.slice(0, 3);

            selectedMembers.forEach(member => {
                const section = document.createElement('section');
                section.innerHTML = `
                    <img src="images/${member.image}" alt="${member.name}">
                    <h3>${member.name}</h3>
                    <p>${member.address}</p>
                    <p>${member.phone}</p>
                    <a href="${member.website}" target="_blank">The Website</a>
                    <p>Membership Level: ${member.membershipLevel}</p>
                `;
                advertSpotlight.appendChild(section);
            });
        })
        .catch(error => console.error('Error fetching member data:', error));
});


// forecast and weather data constants

const cityElement = document.querySelector('#city');
const weatherElement = document.querySelector('#weather');
const tempElement = document.querySelector('#temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');
const forecastContainer = document.querySelector('#forecast-container');

// API details
const apiKey = '5f00e39a78a9a5377b98ed1479277065';
const lat = 7.78;
const lon = 4.55;
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

async function apiFetch() {
    try {
        const weatherResponse = await fetch(weatherUrl);
        const forecastResponse = await fetch(forecastUrl);

        if (weatherResponse.ok && forecastResponse.ok) {
            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();
            displayResults(weatherData, forecastData);
        } else {
            throw new Error('Weather or forecast data fetch failed');
        }
    } catch (error) {
        console.error(error);
    }
}

function displayResults(weatherData, forecastData) {
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

    // Display the 3-day forecast
    displayForecast(forecastData);
}

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    const forecastList = forecastData.list;

    for (let i = 0; i < forecastList.length; i += 8) {
        const forecast = forecastList[i];
        const date = new Date(forecast.dt_txt);
        const temp = forecast.main.temp;
        const weatherDescription = forecast.weather[0].description;
        const iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast-day');
        forecastElement.innerHTML = `
            <h4>${date.toLocaleDateString()}</h4>
            <img src="${iconUrl}" alt="${weatherDescription}">
            <p>${weatherDescription}</p>
            <p>${temp} °F</p>
        `;

        forecastContainer.appendChild(forecastElement);

        // Stop after 3 days
        if (forecastContainer.childElementCount >= 3) {
            break;
        }
    }
}

apiFetch();

