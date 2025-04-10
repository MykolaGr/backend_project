from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Note

note_bp = Blueprint("notes", __name__)

@note_bp.route("/", methods=["POST"])
@jwt_required()
def create_note():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    title = data.get("title")
    content = data.get("content")

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    note = Note(title=title, content=content, user_id=int(user_id))
    db.session.add(note)
    db.session.commit()

    return jsonify({"message": "Note created!"}), 201


@note_bp.route("/", methods=["GET"])
@jwt_required()
def get_notes():
    user_id = int(get_jwt_identity())
    notes = Note.query.filter_by(user_id=user_id).all()

    return jsonify([
        {"id": note.id, "title": note.title, "content": note.content}
        for note in notes
    ])
