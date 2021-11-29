from fastapi import APIRouter, Depends
from api.userinfo.models import Users, UsersIn
from api.userinfo.crud.userscrud import UsersCRUD
from api.dependencies import auth

class UsersRouter:
    '''
    Implements routes for the users table using an APIRouter
    '''

    def __init__(self, users: UsersCRUD):
        '''
        Constructor.

        Parameters:
            users (UsersCRUD): The crud to interact with the table.
        '''
        self.users = users
        self.router = APIRouter(
            prefix="/users",
            dependencies=[Depends(auth.auth_wrapper)])
        self.__addRoutes__()

    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchKey/{username}")(self.fetchKey)
        self.router.get("/fetchAll/")(self.fetchAll)
        self.router.get("/fetchOne/{key}")(self.fetchOne)
        self.router.post("/insert/")(self.insert)
        self.router.put("/update")(self.update)
        self.router.delete("/delete/{key}")(self.delete)

    async def fetchKey(self, username: str):
        """
        Route to fetch the primary key of a user.

        Parameters:
            username (str): The username of the user.

        Returns:
            RealDictRow: The primay key of the user.
        """
        try:
            return await self.users.fetchKey(username)
        except BaseException as err:
            raise err

    async def fetchAll(self):
        """
        Route to fetch all rows from the users table.

        Returns:
            list: A list of Users objects.
        """
        try:
            return await self.users.fetchAll()
        except BaseException as err:
            raise err

    async def fetchOne(self, key: int):
        """
        Route to fetch a user given the primary key.

        Parameters:
            key (int): The primary key (uid) of the user.

        Returns:
            Users: The user as a users model.
        """
        try:
            return await self.users.fetchOne(key)
        except BaseException as err:
            raise err

    async def insert(self, userinfo: UsersIn):
        """
        Route to insert a new user into the users table.

        Parameters:
            userinfo (UsersIn): The information for the new user.

        Returns:
            RealDictRow: The primay key of the new user.
        """
        try:
            return await self.users.insert(userinfo)
        except BaseException as err:
            raise err

    async def update(self, updated: Users):
        """
        Route to update a user in the users table.

        Parameters:
            updated (Users): The user with the updated data.

        Returns:
            Users: The result of the update.
        """
        try:
            return await self.users.update(updated)
        except BaseException as err:
            raise err

    async def delete(self, key: int):
        """
        Route to delete a user from the users table.

        Parameters:
            key (int): The primary key (uid) of the user.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            return await self.users.delete(key)
        except BaseException as err:
            raise err