from flask import request, jsonify
from flask import Blueprint
from flask_jwt_extended import create_access_token
from models import User
from extensions import db, bcrypt 

user_bp = Blueprint("user", __name__)

@user_bp.route("/register", methods=["POST"])
def register():
    #Get the user data from the request
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(username=username, password=hashed_password)

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@user_bp.route("/login", methods=["POST"])
def login():
    #Get the user data from the request
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400


    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "Invalid username or password"}), 401


    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    #Create the JWT token
    access_token = create_access_token(identity=str(user.id))
    
    #Return the token
    return jsonify({"message": "Login successful", "access_token": access_token}), 200