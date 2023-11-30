import datetime

from flask import current_app, request, jsonify
from flask_socketio import send, emit, ConnectionRefusedError, join_room, leave_room
from flask_jwt_extended import jwt_required
from server import socketio

from . import database 

@socketio.on("connect")
def handle_connect():
    current_app.logger.info("Client connect")

def send_descriptors():
    emit(
        "action", {
            "type": "WEBSOCKET_DATABASE_DESCRIPTORS", 
            "payload": database.get_descriptors()
        }
    )

def send_heartbeat():

    utc = datetime.timezone.utc

    payload = { 
        "timestamp": datetime.datetime.now(utc).isoformat()
    }

    emit(
        "action", {
            "type": "WEBSOCKET_HEARTBEAT_EVENT", 
            "payload": payload
        }
    )



@socketio.on("join")
def handle_join_room(msg):
    rooms = ["database", "heartbeat"]

    if msg["room"] in rooms:
        if msg["room"] == "database":
            send_descriptors()

        if msg["room"] == "heartbeat":
            send_heartbeat()

        join_room(msg["room"])
        current_app.logger.info("Joined %s" % msg["room"])

@socketio.on("database")
@jwt_required()
def handle_database(payload):
    current_app.logger.info("Database message: %s" % payload)
    emit(
        "action",
        {"type": "WEBSOCKET_DATABASE_EVENT", "payload": payload},
        room="database",
    )

@socketio.on("heartbeat")
@jwt_required()
def handle_heartbeat(payload):
    current_app.logger.info("Heartbeat message: %s" % payload)
    emit(
        "action",
        {"type": "WEBSOCKET_HEARTBEAT_EVENT", "payload": payload},
        room="heartbeat",
    )

