document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-input');
    chatForm.addEventListener('submit', submitMessage);
  
    const chat = document.getElementById('chat-show');
  
    function submitMessage(e) {
      e.preventDefault();
      
      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value;
      
      const messageElement = document.createElement('p');
      messageElement.textContent = message;
      
      chat.appendChild(messageElement);
      
      // Clear the input field
      messageInput.value = '';
    }
  });
  