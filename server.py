from flask import Flask, render_template, request, session, json
from data_handler import DataBase
import os

db = DataBase()
app = Flask(__name__)

app.secret_key = os.environ.get('SESSION_KEY')


@app.route('/')
def main():
    return render_template('index.html')


@app.route('/login-status')
def login_status():
    return session.get('current_user', '')


@app.route('/login', methods=['POST'])
def login():
    login_valid = db.check_user(request.form['username'], request.form['password'])
    if login_valid:
        session['current_user'] = request.form['username']
        return request.form['username']
    return ''


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
        return request.form['username']
    return ''


@app.route('/vote', methods=['POST'])
def register_vote():
    if session.get('current_user') != request.form['username']:
        return ''
    if db.register_vote(request.form['username'], request.form['planetName'], request.form['planetId']):
        return 'Vote received!'
    return ''


@app.route('/current-user-votes')
def get_current_user_votes():
    current_user = session.get('current_user')
    if not current_user:
        return json.jsonify([])
    return json.jsonify(db.query_user_votes(current_user))


@app.route('/list-votes')
def list_votes():
    return json.jsonify(db.get_vote_counts())


if __name__ == '__main__':
    app.run()
