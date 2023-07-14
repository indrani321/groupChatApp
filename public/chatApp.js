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
    const lastTenMessages = messages.slice(-10); 

    
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
    
    
    updateLocalStorageWithMessages();
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const groupname = localStorage.getItem('groupname');
  if (groupname) {
    updatePageWithGroupName(groupname);
  }
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

  
  function displayMessages() {
    const storedMessages = JSON.parse(localStorage.getItem('lastTenMessages')) || [];
  
    
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = '';
  
    storedMessages.forEach(message => {
      const listItem = document.createElement('li');
      listItem.setAttribute('id', `message-item-${message.id}`);
      listItem.innerHTML = `<strong>${message.name}:</strong> ${message.message}`;
      messageList.appendChild(listItem);
    });
  }
  

  displayMessages();
  
  
  setInterval(displayMessages, 1000);

});

function fetchUsers() {
  axios.get('/get-user')
    .then(response => {
      const userData = response.data;
      const userNames = userData.name; // Access the name property of the response data
      
      const userlistElement = document.getElementById('group-members');
      userlistElement.innerHTML = '';

      userNames.forEach(userName => {
        const listItem = document.createElement('li');
        listItem.textContent = userName;
        const inviteButton = document.createElement('button');
        inviteButton.textContent = 'Invite';
        inviteButton.id = `invite-button-${userName}`;
        
        inviteButton.addEventListener('click', () => inviteUser(userName));

        listItem.appendChild(inviteButton);
        userlistElement.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
}





function createGroup() {
  var groupname = prompt("Enter the group name:");
  if (groupname) {
    axios.post('/save-group', { groupname })
    .then(response => {
      console.log('Group name saved:', response.data);
      const groupname = response.data.group.groupname;
        updatePageWithGroupName(groupname);
        saveGroupNameToLocalStorage(groupname);
    })
    .catch(error => {
      console.error('Error saving group name:', error);
    });
      console.log("Group Name:", groupname);
      fetchUsers();
  }
}

function inviteUser(name) {
  const message = `You invited ${name} to the group.`;
  alert(message);

  // Add the logic to join the user to the group
  axios.post('/join-group', { name })
    .then(response => {
      console.log('User joined the group:', response.data);
    })
    .catch(error => {
      console.error('Error joining the group:', error);
    });
}

function updatePageWithGroupName(groupname) {
  const groupnameElement = document.getElementById('group-name');
  groupnameElement.textContent = `you are admin of ${groupname}`;
  const groupnamebutton = document.createElement('button');
  groupnamebutton.textContent = `${groupname}`;
  groupnameElement.appendChild(groupnamebutton);

}

function saveGroupNameToLocalStorage(groupname) {
  localStorage.setItem('groupname', groupname);
}
  