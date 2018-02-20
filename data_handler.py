from connection import Connector
from datetime import datetime
import bcrypt


class DataBase:

    def __init__(self):
        self.connection = Connector.connection_from_envvars()
        self.cursor = self.connection.cursor

    def check_user(self, username, password):
        self.cursor.execute("SELECT password FROM users WHERE username = %(usn)s", {'usn': username})
        user_entry = self.cursor.fetchone()

        if not user_entry:
            return False

        return bcrypt.checkpw(password.encode('utf-8'), user_entry['password'].encode('utf-8'))

    def register_user(self, username, password):
        self.cursor.execute("SELECT username FROM users WHERE username = %(usn)s", {'usn': username})
        if self.cursor.fetchone():
            return False

        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self.cursor.execute("INSERT INTO users (username, password) VALUES (%(usn)s, %(pw)s)", {
            'usn': username, 'pw': hashed_pw.decode('utf-8')
        })
        return True

    def get_id_by_username(self, username):
        self.cursor.execute("SELECT id FROM users WHERE username = %(usn)s", {'usn': username})
        return self.cursor.fetchone()['id']

    def register_vote(self, username, planet_name, planet_id):
        user_id = self.get_id_by_username(username)
        self.cursor.execute("SELECT id FROM planet_votes WHERE user_id = %(us_id)s AND planet_id = %(p_id)s", {
            'us_id': user_id, 'p_id': planet_id
        })
        if self.cursor.fetchone():
            return False

        current_dtime = datetime.today().strftime("%Y-%m-%d %H:%M:%S")
        self.cursor.execute("""INSERT INTO planet_votes (planet_id, planet_name, user_id, submission_time)
                                 VALUES (%(p_id)s, %(p_name)s, %(us_id)s, %(sm_time)s)""", {
            'p_id': planet_id, 'p_name': planet_name, 'us_id': user_id, 'sm_time': current_dtime
        })
        return True

    def query_user_votes(self, username):
        user_id = self.get_id_by_username(username)
        self.cursor.execute("SELECT planet_name FROM planet_votes WHERE user_id = %(us_id)s", {'us_id': user_id})
        return [vote['planet_name'] for vote in self.cursor.fetchall()]
