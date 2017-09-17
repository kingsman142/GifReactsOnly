import requests, json
import sys
query = '+'.join(sys.argv)
web = requests.get('http://api.giphy.com/v1/gifs/search?q='+ query + '&api_key=QU32gJsZ8f0iRR2nTE0uDtmq69RZmAw2&limit=5').text
data = json.loads(web)
