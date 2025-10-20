const CONFIG_PORT = parseInt(process.env.CONFIG_PORT) || 8080;
const BACKEND_SOCKET_PORT = parseInt(process.env.BACKEND_SOCKET_PORT) || 8000;

//importing socketio
const { Server } = require('socket.io');

//the whole point of this section is just to give a http server to frontend
const express = require('express');
const app = express();

//config endpoint
app.get('/config/', (req, res) => {
  res.json({
    MESSAGE_LIMIT: parseInt(process.env.MESSAGE_LIMIT) || 4
  });
});

app.listen(CONFIG_PORT, () => {
  console.log(`Backend config server listening on port ${CONFIG_PORT}`);
});

//importing sqlite3, verbose means extra diagnostics
const sqlite3 = require('sqlite3').verbose();

//import the database api file
const db = require('./database.js');

//creating the database
const database = db.init();

//initializing a socketio server to handle websocket connections
const io = new Server(BACKEND_SOCKET_PORT, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket) => {
  //on every connection we output that there is a successful connection (this is mostly for debugging purposes)
  console.log("SUCCESSFUL CONNECTION");

  //whenever a post_msg message is emitted, we put it into the database
  socket.on('post_msg', (msg) => {
    if (msg.trim() == '') {
      return;
    }
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

