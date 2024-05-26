// Define baseURL and linksURL variables
const baseURL = 'https://eluwa101.github.io/wdd230/';
const linksURL = 'https://eluwa101.github.io/wdd230/data/links.json';

async function getLinks() {
  try {
    const response = await fetch(linksURL);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    console.log(data); 
    displayLinks(data.weeks);
  } catch (error) {
    console.error('Error:', error);
  }
}

getLinks();

// Define displayLinks function to build activity links
function displayLinks(weeks) {
  const navigation = document.querySelector('.navigation');
  weeks.forEach((weekObj) => {
    const weekItem = document.createElement('li');
    const weekLink = document.createElement('a');
    weekLink.href = '#';

    weekLink.textContent = `${weekObj.week}:`;
    weekItem.appendChild(weekLink);

    weekObj.links.forEach((linkObj) => {
      const activityLink = document.createElement('a');
      activityLink.href = baseURL + linkObj.url;
      activityLink.textContent = linkObj.title;
      
      weekItem.appendChild(activityLink);
      weekItem.appendChild(document.createTextNode('|'));
    });
    weekItem.removeChild(weekItem.lastChild); // Remove last pipe character
    navigation.appendChild(weekItem);
  });
}
