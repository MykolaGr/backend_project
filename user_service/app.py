from flask import Flask
from config import Config
from routes import user_bp
from extensions import db, bcrypt, jwt 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

app.register_blueprint(user_bp, url_prefix="/users")

if __name__ == "__main__":
    app.run(debug=True)
