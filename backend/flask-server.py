from flask import Flask
from flask_cors import CORS
from models import db
import os
from config import Config

# Importing blueprints
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.workout import workout_bp
from routes.library import library_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = Config.SQLALCHEMY_TRACK_MODIFICATIONS
db.init_app(app)

# Registering blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(workout_bp, url_prefix="/api")
app.register_blueprint(library_bp, url_prefix="/api")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)