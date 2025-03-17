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
        
        // Add resize functionality
        this.initializeResize();
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

        // Check if the message contains code blocks
        if (sender === 'bot' && text.includes('```')) {
            const parts = text.split('```');
            let formattedText = '';
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) {
                    // Regular text
                    formattedText += parts[i];
                } else {
                    // Code block
                    const code = parts[i].trim();
                    formattedText += `
                        <pre><code>${this.escapeHtml(code)}</code>
                            <button class="expand-code-btn" onclick="chatbot.showCodeModal(this)">⛶ Expand</button>
                        </pre>
                    `;
                }
            }
            messageDiv.innerHTML = formattedText;
        } else {
            messageDiv.textContent = text;
        }

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showCodeModal(button) {
        const code = button.previousElementSibling.textContent;
        const modal = document.createElement('div');
        modal.className = 'code-modal';
        modal.innerHTML = `
            <div class="code-modal-content">
                <div class="code-modal-buttons">
                    <button class="code-modal-button copy-btn" onclick="chatbot.copyCode(this)">Copy</button>
                    <button class="code-modal-button close-btn" onclick="chatbot.closeModal(this)">Close</button>
                </div>
                <pre><code>${code}</code></pre>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    copyCode(button) {
        const code = button.closest('.code-modal-content').querySelector('code').textContent;
        navigator.clipboard.writeText(code);
        button.textContent = 'Copied!';
        setTimeout(() => button.textContent = 'Copy', 2000);
    }

    closeModal(button) {
        const modal = button.closest('.code-modal');
        modal.remove();
    }

    initializeResize() {
        const chatSection = document.querySelector('.chat-section');
        const resizeHandle = document.querySelector('.resize-handle');
        let startY, startHeight;

        resizeHandle.addEventListener('mousedown', initDrag);

        function initDrag(e) {
            startY = e.clientY;
            startHeight = parseInt(document.defaultView.getComputedStyle(chatSection).height, 10);
            document.documentElement.addEventListener('mousemove', doDrag);
            document.documentElement.addEventListener('mouseup', stopDrag);
        }

        function doDrag(e) {
            const newHeight = startHeight + e.clientY - startY;
            const maxHeight = window.innerHeight * 0.7; // 70% of viewport height
            
            if (newHeight > 400 && newHeight <= maxHeight) { // Between min and max height
                chatSection.style.height = `${newHeight}px`;
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.style.height = `${newHeight - 120}px`;
            }
        }

        function stopDrag() {
            document.documentElement.removeEventListener('mousemove', doDrag);
            document.documentElement.removeEventListener('mouseup', stopDrag);
        }
    }
}

// Initialize chatbot
const chatbot = new ChatBot();
