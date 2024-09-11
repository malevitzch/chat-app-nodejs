const { Server } = require('socket.io');

const sqlite3 = require('sqlite3').verbose();

function db_init()
{
  const database = new sqlite3.Database(':memory:');
  database.serialize(() => {
    database.run(`CREATE TABLE IF NOT EXISTS messages 
          (id INTEGER PRIMARY KEY AUTOINCREMENT, contents TEXT NOT NULL);`
          );
    database.run(`CREATE TRIGGER limit_messages AFTER INSERT ON messages
          BEGIN
            DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY id DESC LIMIT 3);
          END;`
            );
  });
  return database;
}

function fetch_from_db(database) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT contents FROM messages ORDER BY ID ASC`, [], (err, rows) => {
      resolve(rows);
    });
  });
}

async function db_get(database) {
  const result = await fetch_from_db(database);
  return result;
}

function db_post(database, msg) {
  db.run(`INSERT INTO messages (contents) VALUES (?);`, [msg]);
}
 
const db = db_init();
const io = new Server(8000, {
  cors: {
    origin: "*",
  }
});

console.log('Socket.IO server is running on port 8000');
io.on('connection', (socket) => {
  console.log("SUCCESSFUL CONNECTION");
  socket.on('post_msg', (msg) => {
    db_post(db, msg);
    io.emit('new');
  });
  socket.on('get_msgs', async () => {
    const response = await db_get(db);
    socket.emit('update', response);
  });
});

