import os
import psycopg2
import psycopg2.extras
import urllib.parse


class Connector:

    def __init__(self, connection_string):
        self.connection = self.open_database(connection_string)
        self.cursor = self.connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    @classmethod
    def connection_from_envvars(cls):
        user_name = os.environ.get('PSQL_USER_NAME')
        password = os.environ.get('PSQL_PASSWORD')
        host = os.environ.get('PSQL_HOST')
        database_name = os.environ.get('PSQL_DB_NAME')

        if user_name and password and host and database_name:
            connection_string = 'postgresql://{0}:{1}@{2}/{3}'.format(
                user_name, password, host, database_name)
            return cls(connection_string)
        else:
            raise KeyError('Some necessary environment variable(s) are not defined')

    @classmethod
    def connection_from_remote(cls):
        urllib.parse.uses_netloc.append('postgres')
        url = urllib.parse.urlparse(os.environ.get('DATABASE_URL'))

        user_name = url.username
        password = url.password
        host = url.hostname
        port = url.port
        database_name = url.path[1:]

        if user_name and password and host and port and database_name:
            connection_string = 'postgresql://{0}:{1}@{2}:{3}/{4}'.format(
                user_name, password, host, port, database_name)
            return cls(connection_string)
        else:
            raise KeyError('Could not fetch connection data!')

    @staticmethod
    def open_database(connection_string):
        try:
            connection = psycopg2.connect(connection_string)
            connection.autocommit = True
        except psycopg2.DatabaseError as exception:
            print('Database connection problem')
            raise exception
        return connection
