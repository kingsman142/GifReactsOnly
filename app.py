from app import app
import os
from flask import Flask, request, redirect, url_for
from werkzeug.utils import secure_filename

app = Flask(__name__)
UPLOAD_FOLDER = 'pix'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

@app.route('/')
def homepage():
    the_time = datetime.now().strftime("%A, %d %b %Y %l:%M %p")
    return """

    <h1>Hello heroku</h1>
    <p>It is currently {time}.</p>

    <img src="http://loremflickr.com/600/400">
    """.format(time=the_time)
'''
@app.route('/post', methods=['GET', 'POST'])
def upload_file():
        if request.method == 'POST':
            return """
            <h1>got post</h1>
            """
'''
if __name__ == "__main__":
    app.run(debug=True)
