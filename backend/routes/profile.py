# backend/routes/profile.py
from flask import Blueprint, jsonify, request
import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import db, User
from routes.auth import requires_auth

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile", methods=["GET"])
@requires_auth
def get_profile():
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if not user:
        user = User(auth0_id=request.auth0_id, name="New User", email="example@email.com")
        db.session.add(user)
        db.session.commit()
    return jsonify({"name": user.name, "email": user.email, "calories_goal": user.calories_goal})

@profile_bp.route("/profile", methods=["PUT"])
@requires_auth
def update_profile():
    data = request.get_json()
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if user:
        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.calories_goal = data.get("calories_goal", user.calories_goal)
        db.session.commit()
    return jsonify({"message": "Profile updated"})