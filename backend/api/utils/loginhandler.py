from fastapi.exceptions import HTTPException
from api.userinfo.models import LoginAttempt, LoginSuccess
from api.utils.authhandler import AuthHandler
from api.userinfo.services.userservice import UserService

class LoginHandler():
    """
    Authenticates user logins sent from the frontend.
    """

    def __init__(self, auth: AuthHandler, service: UserService) -> None:
        '''
        Constructor.

        Parameters:
            auth (AuthHandler): Provides various authentication functions.
            service (UserService): Service to interact with database tables.
        '''
        self.auth = auth
        self.service = service

    async def login(self, attempt: LoginAttempt) -> LoginSuccess:
        """
        Authenticates an attempted login.

        Parameters:
            attempt (LoginAttempt): The attempted login.

        Raises:
            HTTPException: If authentication fails.

        Returns:
            LoginSuccess: Bearer token and UserOut model for logged in user.
        """
        try:
            uid = await self.service.fetchUid(attempt.username)
            actual = await self.service.fetchPassword(uid["uid"])
            if (not self.auth.verify_password(attempt.password, actual.password)):
                raise HTTPException(status_code=401, detail='Password is incorrect!')
            token = self.auth.encode_token(actual.uid)
            user = await self.service.fetchUser(uid["uid"])
            return LoginSuccess(token = token, user = user)
        except BaseException as err:
            raise err
