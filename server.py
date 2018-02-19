from flask import Flask, render_template, request, session
from data_handler import DataBase
import json
import os

db = DataBase()
app = Flask(__name__)

app.secret_key = os.environ.get('SESSION_KEY')


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    login_valid = db.check_user(request.form['username'], request.form['password'])
    if login_valid:
        session['current_user'] = request.form['username']
    return json.dumps(login_valid)


@app.route('/logout')
def logout():
    if session.get('current_user'):
        session.pop('current_user', None)
    return ''


@app.route('/register', methods=['POST'])
def register():
    reg_valid = db.register_user(request.form['username'], request.form['password'])
    if reg_valid:
        session['current_user'] = request.form['username']
    return json.dumps(reg_valid)


if __name__ == '__main__':
    app.run(debug=True)
