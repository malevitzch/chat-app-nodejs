//importing sqlite3 library, verbose is for better diagnostics
const sqlite3 = require('sqlite3').verbose();

//API function for initializing the database
function init() {
  //creating a new database in-memory
  const database = new sqlite3.Database(':memory:');

  //running the necessary initialization queries, serialize makes them run synchronously
  database.serialize(() => {
    //creating the table
    database.run(`CREATE TABLE IF NOT EXISTS messages 
          (id INTEGER PRIMARY KEY AUTOINCREMENT, contents TEXT NOT NULL);`
          );
    //adding a trigger that removes all messages beyond a certain limit on insert
    //TODO: make this a parametrized query for X where X is max messages
    database.run(`CREATE TRIGGER limit_messages AFTER INSERT ON messages
          BEGIN
            DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY id DESC LIMIT 10);
          END;`
            );
  });
  return database;
}

//auxiliary function for getting messages from db
function fetch(database) {
  return new Promise((resolve, reject) => {
    database.all(`SELECT contents FROM messages ORDER BY ID ASC`, [], (err, rows) => {
      resolve(rows);
    });
  });
}

//the API function for getting messages from db
async function get(database) {
  const result = await fetch(database);
  return result;
}

//API function that inserts a new message into the database
function post(database, msg) {
  database.run(`INSERT INTO messages (contents) VALUES (?);`, [msg]);
}

//exported functions, notice we don't export fetch because it is auxiliary 
module.exports = {
  init,
  get,
  post
}
