# routes/auth.py
from functools import wraps
from flask import jsonify, request, Blueprint
import jwt
import requests
from jwt import PyJWKClient
from flask import current_app

# Blueprint setup
auth_bp = Blueprint("auth", __name__)

# Helper to extract token from Authorization header
def get_token_auth_header():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({"message": "Missing Authorization Header"}), 401
    parts = auth_header.split()
    if parts[0].lower() != "bearer" or len(parts) != 2:
        return None, jsonify({"message": "Invalid Authorization Header"}), 401
    return parts[1], None, None

# Authentication decorator
def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token, error, status = get_token_auth_header()
        if error:
            return error, status

        try:
            # Fetch JWKS dynamically from Auth0
            domain = current_app.config['AUTH0_DOMAIN']
            audience = current_app.config['API_AUDIENCE']
            jwks_url = f"https://{domain}/.well-known/jwks.json"
            jwks_client = PyJWKClient(jwks_url)
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            # Decode token with dynamic key
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256"],
                audience=audience,
                issuer=f"https://{domain}/"
            )

            # Store user info in request context
            request.auth0_id = payload['sub']
            request.auth0_roles = payload.get('https://fitness-api/roles', [])  # Custom namespace for roles
            request.auth0_payload = payload  # Store full payload for flexibility
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidAudienceError:
            return jsonify({"message": "Invalid audience"}), 401
        except jwt.InvalidIssuerError:
            return jsonify({"message": "Invalid issuer"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"message": f"Token validation failed: {str(e)}"}), 500

        return f(*args, **kwargs)
    return decorated

# Admin role decorator
def requires_admin(f):
    @wraps(f)
    @requires_auth
    def decorated(*args, **kwargs):
        roles = request.auth0_roles
        permissions = request.auth0_payload.get('permissions', [])
        current_app.logger.info(f"User {request.auth0_id} roles: {roles}, permissions: {permissions}")
        if 'admin' not in roles and 'admin:access' not in permissions:
            return jsonify({"message": "Admin role required"}), 403
        return f(*args, **kwargs)
    return decorated

# Public config endpoint (consider securing this)
@auth_bp.route("/config", methods=["GET"], endpoint="auth_config")
def get_config():
    return jsonify({
        "auth0_domain": current_app.config['AUTH0_DOMAIN'],
        "client_id": current_app.config['AUTH0_CLIENT_ID'],
        "audience": current_app.config['API_AUDIENCE']
    })

# Example protected route (for testing)
@auth_bp.route("/test", methods=["GET"])
@requires_auth
def test_auth():
    return jsonify({
        "message": "Authenticated!",
        "user_id": request.auth0_id,
        "roles": request.auth0_roles
    })

# Example admin-only route (for testing)
@auth_bp.route("/admin/test", methods=["GET"])
@requires_admin
def test_admin():
    return jsonify({"message": "Welcome, Admin!"})