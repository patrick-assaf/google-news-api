from flask import Flask, request, jsonify
from newsapi import NewsApiClient

app = Flask(__name__)

newsapi = NewsApiClient(api_key='2108471b175647ec9f491085b681aafe')

cnn_headlines = newsapi.get_top_headlines(sources="cnn", language="en")
fox_headlines = newsapi.get_top_headlines(sources="fox-news", language="en")
slide_headlines = newsapi.get_top_headlines(language="en")

@app.route('/', methods=['GET'])
def root():
    return app.send_static_file('index.html')

@app.route('/cnn-headlines', methods=['GET'])
def get_cnn_headlines():
    return jsonify({'headlines': cnn_headlines})

@app.route('/fox-headlines', methods=['GET'])
def get_fox_headlines():
    return jsonify({'headlines': fox_headlines})

@app.route('/slide-headlines', methods=['GET'])
def get_carousel_headlines():
    return jsonify({'headlines': slide_headlines})

if __name__ == '__main__':
    app.run(debug=True)