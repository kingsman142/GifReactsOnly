import os
from bs4 import BeautifulSoup
import calendar
import logging
from flask import Flask, render_template, request, url_for, jsonify
from aylienapiclient import textapi

import requests
import json
import nasdaq
from datetime import datetime, timedelta
app = Flask(__name__)

top_dates = {}
def get_symbol(query): 
    query = '+'.join(query.split()) 
    return requests.get('http://d.yimg.com/aq/autoc?query=' + query + '&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks').text


@app.route('/getDates', methods=['GET', 'POST'])
def my_endpoint(): json_data = request.get_json(force=True)
    print(json_data)

    x = get_symbol(json_data['company'])
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
        top_dates['dates'] = sorted([x[1] for x in best_dates[-5:]])
        top_dates['symbol'] = code
              
        return jsonify(top_dates)
    else:
        return jsonify({'dates':[]})

@app.route('/getGifs', methods=['GET', 'POST'])
def gif_endpoint():
    json_data = request.get_json(force=True)
    s = json_data['date']
    date = datetime.strptime(s, "%Y-%m-%d")
    modified_date = date + timedelta(days=1)
    end = datetime.strftime(modified_date, "%Y-%m-%d")
    start = s 
    code = json_data['symbol']
    url = 'https://finance.google.com/finance/company_news?q=NASDAQ%3A{}&start=0&num=5&startdate={}&enddate={}'.format(code, start, end)
    print(url)
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html5lib')
    articles = soup.find_all("a", {"id":"n-cn-"}) 
    link_title = [(x.attrs['href'], x.text) for x in articles]
    print(link_title)
    lt = link_title[0]
    ac = textapi.Client("725d5361", "ca278c04e1bc935d40bf3a7ade951836")
    result = ac.Summarize({'url':lt, 'sentences_number':3})
    gifs = {'gifs':[(link, get(link)['data']['url']) for link in result['sentences']}

    return jsonify(gifs)

def get(query):
        query.replace(' ', '+')   
            web = requests.get('http://api.giphy.com/v1/gifs/translate?s='+ query + '&api_key=QU32gJsZ8f0iRR2nTE0uDtmq69RZmAw2&limit=5').text
            data = json.loads(web)
            return data






if __name__ == '__main__':
    app.run(debug=True)
