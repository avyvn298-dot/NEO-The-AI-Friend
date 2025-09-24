const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const avatar = document.getElementById('avatar');

let chatMemory = [];

sendBtn.addEventListener('click', () => sendMessage());
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user-message');
  chatMemory.push({ role: 'user', content: message });
  userInput.value = '';
  
  animateAvatar('thinking');
  
  getAIResponse(message).then(response => {
    appendMessage(response, 'bot-message');
    speak(response);
    animateAvatar('happy');
    chatMemory.push({ role: 'assistant', content: response });
  });
}

function appendMessage(text, className) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-message ${className}`;
  msgDiv.textContent = text;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Text-to-Speech
function speak(text) {
  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  synth.speak(utter);
}

// Animate Avatar
function animateAvatar(state) {
  switch(state) {
    case 'thinking':
      avatar.src = 'avatar-thinking.png';
      break;
    case 'happy':
      avatar.src = 'avatar-happy.png';
      setTimeout(() => avatar.src = 'avatar-neutral.png', 1500);
      break;
    default:
      avatar.src = 'avatar-neutral.png';
  }
}

// OpenAI GPT API call
async function getAIResponse(message) {
  const API_KEY = 'YOUR_OPENAI_API_KEY';
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chatMemory,
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error(err);
    return "Oops! Something went wrong.";
  }
}
