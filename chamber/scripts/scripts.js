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
