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