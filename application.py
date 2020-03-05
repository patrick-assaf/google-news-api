from flask import Flask, request

# Create an instance of the Flask class
app = Flask(__name__, static_url_path='/static/')

#Use the route() decorator to tell Flask what URL should trigger our function
@app.route('/')
def root():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)