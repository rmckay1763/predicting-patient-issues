from fastapi import APIRouter, Depends
from api.userinfo.models import Login
from api.userinfo.crud.logincrud import LoginCRUD
from api.utils.authhandler import AuthHandler
from api.dependencies import auth

class LoginRouter():
    '''
    Implements routes for the login table using an APIRouter
    '''

    def __init__(self, logins: LoginCRUD):
        '''
        Constructor.

        Parameters:
            logins (LoginCrud): The crud to interact with the table.
        '''
        self.logins = logins
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

    async def insert(self, login: Login):
        """
        Route to insert a new login into the login table.

        Parameters:
            login (Login): The new login to insert.

        Returns:
            RealDictRow: The primay key of the new login.
        """
        try:
            return await self.logins.insert(login)
        except BaseException as err:
            raise err

    async def update(self, updated: Login):
        """
        Route to update a login in the login table.

        Parameters:
            updated (Login): The login with the updated data.

        Returns:
            Login: The result of the update.
        """
        try:
            return await self.logins.update(updated)
        except BaseException as err:
            raise err

    async def delete(self, key: int):
        """
        Route to delete a login from the login table.

        Parameters:
            key (int): The primary key (uid) of the login.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            return await self.logins.delete(key)
        except BaseException as err:
            raise err