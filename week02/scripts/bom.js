// Select elements
const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// Add click event listener to button
button.addEventListener('click', () => {
    // Check if input is not blank
    if (input.value.trim() !== '') {
        // Create li element
        const listItem = document.createElement('li');
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.setAttribute('aria-label', 'Remove ' + input.value);
        
        // Populate li element's textContent with input value
        listItem.textContent = input.value;
        
        // Append delete button to li element
        listItem.appendChild(deleteButton);
        
        // Append li element to the unordered list
        list.appendChild(listItem);
        
        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            listItem.remove(); // Remove li element when delete button is clicked
        });
        
        // Send focus to input element
        input.focus();
        
        // Clear input value
        input.value = '';
    } else {
        // Input is blank, provide a message or return focus to input field
        input.focus();
    }
});
