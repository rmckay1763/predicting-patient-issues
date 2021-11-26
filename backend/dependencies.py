from configparser import ConfigParser
from api.utils.postgresconnector import PostgresConnector
from api.utils.authhandler import AuthHandler
from api.userinfo.crud.userscrud import UsersCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolescrud import RolesCRUD
from api.utils.loginhandler import LoginHandler

def init():
    global auth
    global users
    global roles
    global logins
    global app
    global loginHandler
    config = ConfigParser()
    config.read('settings.ini')
    config.sections()
    auth = AuthHandler(config)
    connector = PostgresConnector(config)
    users = UsersCRUD(connector)
    roles = RolesCRUD(connector)
    logins = LoginCRUD(connector)
    loginHandler = LoginHandler(users, logins, auth)