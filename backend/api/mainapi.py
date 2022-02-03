from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from api.utils.loginhandler import LoginHandler
from api.userinfo.models import LoginAttempt

class MainAPI:
    '''
    Implements a fastapi with routers.
    '''
    def __init__(self, loginHandler: LoginHandler):
        self.loginHandler = loginHandler
        self.app = FastAPI()
        self.origins = [
            "http://localhost",
            "http://localhost:8000",
            "http://localhost:5000",
            "http://04.csc.tntech.edu"
        ]
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins = self.origins,
            allow_credentials = True,
            allow_methods = ['*'],
            allow_headers = ['*']
        )
        self.app.post("/api/login/")(self.login)

    def addRouter(self, router: APIRouter):
        '''
        Add a router to the fastapi.

        Parameters:
            router (APIRouter): The router to add.
        '''
        self.app.include_router(router)

    async def login(self, attempt: LoginAttempt):
        """
        Route to authenticate an attempted login.

        Parameters:
            attempt (LoginAttempt): The attempted login.

        Raises:
            HTTPException: If authentication fails.

        Returns:
            token (str): Session token.
        """
        try:
            return await self.loginHandler.login(attempt)
        except BaseException as err:
            raise err
