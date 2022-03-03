from fastapi import APIRouter, Depends, HTTPException
from api.userinfo.models import Login, LoginUpdated
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.usercrud import UserCRUD
from api.dependencies import auth

class LoginRouter():
    '''
    Implements routes for the login table using an APIRouter
    '''

    def __init__(self, logins: LoginCRUD, users: UserCRUD):
        '''
        Constructor.

        Parameters:
            logins (LoginCrud): The crud to interact with the table.
        '''
        self.logins = logins
        self.users = users
        self.router = APIRouter(
            prefix="/api/login",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchOne/{key}")(self.fetchOne)
        self.router.post("/insert/")(self.insert)
        self.router.put("/update/")(self.update)
        self.router.delete("/delete/")(self.delete)

    async def fetchOne(self, key: int):
        """
        Route to fetch a login given the primary key.

        Parameters:
            key (int): The primary key (uid) of the login.

        Returns:
            Login: The login as a login model.
        """
        try:
            return await self.logins.fetchOne(key)
        except BaseException as err:
            raise err

    async def insert(self, login: Login, uid=Depends(auth.auth_wrapper)):
        """
        Route to insert a new login into the login table.

        Parameters:
            login (Login): The new login to insert.

        Returns:
            RealDictRow: The primay key of the new login.
        """
        try:
            await self.authenticate(uid, None)
            return await self.logins.insert(login)
        except BaseException as err:
            raise err

    async def update(self, updated: LoginUpdated, uid=Depends(auth.auth_wrapper)):
        """
        Route to update a login in the login table.

        Parameters:
            updated (Login): The login with the updated data.

        Returns:
            Login: The result of the update.
        """

        try:
            await self.authenticate(uid, updated.uid)
            return await self.logins.update(updated)
        except BaseException as err:
            raise err

    async def delete(self, key: int, uid=Depends(auth.auth_wrapper)):
        """
        Route to delete a login from the login table.

        Parameters:
            key (int): The primary key (uid) of the login.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            await self.authenticate(uid, key)
            return await self.logins.delete(key)
        except BaseException as err:
            raise err

    async def authenticate(self, actual: int, candidate: int):
        """
        Authenticate the user for the request. 
        Checks if uid of current user matches uid of request or if current user is an admin.
        For admin only authentication, pass in 'None' for candidate

        Parameters:
            actual (int): The primary key (uid) of the current user.
            candidate (int): The primary key of the login to modify.

        Raises:
            HTTPException: Upon failed authentication.
        """
        if (actual == candidate):
            return
        user = await self.users.fetchOne(actual)
        if (user.admin):
            return
        raise HTTPException(status_code=401, detail='Unauthenticated user id')