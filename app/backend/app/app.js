//importing socketio
const { Server } = require('socket.io');

//importing sqlite3, verbose means extra diagnostics
const sqlite3 = require('sqlite3').verbose();

//import the database api file
const db = require('./database.js');

//creating the database
const database = db.init();

//initializing a socketio server to handle websocket connections
const io = new Server(8000, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
  //on every connection we output that there is a successful connection (this is mostly for debugging purposes)
  console.log("SUCCESSFUL CONNECTION");
  
  //whenever a post_msg message is emitted, we put it into the database
  socket.on('post_msg', (msg) => {
    db.post(database, msg);
    //inform all the currently connected users that a new message is available
    io.emit('new');
  });
  socket.on('get_msgs', async () => {
    //wait for the async db.get function
    const response = await db.get(database);
    //send the update back to the user who requested it
    socket.emit('update', response);
  });
});

