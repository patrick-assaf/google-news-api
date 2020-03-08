from flask import Flask, request, jsonify
from newsapi import NewsApiClient

application = Flask(__name__)

newsapi = NewsApiClient(api_key='2108471b175647ec9f491085b681aafe')

cnn_headlines = newsapi.get_top_headlines(sources="cnn", language="en")
fox_headlines = newsapi.get_top_headlines(sources="fox-news", language="en")
slide_headlines = newsapi.get_top_headlines(language="en", page_size=30)

titles = ''
for article in slide_headlines["articles"]:
    if "title" in article:
        titles += article["title"] + ' '

stopwords = set(line.strip() for line in open('stopwords_en.txt'))

wordcount = {}

for word in titles.lower().split():
    if word not in stopwords:
        if word not in wordcount and word.isalnum():
            wordcount[word] = 1
        elif word in wordcount:
            wordcount[word] += 1

sorted_cloud = sorted(wordcount, key=wordcount.get, reverse=True)

cloud = {}

for word in sorted_cloud:
    if len(cloud) < 30:
        cloud[word] = wordcount[word]

@application.route('/word-cloud', methods=['GET'])
def word_cloud():
    return jsonify({'cloud': cloud})

@application.route('/', methods=['GET'])
def root():
    return application.send_static_file('index.html')

@application.route('/cnn-headlines', methods=['GET'])
def get_cnn_headlines():
    return jsonify({'headlines': cnn_headlines})

@application.route('/fox-headlines', methods=['GET'])
def get_fox_headlines():
    return jsonify({'headlines': fox_headlines})

@application.route('/slide-headlines', methods=['GET'])
def get_carousel_headlines():
    return jsonify({'headlines': slide_headlines})

if __name__ == '__main__':
    application.run(debug=True)