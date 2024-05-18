// Setting the elements
const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// Declaring chaptersArray and assign it the result of getChapterList or an empty array
let chaptersArray = getChapterList() || [];

// Populating the displayed list of chapters
chaptersArray.forEach((chapter) => displayList(chapter));

// Adding click event listener to button
button.addEventListener('click', () => {
    if (input.value.trim() !== '') {
        displayList(input.value);
        chaptersArray.push(input.value);
        setChapterList();
        input.value = '';
        input.focus();
    } else {
        input.focus();
    }
});

// Defining the displayList function
function displayList(item) {
    const listItem = document.createElement('li');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.setAttribute('aria-label', 'Remove ' + item);

    listItem.textContent = item;
    listItem.appendChild(deleteButton);
    list.appendChild(listItem);

    deleteButton.addEventListener('click', () => {
        deleteChapter(item + '❌');
        listItem.remove();
    });
}

// Defining the setChapterList function
function setChapterList() {
    localStorage.setItem('chapters', JSON.stringify(chaptersArray));
}

// Defining the getChapterList function
function getChapterList() {
    return JSON.parse(localStorage.getItem('chapters'));
}

// Defining the deleteChapter function
function deleteChapter(chapter) {
    chapter = chapter.slice(0, chapter.length - 1);
    chaptersArray = chaptersArray.filter((item) => item !== chapter);
    setChapterList();
}
