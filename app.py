from flask import Flask
from datetime import datetime
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def homepage():
    the_time = datetime.now().strftime("%A, %d %b %Y %l:%M %p")
    if request.method == 'POST':
        return """

        <h1>Hello heroku</h1>
        <p>It is currently {time}.</p>

        <img src="http://loremflickr.com/600/400">
        """.format(time=the_time)
    else:
        return '''
        <h1>no post</h1>
        '''
if __name__ == '__main__':
	app.run(debug=True, use_reloader=True)