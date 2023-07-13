function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function outputUserJoined(username) {
  const userlist = document.getElementById('userlist');
  let user = document.createElement('li');
  user.textContent = `${username} joined.`;
  userlist.appendChild(user);
}

function getCurrentTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return time;
}
async function updateLocalStorageWithMessages() {
  try {
    const response = await axios.get('/show-chat');
    const messages = response.data;
    const lastTenMessages = messages.slice(-10); // Get the last 10 messages

    // Store the last 10 messages in local storage
    localStorage.setItem('lastTenMessages', JSON.stringify(lastTenMessages));
  } catch (error) {
    console.error('Error retrieving messages:', error);
  }
}

document.getElementById('add-chat').addEventListener('click', addChat);

 async function addChat(event) {
  event.preventDefault();

  const msg = document.getElementById('msg').value;
  const token = sessionStorage.getItem("token");
  const user = parseJwt(token);

  const obj = {
    message: msg,
    userId: user.userId,
    name: user.name
  };
  try {
    let response = await axios.post(
      "/add-chat",
      obj,
      { headers: { Authorization: token } }
    );
    document.getElementById("msg").value = '';
    console.log('msg saved in DB');
    updateLocalStorageWithMessages();
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  let token = localStorage.getItem("token");
  const decode = parseJwt(token);
  const name = decode.username;
  outputUserJoined(name);

  const chatForm = document.getElementById('chat-form');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    const currentTime = getCurrentTime();
    outputMessage({ message: msg, sender: name });
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'loggedInUsers') {
      const loggedInUsers = JSON.parse(event.newValue);
      updateUsersList(loggedInUsers);
    }
  });

  function updateUsersList(loggedInUsers) {
    const userlist = document.getElementById('userlist');
    userlist.innerHTML = '';

    for (const username of loggedInUsers) {
      outputUserJoined(username);
    }
  }

  const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
  updateUsersList(loggedInUsers);
  loggedInUsers.push(name);
  localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));

  document.getElementById('log').addEventListener('click', () => {
    const loggedInUsers = JSON.parse(localStorage.getItem('loggedInUsers')) || [];
    const index = loggedInUsers.indexOf(name);
    if (index > -1) {
      loggedInUsers.splice(index, 1);
      localStorage.setItem('loggedInUsers', JSON.stringify(loggedInUsers));
    }

    window.location.href = '/login';
  });
  const storedMessages = JSON.parse(localStorage.getItem('lastTenMessages')) || [];

  // Display messages on the HTML page
  const messageList = document.getElementById('message-list');
  messageList.innerHTML = '';

  storedMessages.forEach(message => {
    const listItem = document.createElement('li');
    listItem.setAttribute('id', `message-item-${message.id}`);
    listItem.innerHTML = `<strong>${message.name}:</strong> ${message.message}`;
    messageList.appendChild(listItem);
  });
  
  // updateLocalStorageWithMessages();
  setInterval(updateLocalStorageWithMessages, 1000);

});

  // function getNewMessages() {
  //   axios.get('/show-chat')
  //     .then(response => {
  //       const messages = response.data;
  //       const messageList = document.getElementById('message-list');
  //       messageList.innerHTML = '';

  //       messages.forEach(message => {
  //         const listItem = document.createElement('li');
  //         listItem.setAttribute('id', `message-item-${message.id}`);
  //         const date = new Date(message.date).toLocaleDateString();

  //         listItem.innerHTML = `<strong>${message.name}:</strong> ${message.message}`;
  //         messageList.appendChild(listItem);
  //       });
  //     })
  //     .catch(error => {
  //       console.error('Error retrieving messages:', error);
  //     });
  // }
  
  // setInterval(getNewMessages, 1000);