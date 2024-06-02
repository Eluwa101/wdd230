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
