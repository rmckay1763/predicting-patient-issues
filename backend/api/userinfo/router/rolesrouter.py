from fastapi import APIRouter, Depends
from api.userinfo.models import Roles, RolesIn
from api.userinfo.crud.rolescrud import RolesCRUD
from api.utils.authhandler import AuthHandler
from api.dependencies import auth

class RolesRouter:
    '''
    Implements routes for the roles table using an APIRouter
    '''

    def __init__(self, roles: RolesCRUD):
        '''
        Constructor.

        Parameters:
            roles (RolesCRUD): The crud to interact with the table.
        '''
        self.roles = roles
        self.router = APIRouter(
            prefix="/roles",
            dependencies=[Depends(auth.auth_wrapper)])
        self.__addRoutes__()
    
    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchKey/{name}")(self.fetchKey)
        self.router.get("/fetchAll/")(self.fetchAll)
        self.router.get("/fetchOne/{key}")(self.fetchOne)
        self.router.post("/insert/")(self.insert)
        self.router.put("/update/")(self.update)
        self.router.delete("/delete/{key}")(self.delete)
        
    async def fetchKey(self, name: str):
        """
        Route to fetch the primary key of a role given the role name.

        Parameters:
            name (str): The name of the role.

        Returns:
            RealDictRow: The primay key of the role.
        """
        try:
            return await self.roles.fetchKey(name)
        except BaseException as err:
            raise err

    async def fetchAll(self):
        """
        Route to fetch all rows from the roles table.

        Returns:
            list: A list of Roles objects.
        """
        try:
            return await self.roles.fetchAll()
        except BaseException as err:
            raise err

    async def fetchOne(self, key: int):
        """
        Route to fetch a role given the primary key.

        Parameters:
            key (int): The primary key (id) of the role.

        Returns:
            Roles: The role as a roles model.
        """
        try:
            return await self.roles.fetchOne(key)
        except BaseException as err:
            raise err

    async def insert(self, role: RolesIn):
        """
        Route to insert a new role into the roles table.

        Parameters:
            role (RolesIn): The new role to insert.

        Returns:
            RealDictRow: The primay key of the new role.
        """
        try:
            return await self.roles.insert(role)
        except BaseException as err:
            raise err

    async def update(self, updated: Roles):
        """
        Route to update a role in the roles table.

        Parameters:
            updated (Roles): The role with the updated data.

        Returns:
            Roles: The result of the update.
        """
        try:
            return await self.roles.update(updated)
        except BaseException as err:
            raise err

    async def delete(self, key: int):
        """
        Route to delete a role from the roles table.

        Parameters:
            key (int): The primary key (id) of the role.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            return await self.roles.delete(key)
        except BaseException as err:
            raise err
