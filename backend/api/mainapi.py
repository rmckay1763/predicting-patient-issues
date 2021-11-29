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
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins = ['*'],
            allow_credentials = True,
            allow_methods = ['*'],
            allow_headers = ['*']
        )
        self.app.post("/login/")(self.login)

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
