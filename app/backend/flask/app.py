from flask import Flask, jsonify
import os
import sqlite3
app = Flask(__name__)

DBPATH = "./database.db"

def init_db():
    with sqlite3.connect(DBPATH) as connection:
        sql_statements = [
            """CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contents TEXT NOT NULL
            );""",
            """CREATE TRIGGER limit_messages AFTER INSERT ON messages
                BEGIN
                    DELETE FROM messages WHERE id NOT IN (SELECT id FROM messages ORDER BY id DESC LIMIT X);
                END;"""]
        cursor = connection.cursor()
        for statement in sql_statements:
            cursor.execute(statement)
        connection.commit()
        connection.close()
def db_get() -> str:
    if not os.path.exists(DBPATH):
        init_db()
    with sqlite3.connect(DBPATH) as connection:
        return ""

def db_post(message: str):
    if not os.path.exists(DBPATH):
        init_db()
    with sqlite3.connect(DBPATH) as connection:
        cursor = connection.cursor()
        cursor.execute("INSERT INTO messages (contents) VALUES (?);", (message,))
        connection.commit()
        connection.close()
MAX_MESSAGES = 3
messages = []

def clear_old():
    global messages
    if(len(messages) > 3):
        messages = messages[-3:]

@app.route("/post/<path:message>")
def post_message(message):
    global messages
    messages.append(message)
    clear_old()
    return db_get()

@app.route("/get")
def get_messages():
    global messages
    return jsonify(messages)
