from psycopg2 import connect, OperationalError
from psycopg2.extras import RealDictCursor

class PostgresConnector:
    '''
    Wrapper class for managing a psycopg2 connection to a postgres database.
    '''

    def __init__(self, config) -> None:
        '''
        Constructor.

        Parameters:
            config - ConfigParser init file with database settings.
        '''
        self.conn = None
        self.config = config

    def GetDatabaseConnection(self) -> None:
        '''
        Establishes a connection with the database specified in self.config file.
        '''
        try:
            params = {
                'database': self.config['DatabaseSettings']['Database'],
                'user': self.config['DatabaseSettings']['User'],
                'password': self.config['DatabaseSettings']['Password'],
                'host': self.config['DatabaseSettings']['Endpoint'],
                'port': self.config['DatabaseSettings']['port']
            }
            self.conn = connect(**params)
            self.conn.autocommit = True
        except BaseException as err:
            print(err)

    def getCursor(self) -> RealDictCursor:
        """
        Retrieve a cursor from the database connection.

        Returns:
            RealDictCursor: A psycopg2 cursor.
        """
        while self.conn == None or self.conn.closed:
            self.GetDatabaseConnection()
        try:
            self.conn.isolation_level
        except OperationalError:
            self.GetDatabaseConnection()
        return self.conn.cursor(cursor_factory=RealDictCursor)

        
