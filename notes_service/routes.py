from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Note

note_bp = Blueprint("notes", __name__, url_prefix="/notes")

#post note
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

#get note 
@note_bp.route("/", methods=["GET"])
@jwt_required()
def get_notes():
    user_id = int(get_jwt_identity())
    notes = Note.query.filter_by(user_id=user_id).all()

    notes_data = [
        {"id": note.id, "title": note.title, "content": note.content}
        for note in notes
    ]

    return jsonify(notes_data), 200

#update note
@note_bp.route("/<int:note_id>", methods=["PUT"])
@jwt_required()
def update_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({"error": "Note not found"}), 404

    data = request.get_json()
    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)

    db.session.commit()
    return jsonify({"message": "Note updated successfully"}), 200


#delete note
@note_bp.route("/<int:note_id>", methods=["DELETE"])
@jwt_required()
def delete_note(note_id):
    user_id = int(get_jwt_identity())
    note = Note.query.filter_by(id=note_id, user_id=user_id).first()

    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted successfully"}), 200
