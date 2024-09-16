const MAX_MESSAGES = 10

//generating the list of messages
const msg_div = document.getElementById('msgBox');
const list = msg_div.querySelector('#msgList');

for(let i = 0; i < MAX_MESSAGES; i++) {
    var li = document.createElement('li');
    list.appendChild(li);
}

//preventing default form behavior, basically forms used to reload the page and reset colorscheme on submit
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
});

//the colorscheme switch
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

//filling the list with recieved data upon recieving an 'update' message through the socket
socket.on('update', (data) => {
    //access the list of items from the list
    //TODO: error handling in case the database somehow returns more than MAX_MESSAGES 
    const items = list.getElementsByTagName('li');
    for (let i = 0; i < data.length; i++) 
    {
	items[i].textContent = data[i].contents;
    }
});

//whenever the server has new data, it sends a 'new' message to the client
socket.on('new', () => {
    //the client emits the get_msgs message upon recieving the information that there is new data
    socket.emit('get_msgs');
});

//the function used by the form to post messages
function post() {
    //get the message value from the form
    const msg = document.getElementById('messageform').value;
    //reset the form (we have to do this manually since default behavior is disabled)
    document.getElementById("msgform").reset();
    //send the message to the backend
    socket.emit('post_msg', msg);
}

//initial emisson of get_msgs so that we get them on page load
socket.emit('get_msgs');
