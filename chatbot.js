class ChatBot {
    constructor() {
        this.messagesContainer = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-message');
        
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Add initial greeting
        this.addMessage("Hi! I'm your study assistant. I can help analyze your progress and answer questions about your learning journey.", 'bot');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            const botResponse = data.choices[0].message.content;
            this.addMessage(botResponse, 'bot');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot
const chatbot = new ChatBot();
