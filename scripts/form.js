document.querySelector('.myform').addEventListener('submit', function(event) {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;
    var passwordError = document.getElementById('passwordError');

    if (password !== confirmPassword) {
        event.preventDefault();
        passwordError.style.display = 'block';
        passwordError.textContent = 'Your Passwords do not match';
        document.getElementById('password').focus();
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
        console.log(`passwordError: ${password} should be matching down here too.`);
    } else {
        passwordError.style.display = 'none';
    }
});

function updateRating(value) {
    document.getElementById('ratingDisplay').textContent = value;
}

function togglePassword(fieldId, iconId) {
    var passwordField = document.getElementById(fieldId);
    var icon = document.getElementById(iconId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.textContent = '🕶️';
    } else {
        passwordField.type = 'password';
        icon.textContent = '👀';
    }
}

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