const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const avatar = document.getElementById('avatar');

// Basic avatar animation
function blink() {
    avatar.src = 'avatar/blink.png';
    setTimeout(() => { avatar.src = 'avatar/idle.png'; }, 200);
}

// Add message to chat
function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Speak message
function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    synth.speak(utter);
}

// AI response using OpenAI API
async function getAIResponse(message) {
    // Replace YOUR_API_KEY with your OpenAI API key
    const apiKey = 'YOUR_API_KEY';
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: "user", content: message}]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Send message
sendBtn.addEventListener('click', async () => {
    const message = userInput.value;
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    blink();

    const aiReply = await getAIResponse(message);
    addMessage(aiReply, 'ai');
    speak(aiReply);
});
