# backend/routes/admin.py
from flask import Blueprint, jsonify, request
import logging
from models import db, User, Workout
from routes.auth import requires_auth, requires_admin  # Import requires_admin

admin_bp = Blueprint("admin", __name__)
logger = logging.getLogger(__name__)

@admin_bp.route("/admin/test", methods=["GET"], endpoint="admin_test")
@requires_admin  # Use requires_admin instead of manual check
def test_admin():
    logger.info(f"User roles: {request.auth0_roles}")  # Log roles for debugging
    return jsonify({"message": "Welcome, Admin!"})

@admin_bp.route("/admin/users", methods=["GET"], endpoint="admin_users")
@requires_admin  # Use requires_admin instead of manual check
def get_users():
    logger.info(f"User {request.auth0_id} roles: {request.auth0_roles}")  # Log id and roles for debugging
    users = User.query.all()
    return jsonify([{
        "id": user.id,
        "auth0_id": user.auth0_id,
        "name": user.name,
        "email": user.email,
        "calories_goal": user.calories_goal,
        "user_image": user.user_image,
        "dob": user.dob.isoformat() if user.dob else None,
        "target_weight": user.target_weight,
        "current_weight": user.current_weight
    } for user in users])