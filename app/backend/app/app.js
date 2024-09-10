const { Server } = require('socket.io');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages 
        (id INTEGER PRIMARY KEY AUTOINCREMENT, contents TEXT NOT NULL);`
        );
  db.run(`CREATE TRIGGER limit_messages AFTER INSERT ON messages
        BEGIN
          DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY id DESC LIMIT 3);
        END;`
          );
});
const io = new Server(8000, {
  cors: {
    origin: "*",
  }
});

console.log('Socket.IO server is running on port 8000');
io.on('connection', (socket) => {
  console.log("SUCCESSFUL CONNECTION");
  const arr = ["TEST", "YES", "NO"]
  socket.on('post_msg', (msg) => {
    db.run(`INSERT INTO messages (contents) VALUES (?);`, [msg]);
    io.emit('new');
  });
  socket.on('get_msgs', () => {
    db.all(`SELECT contents FROM messages ORDER BY ID ASC`, [], (err, rows) => {
      var messages = [];
      socket.emit('update', rows);
    });
  });
});

