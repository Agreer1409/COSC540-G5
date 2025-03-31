# config.py
import os

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://fitness_user:coolfit@localhost/fitness_db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Auth0 configuration
    AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "dev-s2v1m5kx4zm7z1o0.us.auth0.com")
    API_AUDIENCE = os.getenv("API_AUDIENCE", "https://fitness-api")
    AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "qZMUJaXuHnUwF2Bss6wRECp0HFmjP6s6")
    AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET", "your-client-secret")  # Replace with actual secret if needed