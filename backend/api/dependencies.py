from configparser import ConfigParser
from api.utils.authhandler import AuthHandler

def init() -> None:
    '''
    Initializes global variables needed for authenticating tokens.
    '''
    global config
    global auth
    config = ConfigParser()
    config.read('settings.ini')
    config.sections()
    auth = AuthHandler(config)