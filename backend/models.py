from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    calories_goal = db.Column(db.Integer, default=2000)
    workouts = db.relationship('Workout', backref='user', lazy=True)

class Workout(db.Model):
    __tablename__ = 'workouts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100))
    description = db.Column(db.Text)
    calories_burned = db.Column(db.Integer)