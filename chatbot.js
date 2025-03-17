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

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.addMessage('Generating response...', 'bot');

        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    message,
                    context: localStorage.getItem('questionData') // Send study data as context
                })
            });

            const data = await response.json();
            
            // Remove loading message
            this.messagesContainer.removeChild(this.messagesContainer.lastChild);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            if (data.message) {
                // Format the message for display
                const formattedMessage = this.formatMessage(data.message);
                this.addMessage(formattedMessage, 'bot');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Chat error:', error);
            // Remove "Thinking..." message if it exists
            if (this.messagesContainer.lastChild.textContent === 'Thinking...') {
                this.messagesContainer.removeChild(this.messagesContainer.lastChild);
            }
            this.addMessage(`Error: ${error.message}. Please try again.`, 'bot');
        }
    }

    formatMessage(text) {
        // Preserve formatting but clean up excessive whitespace
        return text
            .replace(/\n{4,}/g, '\n\n\n')
            .trim();
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
