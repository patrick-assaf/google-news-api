# Google News Application

## Description
An application that allows the user to search for news articles and information using the Google News API. The homepage displays top headlines with a word cloud of frequently used keywords in recent news. The search feature allows the user to filter through articles by dates, category, sources, or keywords and display the results.

### Installing
Create a virtual environment:
```
$ mkdir newsapp
$ cd newsapp
$ python3 -m venv venv
```

Activate the environment:
```
$ . venv/bin/activate
```

Install Flask:
```
$ pip3 install Flask
```

### File Structure
The following structure allows Flask to serve all files statically from the static subfolder. No template rendering is needed for this application, so no template subfolder is required.
```
project
│   README.md
│   application.py
|   requirements.tx
|   stopwords_en.txt    
│
└───static
        index.html
        scripts.js
        styles.css
        x-icon.png
```

### Deployment
Use Flask's built-in server for development and local testing. For production, deploy the application to a WSGI server. Popular options include AWS Elastic Beanstalk, Google Cloud Platform (GCP), and Microsoft Azure App Service.
