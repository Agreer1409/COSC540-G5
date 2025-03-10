# Implementing blueprint for authentication-related routes
from flask import Blueprint, jsonify, request
import requests
from jose import jwk, jwt
from functools import wraps
import os
import sys

# Adding the backend directory to the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from config import Config

auth_bp = Blueprint("auth", __name__)

# Get Auth0 configuration from Config
AUTH0_DOMAIN = Config.AUTH0_DOMAIN
API_AUDIENCE = Config.API_AUDIENCE
CLIENT_ID = Config.CLIENT_ID

jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
jwks = requests.get(jwks_url).json()

# Auth0 config endpoint
@auth_bp.route("/config", methods=["GET"])
def get_config():
    return jsonify({
        "auth0_domain": AUTH0_DOMAIN,
        "client_id": CLIENT_ID,
        "audience": API_AUDIENCE
    })

# Auth decorator function
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", None)
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            unverified_header = jwt.get_unverified_header(token.split()[1])
            rsa_key = next(key for key in jwks["keys"] if key["kid"] == unverified_header["kid"])
            pem_key = jwk.construct(rsa_key).to_pem()
            payload = jwt.decode(token.split()[1], pem_key, algorithms=["RS256"], audience=API_AUDIENCE, issuer=f"https://{AUTH0_DOMAIN}/")
            request.auth0_id = payload["sub"]
        except Exception as e:
            print(f"Token Error: {str(e)}")
            return jsonify({"message": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated