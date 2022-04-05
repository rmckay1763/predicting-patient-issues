from typing import List
from fastapi import APIRouter, Depends, HTTPException
from api.userinfo.models import (
    Rank,
    Role,
    RoleIn, 
    User, 
    UserIn, 
    UserOut,
    Login, 
    LoginUpdated
)
from api.userinfo.services.userservice import UserService
from api.dependencies import auth

class UserRouter:
    '''
    Implements routes for the user table using an APIRouter
    '''

    def __init__(self, service: UserService) -> None:
        '''
        Constructor.

        Parameters:
            service (UserService): Service to interact with user related tables.
        '''
        self.service = service
        self.router = APIRouter(
            prefix="/api/user",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self) -> None:
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchAllRanks")(self.fetchAllRanks)
        self.router.get("/fetchAllUsers")(self.fetchAllUsers)
        self.router.get("/fetchUser")(self.fetchUser)
        self.router.post("/addUser/")(self.addUser)
        self.router.put("/updateUser")(self.updateUser)
        self.router.delete("/deleteUser")(self.deleteUser)
        self.router.get("/fetchAllRoles")(self.fetchAllRoles)
        self.router.post("/addRole")(self.addRole)
        self.router.delete("/deleteRole")(self.deleteRole)
        self.router.post("/verifyPassword")(self.verifyPassword)
        self.router.put("/updatePassword")(self.updatePassword)

    async def fetchAllRanks(self) -> List[Rank]:
        """
        Route to fetch all rows from the rank table.

        Returns:
            list[Rank]: All ranks as a list or Rank objects.
        """
        try:
            return await self.service.fetchAllRanks()
        except BaseException as err:
            raise err

    async def fetchAllUsers(self, uid=Depends(auth.auth_wrapper)) -> List[UserOut]:
        """
        Route to fetch all rows from the user table.

        Returns:
            list[UserOut]: All users as a list of UserOut objects.
        """
        try:
            await self.authenticate(uid, None)
            return await self.service.fetchAllUsers()
        except BaseException as err:
            raise err

    async def fetchUser(self, key: int) -> UserOut:
        """
        Route to fetch a user given the primary key.

        Parameters:
            key (int): The primary key (uid) of the user.

        Returns:
            UserOut: The user as a user out model.
        """
        try:
            return await self.service.fetchUser(key)
        except BaseException as err:
            raise err

    async def addUser(self, userinfo: UserIn, uid=Depends(auth.auth_wrapper)) -> dict:
        """
        Route to insert a new user into the user table.

        Parameters:
            userinfo (UserIn): The information for the new user.

        Returns:
            Dict: The primay key of the new user as a dictionary with key 'uid'.
        """
        try:
            await self.authenticate(uid, None)
            return await self.service.addUser(userinfo)
        except BaseException as err:
            raise err

    async def updateUser(self, updated: User, uid=Depends(auth.auth_wrapper)) -> UserOut:
        """
        Route to update a user in the user table.

        Parameters:
            updated (User): User model with updated information.

        Returns:
            UserOut: The result of the update as a UserOut model.
        """
        try:
            await self.authenticate(uid, updated.uid)
            return await self.service.updateUser(updated)
        except BaseException as err:
            raise err

    async def deleteUser(self, key: int, uid=Depends(auth.auth_wrapper)) -> bool:
        """
        Route to delete a user from the user table.

        Parameters:
            key (int): The primary key (uid) of the user.

        Returns:
            bool: True if successful, raises error otherwise.
        """
        try:
            await self.authenticate(uid, None)
            return await self.service.deleteUser(key)
        except BaseException as err:
            raise err

    async def fetchAllRoles(self, uid=Depends(auth.auth_wrapper)) -> List[Role]:
        '''
        Route to fetch all roles from the role table.

        Returns:
            list[Role]: All roles as a list of Role objects.
        '''
        try:
            await self.authenticate(uid, None)
            return await self.service.fetchAllRoles()
        except BaseException as err:
            raise err

    async def addRole(self, role: RoleIn, uid=Depends(auth.auth_wrapper)) -> dict:
        '''
        Route to add a role into the role table.

        Parameters:
            role (RoleIn): Information for the new role.

        Returns:
            dict: Primary key of the new role as a dictionary with key 'id'.
        '''
        try:
            await self.authenticate(uid, None)
            return await self.service.addRole(role)
        except BaseException as err:
            raise err

    async def deleteRole(self, key: int, uid=Depends(auth.auth_wrapper)) -> bool:
        '''
        Route to delete a role from the role table.

        Parameters:
            key (int): Primary key (id) of the role to delete.

        Returns:
            bool: True if successful, raise error otherwise.
        '''
        try:
            await self.authenticate(uid, None)
            return await self.service.deleteRole(key)
        except BaseException as err:
            raise err

    async def verifyPassword(self, candidate: Login, uid=Depends(auth.auth_wrapper)) -> bool:
        '''
        Route to verify a user's password.

        Parameters:
            candidate (Login): uid and password of user to verify.

        Returns:
            bool: True if verified, false if not verified.
        '''
        try:
            await self.authenticate(uid, candidate.uid)
            return await self.service.verifyPassword(candidate)
        except BaseException as err:
            raise err

    async def updatePassword(self, updated: Login, uid=Depends(auth.auth_wrapper)) -> bool:
        '''
        Route to update a user's password.

        Parameters:
            updated (LoginUpdated): The updated login information and the old password.

        Returns:
            bool: True if password updates, false if old password fails, raises error otherwise.
        '''
        try:
            await self.authenticate(uid, updated.uid)
            return await self.service.updatePassword(updated)
        except BaseException as err:
            raise err

    async def authenticate(self, actual: int, candidate: int) -> None:
        """
        Athenticate the user for the request. 
        Checks if uid of current user matches uid of request or if current user is an admin.
        For admin only authentication, pass in 'None' for candidate.

        Parameters:
            actual (int): The primary key (uid) of the current user.
            candidate (int): The primary key of the user to modify.

        Raises:
            HTTPException: Upon failed authentication.
        """
        if (actual == candidate):
            return
        user = await self.service.fetchUser(actual)
        if (user.admin):
            return
        raise HTTPException(status_code=401, detail='Unathenticated user id')