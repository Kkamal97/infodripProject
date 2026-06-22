// --- EXISTING SELECTION TARGET ARRAYS ---
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');
const welcomeContainer = document.getElementById('welcomeContainer');
const clearChatBtn = document.getElementById('clearChat');

// --- NEW FUNCTIONAL ROUTE TRIGGERS ---
const homeBtn = document.getElementById('homeBtn');
const newChatBtn = document.getElementById('newChatBtn');
const settingsBtn = document.getElementById('settingsBtn');
const mediaBtn = document.getElementById('mediaBtn');
const mediaMenu = document.getElementById('mediaMenu');

// Toggles Sidebar view bounds
toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

// Auto scaling text areas
function autoResizeTextArea(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}

function useSuggestedPrompt(text) {
    userInput.value = text;
    sendMessage();
}

/* =========================================================
   NEXT STEP INTERACTIVE FLOW MANAGEMENT FUNCTIONS
   ========================================================= */

// 1. Home Action Trigger: Resets frame and brings user back to Dashboard
homeBtn.addEventListener('click', () => {
    clearChatBtn.click();
    showToastNotification("Returned to Home Dashboard view setup.");
});

// 2. New Chat Setup: Launches overlay prompt with modal persona paths
newChatBtn.addEventListener('click', () => {
    openModal('newChatModal');
});

function initiateChatMode(personaName) {
    closeModal('newChatModal');
    clearChatBtn.click();
    appendMessage('ai', `Workspace context has been updated to **${personaName}**. Send a message to start processing.`);
}

// 3. Settings Interface: Launches custom backend tuning options modal window
settingsBtn.addEventListener('click', () => {
    openModal('settingsModal');
});

function saveSettings() {
    closeModal('settingsModal');
    showToastNotification("Configuration options saved successfully!");
}

// 4. Insert Media Content Dropdown Toggle Menu
mediaBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid instant closing from window click listener below
    mediaMenu.classList.toggle('show');
});

function handleMediaSelect(mediaType) {
    mediaMenu.classList.remove('show');
    // Mimic payload append behavior step option
    showToastNotification(`${mediaType} pipeline selected! Connected target uploaded payload context.`);
    userInput.value += ` [Attached ${mediaType} Source File] `;
    userInput.focus();
}

// Universal Window Helpers for UI Overlays
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Close Dropdowns if user clicks anywhere outside elements
window.addEventListener('click', () => {
    mediaMenu.classList.remove('show');
});


/* =========================================================
   CORE STREAM CHAT FLOW ENGINE
   ========================================================= */
function appendMessage(sender, text) {
    if (welcomeContainer) welcomeContainer.style.display = 'none';

    const messageRow = document.createElement('div');
    messageRow.classList.add('message-row', sender === 'user' ? 'user-row' : 'ai-row');

    const avatarIcon = sender === 'user' ? '<i class="fa-regular fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    
    messageRow.innerHTML = `
        <div class="message-content">
            <div class="msg-avatar">${avatarIcon}</div>
            <div class="msg-text">${text}</div>
        </div>
    `;
    chatMessages.appendChild(messageRow);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';
    autoResizeTextArea(userInput);

    const typingIndicator = appendPlaceholderIndicator();

    setTimeout(() => {
        typingIndicator.remove();
        const mockResponse = "This is a frontend response. Customize the fetch handler script block inside `app.js` when tying in live AI endpoint logic.";
        appendMessage('ai', mockResponse);
    }, 1000);
}

function appendPlaceholderIndicator() {
    const indicatorRow = document.createElement('div');
    indicatorRow.classList.add('message-row', 'ai-row');
    indicatorRow.innerHTML = `
        <div class="message-content">
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-text" style="color: var(--text-muted);"><i class="fa-solid fa-ellipsis fa-bounce"></i> Processing Request...</div>
        </div>
    `;
    chatMessages.appendChild(indicatorRow);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicatorRow;
}

clearChatBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    chatMessages.appendChild(welcomeContainer);
    welcomeContainer.style.display = 'block';
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Temporary feedback element system
function showToastNotification(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = 'var(--primary-color)';
    toast.style.color = '#131314';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '1000';
    toast.style.fontSize = '0.9rem';
    toast.style.fontWeight = '500';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
