const chatContent = document.getElementById('chat-content');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleUserInput();
    }
});

let botData = [];
let currentMenu = null; // Initialize currentMenu variable

// Load bot.json data using Fetch API
fetch('static/bot.json')
    .then(response => response.json())
    .then(data => {
        botData = data;
    })
    .catch(error => {
        console.error('Error loading bot data:', error);
    });

// ...

function handleUserInput() {
    const userMessage = userInput.value;
    displayMessage(userMessage, 'user-message');

    // Process user input and find a suitable response from botData
    const response = findResponse(userMessage);

    if (response) {
        if (response.response_type === 'menu') {
            displayMessage(response.bot_response, 'bot-message');
            renderMenuButtons(response.submenu, response.bot_response);
        } else {
            displayMessage(response.bot_response, 'bot-message');
        }
    } else {
        displayMessage("I'm sorry, I don't understand.", 'bot-message');
    }

    userInput.value = ''; // Clear input field
    scrollToBottom(); // Scroll to the bottom
}

// ...

function renderMenuButtons(menu, triggerMessage) {
    // ...

    // Scroll to the bottom to show the new messages and buttons
    scrollToBottom();
}

// ...

function scrollToBottom() {
    chatContent.scrollTop = chatContent.scrollHeight;
}

// ...


function findResponse(userInput) {
    const matchedResponse = botData.find(responseData => {
        return responseData.user_input.some(keyword => userInput.toLowerCase() === keyword.toLowerCase());
    });

    return matchedResponse;
}

function displayMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = message;
    chatContent.appendChild(messageElement);

    // Scroll to the bottom to show the new messages
    chatContent.scrollTop = chatContent.scrollHeight;
}

function createButton(label, clickHandler) {
    const button = document.createElement('button');
    button.textContent = label;
    button.addEventListener('click', clickHandler);
    return button;
}

function renderMenuButtons(menu, triggerMessage) {
    // ... (existing code)

    // Render menu buttons in a separate container
    const menuButtonContainer = document.createElement('div');
    menuButtonContainer.className = 'menu-button-container';
    menu.forEach(menuItem => {
        const button = createButton(menuItem.user_input, function() {
            // Handle button click
            displayMessage(menuItem.bot_response, 'bot-message');
            if (menuItem.submenu) {
                renderMenuButtons(menuItem.submenu, menuItem.bot_response);
            }
        });

        // Create a div for each button to display them on separate lines
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'menu-button-wrapper';
        buttonWrapper.appendChild(button);
        menuButtonContainer.appendChild(buttonWrapper);
    });

    chatContent.appendChild(menuButtonContainer);

    // Append a blank line after the menu buttons
    const blankLine = document.createElement('div');
    blankLine.className = 'blank-line';
    chatContent.appendChild(blankLine);

    // Scroll to the bottom to show the new messages, buttons, and blank line
    chatContent.scrollTop = chatContent.scrollHeight;
}

function clearMenuButtons() {
    // Remove menu button container
    const menuButtonContainer = chatContent.querySelector('.menu-button-container');
    if (menuButtonContainer) {
        menuButtonContainer.remove();
    }

    // Remove "Back" button if exists
    const backButton = chatContent.querySelector('button');
    if (backButton && backButton.textContent.toLowerCase() === 'back') {
        backButton.remove();
    }

    // Remove "Exit" button if exists
    const exitButton = chatContent.querySelector('button');
    if (exitButton && exitButton.textContent.toLowerCase() === 'exit') {
        exitButton.remove();
    }
}
