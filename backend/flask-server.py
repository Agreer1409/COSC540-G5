from flask import Flask, jsonify
from flask_cors import CORS
app = Flask(__name__)

CORS(app)
BASE_ROUTE = "/fitness-api"
@app.route(BASE_ROUTE)
def home():
    return jsonify("hello from the other side")


if __name__ == "__main__":
    app.run(debug=True)