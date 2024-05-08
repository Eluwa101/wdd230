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
