import os
import logging
from flask import Flask, render_template, request, url_for, jsonify
import requests
import json
import nasdaq
app = Flask(__name__)


def get_stuff(query):
    query = '+'.join(query.split())
    return requests.get('http://d.yimg.com/aq/autoc?query=' + query + '&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks').text


@app.route('/getDates', methods=['GET', 'POST'])
def my_endpoint():
    
    json_data = request.get_json(force=True)
    print(json_data)

    x = get_stuff(json_data['company'])
    ans = {'answer': json.loads(x[x.find('{'):-2])}
    results = json.loads(x[x.find('{'):-2])['ResultSet']['Result']
    code = None 
    for ans in results:
        if ans['exchDisp'] == 'NASDAQ':
            code = ans['symbol']
            break

    if code is not None:
        n = nasdaq.nasdaq('20170817', '20170917', code) 
        n.get_prices()
        dates_sliding = [(abs(n.prices[i]['Close']-n.prices[i-1]['Close']),n.prices[i]['DateStamp'][:n.prices[i]['DateStamp'].find('T')]) for i in range(1, len(n.prices))]
        best_dates = sorted(dates_sliding, key=lambda x:x[0])
        top_dates = {'dates': sorted([x[1] for x in best_dates[-5:]])}
        
        return jsonify({'dates': top_dates})
    else:
        return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)
