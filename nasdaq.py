import websocket
import threading
import time
import json

class nasdaq():

    def __init__(self, start, end, symbol):
        self.start = start
        self.end = end
        self.symbol = symbol
        self.prices = []
    def on_message(self, ws, message):
        print(message)
        self.prices.append(json.loads(message))

    def on_error(self, ws, error):
        print(error)

    def on_close(self, ws):
        print("### closed ###")

    def on_open(self, ws):
        def run():
            self.ws.send("")
            time.sleep(1)
            self.ws.close()
        threading.Thread(target=run).start()

    def get_prices(self):
        
        websocket.enableTrace(True)


        url = 'ws://35.161.245.102/stream?symbol={}&start={}&end={}'.format(self.symbol, self.start, self.end)

        self.ws = websocket.WebSocketApp(url,
                                    on_message = self.on_message,
                                    on_error = self.on_error,
                                    on_close = self.on_close)
        self.ws.on_open = self.on_open
        self.ws.run_forever()

