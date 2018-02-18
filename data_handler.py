from connection import Connector
import bcrypt


class DataBase:

    def __init__(self):
        self.connection = Connector.connection_from_envvars()
        self.cursor = self.connection.cursor
