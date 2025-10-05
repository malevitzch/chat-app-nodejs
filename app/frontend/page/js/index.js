let MESSAGE_LIMIT = 10;

import colors from "./colorschemes.js";

let msg_div;
let list;

window.addEventListener('load', function() {
    await config_promise;
    //generating the list of messages
    //TODO: make messages processed differently than through an ul because this does not seem to be the optimal way to do things
    msg_div = document.getElementById('msgBox');
    list = msg_div.querySelector('#msgList');
    for(let i = 0; i < MESSAGE_LIMIT; i++) {
	var li = document.createElement('li');
	list.appendChild(li);
    }
    //preventing default form behavior, basically forms used to reload the page and reset colorscheme on submit
    document.querySelector('form').addEventListener('submit', function(event) {
	event.preventDefault();
    });
});

window.addEventListener('load', function() {
    //the colorscheme switch
    document.getElementById("cont").addEventListener("click", function() {
	document.getElementById("tog").classList.toggle("active");
	if(document.getElementById("tog").classList.contains("active")) {
	    colors.set_colorscheme(colors.colorscheme_orange);
	} else {
	    colors.set_colorscheme(colors.colorscheme_default);
	    }
    });
});

function post() {
    //get the message value from the form
    const msg = document.getElementById('messageform').value;
    if(msg.trim() == '') {
	return;
    };
    //reset the form (we have to do this manually since default behavior is disabled)
    document.getElementById("msgform").reset();
    //send the message to the backend
    socket.emit('post_msg', msg);
}
//attach post function to window so that submitting works
window.post = post;

//give focus to the text field on page load
window.addEventListener('load', function() {
    document.getElementById("messageform").focus();
});

//declaration of global variables
let hostname;
let address;
let socket;

//handle websocket stuff
window.addEventListener('load', function() {
    //initializing the socket
    hostname = document.location.hostname;
    address =`http://${hostname}`;
    socket = io(address);

    //filling the list with recieved data upon recieving an 'update' message through the socket
    socket.on('update', (data) => {
	//access the list of items from the list
	if(data.length > MESSAGE_LIMIT) {
	    var diff = data.length - MESSAGE_LIMIT;
	    data = data.slice(diff, data.length); //we want to keep the latest messages
	}
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

    //initial emisson of get_msgs so that we get them on page load
    socket.emit('get_msgs');
});

