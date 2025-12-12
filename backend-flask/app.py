from flask import Flask, jsonify

app = Flask(__name__)

# Povolí CORS pro komunikaci s frontendem
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:9002' # Změňte na port, na kterém běží váš frontend
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# Základní API endpoint
@app.route('/api/flask-hello')
def hello_flask():
    return jsonify(message='Hello from Flask backend!')

if __name__ == '__main__':
    app.run(debug=True, port=3002)
