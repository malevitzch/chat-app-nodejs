const { Server } = require('socket.io');
const io = new Server(8000, {
  cors: {
    origin: "*",
  }
});

console.log('Socket.IO server is running on port 8000');
io.on('connection', (socket) => {
  console.log("SUCCESSFUL CONNECTION");
  const arr = ["TEST", "YES", "NO"]
  socket.on('get_msgs', () => {socket.emit('update',arr)});
});

