const MAX_MESSAGES = 10

const msg_div = document.getElementById('msgBox');
const list = msg_div.querySelector('#msgList');

for(let i = 0; i < MAX_MESSAGES; i++) {
    var li = document.createElement('li');
    list.appendChild(li);
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
});

document.getElementById("cont").addEventListener("click", function() {
    document.getElementById("tog").classList.toggle("active");
    if(document.getElementById("tog").classList.contains("active")) {
	set_color_scheme(colorscheme_orange);
    } else {
	set_color_scheme(colorscheme_default);
    }
});


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

socket.on('new', (data) => {
    socket.emit('get_msgs');
});


function post() {
    const msg = document.getElementById('messageform').value;
    socket.emit('post_msg', msg);
    document.getElementById("msgform").reset();    
}

socket.emit('get_msgs');
