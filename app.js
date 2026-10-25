const messages = document.querySelector('#messages');
const input = document.querySelector('#message-input');
const responses = [
  ['That sounds fun! 🌿 What was your favorite part?', 'Try: “My favorite part was…”'],
  ['Lovely! Who did you go with?', 'A handy phrase: “I went with…”'],
  ['Nice work! What did you eat or drink?', 'You can say: “We had…”'],
  ['That’s a great answer! Can you tell me a little more?', 'Add a detail: where, when, or how you felt.']
];
let responseIndex = 0;
document.querySelector('#date').textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

function addMessage(text, fromAI = false) {
  const row = document.createElement('div');
  row.className = `message ${fromAI ? 'ai' : 'user'}`;
  const avatar = document.createElement('span');
  avatar.className = 'mini-avatar';
  avatar.textContent = fromAI ? '✦' : 'A';
  const content = document.createElement('div');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  content.append(bubble);
  if (fromAI) {
    const time = document.createElement('small');
    time.className = 'time';
    time.textContent = 'Mia · just now';
    content.append(time);
  }
  row.append(avatar, content);
  messages.append(row);
  messages.scrollTop = messages.scrollHeight;
  return content;
}

document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage(text);
  input.value = '';
  window.setTimeout(() => {
    const [answer, tip] = responses[responseIndex++ % responses.length];
    const content = addMessage(answer, true);
    const correction = document.createElement('div');
    correction.className = 'correction';
    correction.textContent = `✨ ${tip}`;
    content.append(correction);
  }, 400);
});

document.querySelectorAll('.suggestions button').forEach(button => {
  button.addEventListener('click', () => {
    input.value = button.textContent === 'Help me answer' ? 'I think…' : `${button.textContent}.`;
    input.focus();
  });
});

document.querySelector('#mic-button').addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    input.placeholder = 'Voice input is not available in this browser';
    window.setTimeout(() => { input.placeholder = 'Type your answer in English…'; }, 2200);
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.onresult = event => { input.value = event.results[0][0].transcript; input.focus(); };
  recognition.start();
});

document.querySelector('#lesson-button').addEventListener('click', event => {
  input.value = 'I’d like a coffee, please.';
  input.focus();
  document.querySelector('#topic').textContent = '☕ At the coffee shop';
  event.currentTarget.textContent = 'Practice in the chat ↑';
});
document.querySelector('#save-word').addEventListener('click', event => {
  event.currentTarget.textContent = '✓ Added to my words';
});

document.querySelectorAll('.nav button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.nav button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const page = button.dataset.page;
  document.querySelector('#crumb').textContent = page;
  document.querySelector('#heading').textContent = ({Practice:'Let’s get talking.', Lessons:'Learn a little every day.', Vocabulary:'Grow your word garden.', 'My progress':'Look how far you’ve come.'})[page];
  document.querySelector('#subtitle').textContent = ({Practice:'A little English every day goes a long way.', Lessons:'Short, friendly lessons made for your level.', Vocabulary:'Words and phrases you’re learning.', 'My progress':'One conversation at a time.'})[page];
}));
