from http.client import HTTPException
from fastapi import FastAPI, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from api.userinfo.models import LoginAttempt, LoginSuccess
from api.dependencies import auth
from api.userinfo.services.userservice import UserService

class MainAPI:
    '''
    Implements a fastapi with routers.
    '''
    def __init__(self, userService: UserService) -> None:
        self.userService = userService
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
        self.app.get("/api/validate/")(self.validate)
        self.app.get("/api/validateAdmin/")(self.validateAdmin)

    def addRouter(self, router: APIRouter) -> None:
        '''
        Add a router to the fastapi.

        Parameters:
            router (APIRouter): The router to add.
        '''
        self.app.include_router(router)

    async def login(self, attempt: LoginAttempt) -> LoginSuccess:
        """
        Route to authenticate an attempted login.

        Parameters:
            attempt (LoginAttempt): The attempted login.

        Raises:
            HTTPException: If authentication fails.

        Returns:
            LoginSuccess: Bearer token and UserOut model for logged in user.
        """
        try:
            return await self.userService.login(attempt)
        except BaseException as err:
            raise err

    async def validate(self, uid=Depends(auth.auth_wrapper)) -> int:
        """
        Route to check bearer token.

        Raises:
            HTTPException: Status 401 if authentication fails.

        Returns:
            uid (int): uid of the current user.
        """
        return uid

    async def validateAdmin(self, uid=Depends(auth.auth_wrapper)) -> int:
        """
        Route to check bearer token for admin authentication.

        Raises:
            HTTPException: Status 401 if authentication fails.
            HTTPException: Status 404 if uid doesn't exist.

        Returns:
            uid (int): uid of the current user.
        """
        try:
            user = await self.userService.fetchUser(uid)

            if (user.admin):
                return user.uid
            else:
                raise HTTPException(status_code=401, detail='User is unauthenticated')

        except BaseException as err:
            raise err
