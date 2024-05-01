document.addEventListener("DOMContentLoaded", function() {
    function updateElementWithDate(elementId, date) {
        var element = document.getElementById(elementId);
        element.textContent = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    updateElementWithDate("year", new Date());

    updateElementWithDate("lastModified", new Date(document.lastModified));
});
