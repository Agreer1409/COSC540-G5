# backend/routes/motivation.py
from flask import Blueprint, jsonify
from models import db, Motivation
import random

motivation_bp = Blueprint("motivation", __name__)

@motivation_bp.route("/motivation/random", methods=["GET"])
def get_random_motivation():
    motivations = Motivation.query.all()
    if not motivations:
        return jsonify({"quote": "Stay motivated!", "author": "G5 Fitness"}), 200
    random_motivation = random.choice(motivations)
    return jsonify({"quote": random_motivation.quote, "author": random_motivation.author})