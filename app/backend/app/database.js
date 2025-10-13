// The maximum number of messages contained in a response to an user
const MESSAGE_LIMIT = parseInt(process.env.MESSAGE_LIMIT || 10);

// Handles how much hisotry is kept server-side
const HISTORY_SIZE = Math.max(MESSAGE_LIMIT, parseInt(process.env.HISTORY_LIMIT || 10));

let last_index = 0;
// Handles how many extra messages can be stored into the database before we
// perform a clean. Allows to trade disk space for speed
const EXTRA_BEFORE_DELETION = parseInt(process.env.EXTRA_BEFORE_DELETION || HISTORY_SIZE);


const DELETE_THRESHOLD = HISTORY_SIZE + EXTRA_BEFORE_DELETION;

// importing sqlite3 library, verbose is for better diagnostics
const sqlite3 = require('sqlite3').verbose();

// API function for initializing the database
function init() {
  // creating a new database in-memory
  const database = new sqlite3.Database(':memory:');

  // creating the table
  database.run(`CREATE TABLE IF NOT EXISTS messages 
        (id INTEGER PRIMARY KEY, contents TEXT NOT NULL, sender TEXT);`);
  return database;
}

function cleanup(database) {
  database.run(`
    DELETE FROM messages
    WHERE id <= (?)
  `, [last_index - HISTORY_SIZE]);
}

// auxiliary function for getting messages from db
function fetch(database) {
  return new Promise((resolve, reject) => {
    database.all(`SELECT contents FROM messages WHERE id > (?) ORDER BY id ASC LIMIT (?);`,
      [last_index - MESSAGE_LIMIT, MESSAGE_LIMIT], (err, rows) => {
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
function post(database, msg, sender = null) {
  last_index += 1;
  if (sender == null) {
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
