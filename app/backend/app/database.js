// Handles how much hisotry is kept
const MESSAGE_LIMIT = process.env.MESSAGE_LIMIT || 10;
let last_index = 0;
// Handles how many extra messages can be stored into the database before we
// perform a clean. Allows to trade disk space for speed
const EXTRA_BEFORE_DELETION = process.env.EXTRA_BEFORE_DELETION || 0;

// importing sqlite3 library, verbose is for better diagnostics
const sqlite3 = require('sqlite3').verbose();

// API function for initializing the database
function init() {
  // creating a new database in-memory
  const database = new sqlite3.Database(':memory:');

  // running the necessary initialization queries, serialize makes them run synchronously
  database.serialize(() => {
    // creating the table
    database.run(`CREATE TABLE IF NOT EXISTS messages 
          (id INTEGER PRIMARY KEY, contents TEXT NOT NULL, sender TEXT);`
          );
    // adding a trigger that removes all messages beyond a certain limit on insert
    let LIMIT = parseInt(MESSAGE_LIMIT, 10) + parseInt(EXTRA_BEFORE_DELETION, 10);
    database.run(`CREATE TRIGGER limit_messages AFTER INSERT ON messages
          WHEN (SELECT COUNT(*) FROM messages) > ${MESSAGE_LIMIT}
          BEGIN
            DELETE FROM messages WHERE id NOT IN
            (SELECT id FROM messages ORDER BY id DESC LIMIT ${MESSAGE_LIMIT});
          END;`
            );
  });
  return database;
}

// auxiliary function for getting messages from db
function fetch(database) {
  return new Promise((resolve, reject) => {
    database.all(`SELECT contents FROM messages ORDER BY ID ASC LIMIT ?;`,
                 [MESSAGE_LIMIT], (err, rows) => {
      resolve(rows);
    });
  });
}

// the API function for getting messages from db
async function get(database) {
  const result = await fetch(database);
  return result;
}

// API function that inserts a new message into the database
function post(database, msg, sender=null) {
  last_index += 1;
  if(sender==null) {
    database.run(`INSERT INTO messages (ID, contents) VALUES (?, ?);`, 
      [last_index, msg]);
  } else {
    database.run(`INSERT INTO messages (ID, contents, sender) VALUES (?, ?, ?);`,
      [last_index, msg, sender]);
  }
}

// exported functions, notice we don't export fetch because it is auxiliary 
module.exports = {
  init,
  get,
  post
}
