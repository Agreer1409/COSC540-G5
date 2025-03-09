# backend/routes/workout.py
from flask import Blueprint, jsonify, request
import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from models import db, User, Workout
from routes.auth import requires_auth

workout_bp = Blueprint("workout", __name__)

@workout_bp.route("/workouts", methods=["GET"])
@requires_auth
def get_workouts():
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    workouts = [{"id": w.id, "name": w.name, "description": w.description, "calories_burned": w.calories_burned} for w in user.workouts]
    return jsonify(workouts)

@workout_bp.route("/workouts", methods=["POST"])
@requires_auth
def create_workout():
    data = request.get_json()
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    workout = Workout(user_id=user.id, name=data["name"], description=data["description"], calories_burned=data["calories_burned"])
    db.session.add(workout)
    db.session.commit()
    return jsonify({"message": "Workout created", "id": workout.id})

@workout_bp.route("/workouts/<int:id>", methods=["PUT"])
@requires_auth
def update_workout(id):
    data = request.get_json()
    workout = Workout.query.get_or_404(id)
    if workout.user.auth0_id != request.auth0_id:
        return jsonify({"message": "Unauthorized"}), 403
    workout.name = data.get("name", workout.name)
    workout.description = data.get("description", workout.description)
    workout.calories_burned = data.get("calories_burned", workout.calories_burned)
    db.session.commit()
    return jsonify({"message": "Workout updated"})

@workout_bp.route("/workouts/<int:id>", methods=["DELETE"])
@requires_auth
def delete_workout(id):
    workout = Workout.query.get_or_404(id)
    if workout.user.auth0_id != request.auth0_id:
        return jsonify({"message": "Unauthorized"}), 403
    db.session.delete(workout)
    db.session.commit()
    return jsonify({"message": "Workout deleted"})