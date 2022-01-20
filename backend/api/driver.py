from api import dependencies
dependencies.init()
from api.dependencies import auth, config
from api.mainapi import MainAPI
from api.utils.postgresconnector import PostgresConnector
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolecrud import RoleCRUD
from api.userinfo.crud.patientcrud import PatientCRUD
from api.userinfo.router.userrouter import UserRouter
from api.userinfo.router.rolerouter import RoleRouter
from api.userinfo.router.loginrouter import LoginRouter
from api.userinfo.router.patientrouter import PatientRouter
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
        users = UserCRUD(connector)
        roles = RoleCRUD(connector)
        logins = LoginCRUD(connector)
        patients = PatientCRUD(connector)
        loginHandler = LoginHandler(users, logins, auth)
        usersRouter = UserRouter(users)
        rolesRouter = RoleRouter(roles)
        loginRouter = LoginRouter(logins)
        patientRouter = PatientRouter(patients)
        api = MainAPI(loginHandler)
        api.addRouter(usersRouter.router)
        api.addRouter(rolesRouter.router)
        api.addRouter(loginRouter.router)
        api.addRouter(patientRouter.router)
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