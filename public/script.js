const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Display a thinking message and keep a reference to it
  const thinkingMessageElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      // Try to parse error response from backend, or use a default
      let errorReply = 'An unexpected error occurred.';
      try {
        const errorData = await response.json();
        errorReply = errorData.reply || `Error ${response.status}`;
      } catch (parseError) {
        // If parsing error response fails, use status text or default
        errorReply = response.statusText || errorReply;
      }
      thinkingMessageElement.textContent = errorReply;
      thinkingMessageElement.classList.add('error'); // Optional: for styling error messages
      return;
    }

    const data = await response.json();
    thinkingMessageElement.textContent = data.reply; // Update the thinking message with the actual reply
  } catch (error) {
    console.error('Fetch error:', error);
    thinkingMessageElement.textContent = 'Sorry, something went wrong while connecting to the server.';
    thinkingMessageElement.classList.add('error'); // Optional: for styling error messages
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the created message element
}
