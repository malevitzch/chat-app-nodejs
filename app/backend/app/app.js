const { Server } = require('socket.io');

const sqlite3 = require('sqlite3').verbose();
const dbm = require('./database.js');
 
const db = dbm.init();
const io = new Server(8000, {
  cors: {
    origin: "*",
  }
});

console.log('Socket.IO server is running on port 8000');
io.on('connection', (socket) => {
  console.log("SUCCESSFUL CONNECTION");
  socket.on('post_msg', (msg) => {
    dbm.post(db, msg);
    io.emit('new');
  });
  socket.on('get_msgs', async () => {
    const response = await dbm.get(db);
    socket.emit('update', response);
  });
});

