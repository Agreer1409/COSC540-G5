# flask-server.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
import os
from dotenv import load_dotenv 
from config import Config

# Importing blueprints
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.workout import workout_bp
from routes.library import library_bp
from routes.motivation import motivation_bp
from routes.admin import admin_bp 

# Load environment variables from .env
load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='/public')
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Use Config class for all settings
app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = Config.SQLALCHEMY_TRACK_MODIFICATIONS
app.config['AUTH0_DOMAIN'] = Config.AUTH0_DOMAIN
app.config['API_AUDIENCE'] = Config.API_AUDIENCE
app.config['AUTH0_CLIENT_ID'] = Config.AUTH0_CLIENT_ID
# Optional: app.config['AUTH0_CLIENT_SECRET'] = Config.AUTH0_CLIENT_SECRET  # Uncomment if needed

db.init_app(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate

# Registering blueprints
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(profile_bp, url_prefix="/api")
app.register_blueprint(workout_bp, url_prefix="/api")
app.register_blueprint(library_bp, url_prefix="/api")
app.register_blueprint(motivation_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

# Debug route to verify config
@app.route('/debug', methods=['GET'])
def debug():
    return {
        "SQLALCHEMY_DATABASE_URI": app.config['SQLALCHEMY_DATABASE_URI'],
        "AUTH0_DOMAIN": app.config['AUTH0_DOMAIN'],
        "API_AUDIENCE": app.config['API_AUDIENCE'],
        "AUTH0_CLIENT_ID": app.config['AUTH0_CLIENT_ID']
    }

if __name__ == "__main__":
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created successfully!")
    app.run(debug=True)