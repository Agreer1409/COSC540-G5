from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Workout
import os
import requests
from jose import jwk, jwt
from functools import wraps
from config import Config

# Importing the auth blueprint and auth decorator
from routes.auth import auth_bp, requires_auth

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = Config.SQLALCHEMY_TRACK_MODIFICATIONS
db.init_app(app)

# Registering blueprints
app.register_blueprint(auth_bp, url_prefix="/api")

# Profile CRUD
@app.route('/api/profile', methods=['GET'])
@requires_auth
def get_profile():
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if not user:
        user = User(auth0_id=request.auth0_id, name='New User', email='example@email.com')
        db.session.add(user)
        db.session.commit()
    return jsonify({'name': user.name, 'email': user.email, 'calories_goal': user.calories_goal})

@app.route('/api/profile', methods=['PUT'])
@requires_auth
def update_profile():
    data = request.get_json()
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    if user:
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.calories_goal = data.get('calories_goal', user.calories_goal)
        db.session.commit()
    return jsonify({'message': 'Profile updated'})

# Workout CRUD
@app.route('/api/workouts', methods=['GET'])
@requires_auth
def get_workouts():
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    workouts = [{'id': w.id, 'name': w.name, 'description': w.description, 'calories_burned': w.calories_burned} for w in user.workouts]
    return jsonify(workouts)

@app.route('/api/workouts', methods=['POST'])
@requires_auth
def create_workout():
    data = request.get_json()
    user = User.query.filter_by(auth0_id=request.auth0_id).first()
    workout = Workout(user_id=user.id, name=data['name'], description=data['description'], calories_burned=data['calories_burned'])
    db.session.add(workout)
    db.session.commit()
    return jsonify({'message': 'Workout created', 'id': workout.id})

@app.route('/api/workouts/<int:id>', methods=['PUT'])
@requires_auth
def update_workout(id):
    data = request.get_json()
    workout = Workout.query.get_or_404(id)
    if workout.user.auth0_id != request.auth0_id:
        return jsonify({'message': 'Unauthorized'}), 403
    workout.name = data.get('name', workout.name)
    workout.description = data.get('description', workout.description)
    workout.calories_burned = data.get('calories_burned', workout.calories_burned)
    db.session.commit()
    return jsonify({'message': 'Workout updated'})

@app.route('/api/workouts/<int:id>', methods=['DELETE'])
@requires_auth
def delete_workout(id):
    workout = Workout.query.get_or_404(id)
    if workout.user.auth0_id != request.auth0_id:
        return jsonify({'message': 'Unauthorized'}), 403
    db.session.delete(workout)
    db.session.commit()
    return jsonify({'message': 'Workout deleted'})

# Library CRUD (Public, no auth for simplicity; add auth if needed)
@app.route('/api/library', methods=['GET'])
def get_library():
    library = [
        {'id': 1, 'name': 'Push-ups', 'description': 'Basic push-ups', 'calories_burned': 100},
        {'id': 2, 'name': 'Running', 'description': '30 min jog', 'calories_burned': 300}
    ]
    return jsonify(library)

@app.route('/api/library', methods=['POST'])
def create_library_item():
    data = request.get_json()
    # For demo, we'll simulate a static library; in practice, use a Library model
    return jsonify({'message': 'Library item created', 'id': 3})  # Mock ID

@app.route('/api/library/<int:id>', methods=['PUT'])
def update_library_item(id):
    data = request.get_json()
    return jsonify({'message': 'Library item updated'})

@app.route('/api/library/<int:id>', methods=['DELETE'])
def delete_library_item(id):
    return jsonify({'message': 'Library item deleted'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)