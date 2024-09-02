from flask import Flask, jsonify

app = Flask(__name__)

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
    return jsonify(messages)

@app.route("/get")
def get_messages():
    global messages
    return jsonify(messages)
