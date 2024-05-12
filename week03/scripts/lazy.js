document.addEventListener("DOMContentLoaded", function() {
    const footer = document.getElementById('lastModified');
    const lastModified = document.lastModified;
    footer.textContent = `${lastModified}`;
});