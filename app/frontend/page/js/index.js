let MESSAGE_LIMIT = 10;

import colors from "./colorschemes.js";

//declaration of global variables
let hostname;
let address;
let socket;

let msg_div;
let list;

window.addEventListener('load', function() {
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
    if(msg.trim() == '') return;
    //reset the form (we have to do this manually since default behavior is disabled)
    document.getElementById("msgform").reset();
    //send the message to the backend
    socket.send(JSON.stringify({ type: 'post_msg', data: msg }));
}
//attach post function to window so that submitting works
window.post = post;

//give focus to the text field on page load
window.addEventListener('load', function() {
    document.getElementById("messageform").focus();
});


//handle websocket stuff
window.addEventListener('load', function() {
  hostname = document.location.hostname;
  socket = new WebSocket(`ws://${hostname}/ws`);

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'get_msgs' }));
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if(message.type === 'update') {

      const data = message.data;
      if(data.length > MESSAGE_LIMIT) {
          var diff = data.length - MESSAGE_LIMIT;
          data = data.slice(diff, data.length); //we want to keep the latest messages
      }
      const items = list.getElementsByTagName('li');
      for(let i = 0; i < data.length; i++) {
          items[i].textContent = data[i].contents;
      }

    }
    if(message.type === 'new') {
        socket.send(JSON.stringify({ type: 'get_msgs' }));
    }
  };
});

