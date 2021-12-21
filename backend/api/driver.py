from api import dependencies
dependencies.init()
from api.dependencies import auth, config
from api.mainapi import MainAPI
from api.utils.postgresconnector import PostgresConnector
from api.userinfo.crud.userscrud import UsersCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolescrud import RolesCRUD
from api.userinfo.router.usersrouter import UsersRouter
from api.userinfo.router.rolesrouter import RolesRouter
from api.userinfo.router.loginrouter import LoginRouter
from api.utils.loginhandler import LoginHandler
import uvicorn
import subprocess
import shlex

class APIDriver:
    '''
    Contains methods to create and run the api.
    '''

    @staticmethod
    def getInstance():
        '''
        Configures and instantiates the fastapi.

        Returns:
            FastAPI: An instance of the the fastapi.
        '''
        connector = PostgresConnector(config)
        users = UsersCRUD(connector)
        roles = RolesCRUD(connector)
        logins = LoginCRUD(connector)
        loginHandler = LoginHandler(users, logins, auth)
        usersRouter = UsersRouter(users)
        rolesRouter = RolesRouter(roles)
        loginRouter = LoginRouter(logins)
        api = MainAPI(loginHandler)
        api.addRouter(usersRouter.router)
        api.addRouter(rolesRouter.router)
        api.addRouter(loginRouter.router)
        return api.app

    @staticmethod
    def start():
        '''
        Start the api in deployment mode.
        Note: the api will start as a separate process.
        Use 'pkill gunicorn' to stop the service once started.
        '''
        cmd = ("gunicorn main:app "
            "--workers 4 "
            "--worker-class uvicorn.workers.UvicornWorker "
            "--bind 0.0.0.0:8000 "
            "--daemon")
        cmds = shlex.split(cmd)
        subprocess.Popen(cmds, start_new_session=True)

    @staticmethod
    def startDevMode():
        '''
        Start the service in development mode (reload mode)
        '''
        uvicorn.run("main:app", host='0.0.0.0', port=8000, reload=True)