from flask import Flask
from config import Config
from extensions import db, jwt
from routes import note_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt.init_app(app)

# Register routes
app.register_blueprint(note_bp, url_prefix="/notes")

if __name__ == "__main__":
    app.run(port=5001, debug=True) 
