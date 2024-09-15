const sqlite3 = require('sqlite3').verbose();

function init()
{
  const database = new sqlite3.Database(':memory:');
  database.serialize(() => {
    database.run(`CREATE TABLE IF NOT EXISTS messages 
          (id INTEGER PRIMARY KEY AUTOINCREMENT, contents TEXT NOT NULL);`
          );
    database.run(`CREATE TRIGGER limit_messages AFTER INSERT ON messages
          BEGIN
            DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY id DESC LIMIT 10);
          END;`
            );
  });
  return database;
}

function fetch(database) {
  return new Promise((resolve, reject) => {
    database.all(`SELECT contents FROM messages ORDER BY ID ASC`, [], (err, rows) => {
      resolve(rows);
    });
  });
}

async function get(database) {
  const result = await fetch(database);
  return result;
}

function post(database, msg) {
  database.run(`INSERT INTO messages (contents) VALUES (?);`, [msg]);
}

module.exports = {
  init,
  fetch,
  get,
  post
}
