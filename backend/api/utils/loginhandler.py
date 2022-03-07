from fastapi.exceptions import HTTPException
from api.userinfo.models import LoginAttempt
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.utils.authhandler import AuthHandler
from api.userinfo.services.userservice import UserService

class LoginHandler():
    """
    Authenticates user logins sent from the frontend.
    """

    def __init__(self, auth: AuthHandler, service: UserService):
        self.auth = auth
        self.service = service

    async def login(self, attempt: LoginAttempt):
        """
        Authenticates an attempted login.

        Parameters:
            attempt (LoginAttempt): The attempted login.

        Raises:
            HTTPException: If authentication fails.

        Returns:
            token (str): Session token.
        """
        uid = await self.service.fetchUid(attempt.username)
        actual = await self.service.fetchPassword(uid["uid"])
        if (not self.auth.verify_password(attempt.password, actual.password)):
            raise HTTPException(status_code=401, detail='Password is incorrect!')
        token = self.auth.encode_token(actual.uid)
        user = await self.service.fetchUser(uid["uid"])
        return {"token" : token, "user": user}
