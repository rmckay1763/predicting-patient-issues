import psycopg2
import psycopg2.extras
import configparser
from sshtunnel import SSHTunnelForwarder

class PostgresConnector:
    tunnel = None
    curr = None
    config = None
    port = None

    def __init__(self, config):
        self.config = config
        
        # If Remote flag is given, initialize and start SSHTunnel, and then establish
        # connection to database. 
        if(self.config.getboolean('SSHTunnelSettings', 'UseTunnel')):
            self.OpenSSHTunnel()
            self.tunnel.start()
            self.port = self.tunnel.local_bind_port
        
        # Else (if the service is being run on the server), ignore SSH Tunneling
        else:
             self.port = int(config['DatabaseSettings']['port'])

    # Opens database connection globally on given port
    # (must use OpenSSHTunnel if connecting remotely)
    def GetDatabaseConnection(self):
        try:
            params = {
                'database': self.config['DatabaseSettings']['Database'],
                'user': self.config['DatabaseSettings']['User'],
                'password': self.config['DatabaseSettings']['Password'],
                'host': self.config['DatabaseSettings']['Endpoint'],
                'port': self.port
            }
            connection =  psycopg2.connect(**params)
            return connection
        except BaseException as err:
            print(err)
            return None

    # Opens SSH Tunnel globally to establish database connection remotely
    def OpenSSHTunnel(self):
        try:
            self.tunnel = SSHTunnelForwarder(
                (self.config['SSHTunnelSettings']['Endpoint'], int(self.config['SSHTunnelSettings']['Port'])),
                ssh_username = self.config['SSHTunnelSettings']['Username'],
                ssh_password = self.config['SSHTunnelSettings']['Password'], 
                remote_bind_address=(self.config['DatabaseSettings']['Endpoint'], int(self.config['DatabaseSettings']['Port'])))
        except BaseException as err:
            print(err)
            return None

        
