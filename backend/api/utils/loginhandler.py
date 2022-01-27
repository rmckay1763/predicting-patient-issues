from fastapi.exceptions import HTTPException
from api.userinfo.models import LoginAttempt
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.utils.authhandler import AuthHandler

class LoginHandler():
    """
    Authenticates user logins sent from the frontend.
    """

    def __init__(self, users: UserCRUD, logins: LoginCRUD, auth: AuthHandler):
        self.users = users
        self.logins = logins
        self.auth = auth

    async def login(self, attempt: LoginAttempt):
        """
        Authenticates an attempted login.

        Parameters:
            attempt (LoginAttempt): The attempted login.
            users (UsersUtils): To query users table.
            auth (AuthHandler): Authentication handler.

        Raises:
            HTTPException: If authentication fails.

        Returns:
            token (str): Session token.
        """
        uid = await self.users.fetchKey(attempt.username)
        actual = await self.logins.fetchOne(uid["uid"])
        if (not self.auth.verify_password(attempt.password, actual.password)):
            raise HTTPException(status_code=401, detail='Password is incorrect!')
        token = self.auth.encode_token(actual.uid)
        user = await self.users.fetchOne(uid["uid"])
        return {"token" : token, "user": user}