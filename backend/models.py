# backend/models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    calories_goal = db.Column(db.Integer, default=2000)
    user_image = db.Column(db.String(255))  # URL or path to user image
    dob = db.Column(db.Date)  # Date of birth
    target_weight = db.Column(db.Float)  # Target weight in pounds
    current_weight = db.Column(db.Float)  # Current weight in pounds
    workouts = db.relationship('Workout', backref='user', lazy=True)

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    calories_burned = db.Column(db.Integer)
    date = db.Column(db.DateTime, nullable=False)

class Motivation(db.Model):
    __tablename__ = 'motivations'
    id = db.Column(db.Integer, primary_key=True)
    quote = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)