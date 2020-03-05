from flask import Flask, request, jsonify
from newsapi import NewsApiClient

app = Flask(__name__)

newsapi = NewsApiClient(api_key='2108471b175647ec9f491085b681aafe')

top_headlines = newsapi.get_top_headlines(q='bitcoin', category='business', language='en', country='us')

@app.route('/', methods=['GET'])
def root():
    return app.send_static_file('index.html')

@app.route('/headlines', methods=['GET'])
def get_headlines():
    return jsonify({'headlines': top_headlines})

if __name__ == '__main__':
    app.run(debug=True)