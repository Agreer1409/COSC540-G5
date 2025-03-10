# backend/routes/library.py
from flask import Blueprint, jsonify, request
import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import db

library_bp = Blueprint("library", __name__)

@library_bp.route("/library", methods=["GET"])
def get_library():
    library = [
        {"id": 1, "name": "Push-ups", "description": "Basic push-ups", "calories_burned": 100},
        {"id": 2, "name": "Running", "description": "30 min jog", "calories_burned": 300}
    ]
    return jsonify(library)

@library_bp.route("/library", methods=["POST"])
def create_library_item():
    data = request.get_json()
    # For demo, we'll simulate a static library; in practice, use a Library model
    return jsonify({"message": "Library item created", "id": 3})  # Mock ID

@library_bp.route("/library/<int:id>", methods=["PUT"])
def update_library_item(id):
    data = request.get_json()
    return jsonify({"message": "Library item updated"})

@library_bp.route("/library/<int:id>", methods=["DELETE"])
def delete_library_item(id):
    return jsonify({"message": "Library item deleted"})