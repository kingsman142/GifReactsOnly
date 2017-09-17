import os
import logging
from flask import Flask, render_template, request, url_for, jsonify
#from werkzeug.utils import secure_filename
import requests
import json
app = Flask(__name__)
def get_stuff(query):
    return requests.get('http://d.yimg.com/aq/autoc?query=' + query + '&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks').text


@app.route('/tests/endpoint', methods=['GET', 'POST'])
def my_test_endpoint():
    
    input_json = request.get_json(force=False) 
    # force=True, above, is necessary if another developer 
    # forgot to set the MIME type to 'application/json'
#    print('data from client:', input_json)
    company = input_json['company']
    x = get_stuff(company)
    dictToReturn = {'answer': json.loads(x[x.find('{'):-2])}
    return jsonify(dictToReturn)

if __name__ == '__main__':
    app.run(debug=True)
