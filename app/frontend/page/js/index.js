const MAX_MESSAGES = 3

list = document.getElementById('msgList');
for(let i = 0; i < MAX_MESSAGES; i++) {
    var li = document.createElement('li');
    list.appendChild(li);
}


//initializing the socket
const hostname = document.location.hostname;
const address =`http://${hostname}:8000`;
const socket = io(address);

socket.on('update', (data) => {
    const items = list.getElementsByTagName('li');
    for (let i = 0; i < data.length; i++) 
    {
	items[i].textContent = data[i].contents;
    }
});

function post() {
    const msg = document.getElementById('messageform').value;
    socket.emit('post_msg', msg);
    console.log("POSTED MSG");
}

socket.emit('get_msgs');
