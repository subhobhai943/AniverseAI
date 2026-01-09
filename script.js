document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const quickPrompts = document.getElementById('quick-prompts');
    
    // Modals
    const settingsBtn = document.getElementById('settings-btn');
    const historyBtn = document.getElementById('history-btn');
    const settingsModal = document.getElementById('settings-modal');
    const historyModal = document.getElementById('history-modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    // Auto-focus input
    userInput.focus();

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    historyBtn.addEventListener('click', () => historyModal.style.display = 'flex');
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
            historyModal.style.display = 'none';
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.style.display = 'none';
        if (e.target === historyModal) historyModal.style.display = 'none';
    });

    // Global function for quick prompts
    window.usePrompt = (text) => {
        userInput.value = text;
        sendMessage();
    };

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        userInput.value = '';
        
        // Hide quick prompts once chat starts
        quickPrompts.style.display = 'none';

        // Add loading indicator
        const loadingId = addLoadingMessage();

        try {
            // Call Netlify Function
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Remove loading
            removeMessage(loadingId);

            if (data.error) {
                addMessage("Sorry, I encountered an error: " + data.error, 'ai');
            } else {
                addMessage(data.reply, 'ai');
            }

        } catch (error) {
            removeMessage(loadingId);
            addMessage("Sorry, I couldn't connect to the server.", 'ai');
            console.error('Error:', error);
        }
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}-message`;
        
        const avatarUrl = sender === 'ai' 
            ? 'https://ui-avatars.com/api/?name=AniVerse+AI&background=FF5722&color=fff'
            : 'https://ui-avatars.com/api/?name=User&background=333&color=fff';

        // Convert newlines to breaks for AI
        const formattedText = text.replace(/\n/g, '<br>');

        div.innerHTML = `
            ${sender === 'ai' ? `<div class="message-avatar"><img src="${avatarUrl}" alt="AI"></div>` : ''}
            <div class="message-content">${formattedText}</div>
            ${sender === 'user' ? `<div class="message-avatar"><img src="${avatarUrl}" alt="User"></div>` : ''}
        `;
        
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addLoadingMessage() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'message ai-message';
        div.innerHTML = `
            <div class="message-avatar"><img src="https://ui-avatars.com/api/?name=AniVerse+AI&background=FF5722&color=fff" alt="AI"></div>
            <div class="message-content">Thinking...</div>
        `;
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return id;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});