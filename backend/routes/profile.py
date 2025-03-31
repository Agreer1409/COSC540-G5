# routes/profile.py
from flask import Blueprint, jsonify, request
from models import db, User
from routes.auth import requires_auth
import os
import uuid
from werkzeug.utils import secure_filename
from datetime import datetime, date
import logging

profile_bp = Blueprint("profile", __name__)

UPLOAD_FOLDER = 'public/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024

logging.basicConfig(filename='app.log', level=logging.ERROR)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@profile_bp.route("/profile", methods=["GET"], endpoint="profile_get")
@requires_auth
def get_profile():
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if not user:
        user = User(auth0_id=request.auth0_id)
        db.session.add(user)
        db.session.commit()
    return jsonify({
        "name": user.name,
        "email": user.email,
        "calories_goal": user.calories_goal,
        "user_image": user.user_image,
        "dob": user.dob.isoformat() if user.dob else None,
        "target_weight": user.target_weight,
        "current_weight": user.current_weight
    })

@profile_bp.route("/profile", methods=["PUT"], endpoint="profile_update")
@requires_auth
def update_profile():
    data = request.get_json()
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.calories_goal = data.get("calories_goal", user.calories_goal)
    user.user_image = data.get("user_image", user.user_image)
    dob_str = data.get("dob")
    user.dob = datetime.strptime(dob_str, '%Y-%m-%d').date() if dob_str else user.dob
    user.target_weight = data.get("target_weight", user.target_weight)
    user.current_weight = data.get("current_weight", user.current_weight)
    db.session.commit()
    return jsonify({
        "message": "Profile updated",
        "name": user.name,
        "email": user.email,
        "calories_goal": user.calories_goal,
        "user_image": user.user_image,
        "dob": user.dob.isoformat() if user.dob else None,
        "target_weight": user.target_weight,
        "current_weight": user.current_weight
    })

@profile_bp.route("/profile/upload-image", methods=["POST"], endpoint="profile_upload_image")
@requires_auth
def upload_image():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
    if file.content_length > MAX_FILE_SIZE:
        return jsonify({"message": "File too large. Maximum size is 5MB."}), 400
    if file and allowed_file(file.filename):
        try:
            extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{extension}"
            user = User.query.filter_by(auth0_id=request.auth0_id).first()
            if not user:
                return jsonify({"message": "User not found"}), 404
            if user.user_image and os.path.exists(user.user_image.lstrip('/')):
                try:
                    os.remove(user.user_image.lstrip('/'))
                except Exception as e:
                    logging.error(f"Failed to delete old image: {str(e)}")
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(file_path)
            user.user_image = f"/{file_path}"
            db.session.commit()
            return jsonify({"message": "Image uploaded", "user_image": user.user_image})
        except Exception as e:
            logging.error(f"Failed to upload image: {str(e)}")
            return jsonify({"message": f"Failed to upload image: {str(e)}"}), 500
    return jsonify({"message": "Invalid file type"}), 400

@profile_bp.route("/profile/delete", methods=["DELETE"], endpoint="profile_delete")
@requires_auth
def delete_profile():
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if not user:
        return jsonify({"message": "User not found"}), 404
    if user.user_image and os.path.exists(user.user_image.lstrip('/')):
        try:
            os.remove(user.user_image.lstrip('/'))
        except Exception as e:
            logging.error(f"Failed to delete user image: {str(e)}")
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Profile deleted"})