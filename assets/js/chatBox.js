const chatButton = document.getElementById('chat-button');
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const chatIcon = document.querySelector('.chat-icon');
const closeIcon = document.querySelector('.close-icon');

const autoResponses = {
    'bonjour': 'Bonjour! Comment puis-je vous aider?',
    'hello': 'Bonjour! Comment puis-je vous aider?',
    'salut': 'Salut! Comment puis-je vous aider?',
    'contact': 'Vous pouvez nous contacter à contact@example.com',
    'horaires': 'Nous sommes ouverts du lundi au vendredi de 9h à 18h',
    'prix': 'Nos tarifs commencent à partir de 49€. Pour plus d\'informations, visitez notre page tarifs.',
    'merci': 'Je vous en prie! N\'hésitez pas si vous avez d\'autres questions.',
};

// Gestion du bouton chat
chatButton.addEventListener('click', () => {
    chatContainer.classList.toggle('active');
    chatIcon.style.display = chatContainer.classList.contains('active') ? 'none' : 'block';
    closeIcon.style.display = chatContainer.classList.contains('active') ? 'block' : 'none';
    if (chatContainer.classList.contains('active')) {
        messageInput.focus();
    }
});

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function autoReply(message) {
    const lowercaseMessage = message.toLowerCase();
    let replied = false;

    for (const [key, response] of Object.entries(autoResponses)) {
        if (lowercaseMessage.includes(key)) {
            setTimeout(() => addMessage(response), 500);
            replied = true;
            break;
        }
    }

    if (!replied) {
        setTimeout(() => addMessage('Désolé, je ne comprends pas votre demande. Pouvez-vous reformuler?'), 500);
    }
}

function handleMessage() {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, true);
        autoReply(message);
        messageInput.value = '';
    }
}

sendButton.addEventListener('click', handleMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleMessage();
    }
});