from connection import Connector
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
