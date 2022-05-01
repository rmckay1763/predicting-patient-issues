from fastapi import FastAPI
from api import dependencies
dependencies.init()
from api.dependencies import config
from api.mainapi import MainAPI
from api.utils.postgresconnector import PostgresConnector
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolecrud import RoleCRUD
from api.userinfo.crud.rankcrud import RankCRUD
from api.userinfo.crud.patientcrud import PatientCRUD
from api.userinfo.crud.vitalcrud import VitalCRUD
from api.userinfo.crud.archivecrud import ArchiveCRUD
from api.userinfo.services.userservice import UserService
from api.userinfo.services.patientservice import PatientService
from api.userinfo.services.archiveservice import ArchiveService
from api.userinfo.router.userrouter import UserRouter
from api.userinfo.router.patientrouter import PatientRouter
from api.userinfo.router.archiverouter import ArchiveRouter
import uvicorn
import subprocess
import shlex

class APIDriver:
    '''
    Contains methods to create and run the api.
    '''

    @staticmethod
    def getInstance() -> FastAPI:
        '''
        Configures and instantiates the fastapi.

        Returns:
            FastAPI: An instance of the the fastapi service.
        '''
        # database connection
        connector = PostgresConnector(config)

        # crud classes
        users = UserCRUD(connector)
        roles = RoleCRUD(connector)
        ranks = RankCRUD(connector)
        logins = LoginCRUD(connector)
        patients = PatientCRUD(connector)
        vitals = VitalCRUD(connector)
        archive = ArchiveCRUD(connector)

        # service/handler classes
        userService = UserService(users, logins, roles, ranks)
        patientService = PatientService(patients, vitals)
        archiveService = ArchiveService(archive)

        # router classes
        userRouter = UserRouter(userService)
        patientRouter = PatientRouter(patientService)
        archiveRouter = ArchiveRouter(archiveService)

        # main api module
        api = MainAPI(userService)
        api.addRouter(userRouter.router)
        api.addRouter(patientRouter.router)
        api.addRouter(archiveRouter.router)
        return api.app

    '''
    NOTE:  No need for the following methods if using docker.
    '''

    @staticmethod
    def start() -> None:
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
    def startDevMode() -> None:
        '''
        Start the service in development mode (hot reloading)
        '''
        uvicorn.run("main:app", host='0.0.0.0', port=8000, reload=True)