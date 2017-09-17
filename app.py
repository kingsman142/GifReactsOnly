import os
import logging
from flask import Flask, render_template, request, url_for, jsonify
#from werkzeug.utils import secure_filename
import requests
import json
app = Flask(__name__)

def get_stuff(query):
    query = '+'.join(query.split())
    return requests.get('http://d.yimg.com/aq/autoc?query=' + query + '&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks').text


@app.route('/tests/endpoint', methods=['GET', 'POST'])
def my_endpoint():
    
    json_data = request.get_json(force=True)
    print(json_data)
    x = get_stuff(json_data['company'])
    ans = {'answer': json.loads(x[x.find('{'):-2])}
    return jsonify(ans)

if __name__ == '__main__':
    app.run(debug=True)
