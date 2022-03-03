from cgitb import handler
from api import dependencies
dependencies.init()
from api.dependencies import auth, config
from api.mainapi import MainAPI
from api.utils.postgresconnector import PostgresConnector
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolecrud import RoleCRUD
from api.userinfo.crud.patientcrud import PatientCRUD
from api.userinfo.crud.vitalcrud import VitalCRUD
from api.userinfo.crud.archivecrud import ArchiveCRUD
from api.userinfo.router.userrouter import UserRouter
from api.userinfo.router.rolerouter import RoleRouter
from api.userinfo.router.loginrouter import LoginRouter
from api.userinfo.router.patientrouter import PatientRouter
from api.userinfo.router.vitalrouter import VitalRouter
from api.userinfo.router.mlrouter import MLRouter
from api.userinfo.router.archiverouter import ArchiveRouter
from api.utils.loginhandler import LoginHandler
from api.utils.mlhandler import MLHandler
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
        logins = LoginCRUD(connector, users, auth)
        patients = PatientCRUD(connector)
        vitals = VitalCRUD(connector)
        archive = ArchiveCRUD(connector)
        loginHandler = LoginHandler(users, logins, auth)
        mlHandler = MLHandler()
        usersRouter = UserRouter(users, logins)
        rolesRouter = RoleRouter(roles)
        loginRouter = LoginRouter(logins, users)
        patientRouter = PatientRouter(patients)
        vitalRouter = VitalRouter(vitals)
        archiveRouter = ArchiveRouter(archive)
        mlRouter = MLRouter(patients, mlHandler)
        api = MainAPI(loginHandler)
        api.addRouter(usersRouter.router)
        api.addRouter(rolesRouter.router)
        api.addRouter(loginRouter.router)
        api.addRouter(patientRouter.router)
        api.addRouter(vitalRouter.router)
        api.addRouter(mlRouter.router)
        api.addRouter(archiveRouter.router)
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