# routes/motivation.py
from flask import Blueprint, jsonify
from models import Motivation
import random

motivation_bp = Blueprint("motivation", __name__)

@motivation_bp.route("/motivation/random", methods=["GET"], endpoint="motivation_random")
def get_random_motivation():
    motivations = Motivation.query.all()
    if not motivations:
        return jsonify({"quote": "Stay motivated!", "author": "G5 Fitness"})
    motivation = random.choice(motivations)
    return jsonify({"quote": motivation.quote, "author": motivation.author})