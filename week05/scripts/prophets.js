const cards = document.querySelector('#cards');

const getProphetData = async () => {
    const response = await fetch('https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json');
    const data = await response.json();
    console.table(data.prophets);
    displayProphets(data.prophets);
};

getProphetData();

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        // Create elements
        const card = document.createElement('section');
        const fullName = document.createElement('h2');
        // const dob = document.createElement('p');
        const birth = document.createElement('p');
        const portrait = document.createElement('img');
        

        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        birth.textContent = `Date of Birth: ${prophet.birthdate}\nPlace of Birth: ${prophet.birthplace}`;

        

        portrait.setAttribute('src', prophet.imageurl);
        portrait.setAttribute('alt', `Portrait of Prophet ${prophet.name} ${prophet.lastname}`);
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '200');
        portrait.setAttribute('height', '250');
        

        card.appendChild(fullName);
        card.appendChild(birth);
        // card.appendChild(birthPlace);
        card.appendChild(portrait);
        
        // Append the card to the cards container
        cards.appendChild(card);
    });
};
