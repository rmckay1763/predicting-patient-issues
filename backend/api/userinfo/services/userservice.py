from turtle import update
from typing import List
from fastapi.exceptions import HTTPException
from api.userinfo.models import (
    User, 
    UserIn, 
    UserOut, 
    Rank, 
    Role, 
    RoleIn, 
    Login, 
    LoginAttempt, 
    LoginUpdated, 
    LoginSuccess
)
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolecrud import RoleCRUD
from api.userinfo.crud.rankcrud import RankCRUD
from api.dependencies import auth

class UserService:
    '''
    Service to interact with user related tables.
    '''

    def __init__(self, users: UserCRUD, logins: LoginCRUD, roles: RoleCRUD, ranks: RankCRUD) -> None:
        '''
        Constructor.

        Parameters:
            users (UsersCRUD): CRUD class for the user table.
            logins (LoginCRUD): CRUD class for the login table.
            roles (RoleCRUD): CRUD class for the role table.
        '''
        self.users = users
        self.logins = logins
        self.roles = roles
        self.ranks = ranks

    async def __hydrateUser(self, user: User) -> UserOut:
        '''
        Hydrates the user out model to send to the frontend.

        Parameters:
            user (User): User model to hydrate.

        Returns:
            UserOut: Hydrated user out model.
        '''
        try:
            rank = await self.ranks.fetchOne(user.rank)
            role = await self.roles.fetchOne(user.role)
            out = UserOut(
                uid = user.uid,
                firstname = user.firstname,
                lastname = user.lastname,
                username = user.username,
                rank = rank,
                role = role,
                admin = user.admin
            )
            return out
        except BaseException as err:
            raise err

    async def fetchUid(self, username: str) -> dict:
        '''
        Fetch the uid of a user.

        Parameters:
            username(str): The username of the user.

        Returns:
            Dict: The uid as a dictionary with key 'uid'.
        '''
        try:
            return await self.users.fetchKey(username)
        except BaseException as err:
            raise err

    async def fetchUser(self, uid: int) -> UserOut:
        '''
        Fetch a user from the user table.

        Parameters:
            uid (int): Primary key (uid) of the user.

        Returns:
            UserOut: User out model for the selected user.
        '''
        try:
            user = await self.users.fetchOne(uid)
            return await self.__hydrateUser(user)
        except BaseException as err:
            raise err

    async def fetchAllUsers(self) -> List[UserOut]:
        '''
        Fetch and hydrate all users from the table.

        Returns:
            List[UserOut]: All users as list of UserOut models.
        '''
        try:
            outList: List[UserOut] = []
            users = await self.users.fetchAll()
            for user in users:
                out = await self.__hydrateUser(user)
                outList.append(out)
            return outList
        except BaseException as err:
            raise err

    async def addUser(self, userInfo: UserIn) -> dict:
        '''
        Inserts a user into the user table.

        Parameters:
            userInfo (UserIn): The information for the new user.
        
        Returns:
            Dict: uid of the new user as a dictionary with key 'uid'.
        '''
        try:
            newid = await self.users.insert(userInfo)
            hashed = auth.get_hashed_password(userInfo.password)
            login = Login(uid = newid['uid'], password = hashed)
            return await self.logins.insert(login)
        except BaseException as err:
            raise err

    async def updateUser(self, updated: User) -> UserOut:
        '''
        Update a user in the user table.

        Parameters:
            updated (User): The updated user information.

        Returns:
            User: The result of the update as a User model.
        '''
        try:
            updatedUser = await self.users.update(updated)
            return await self.__hydrateUser(updatedUser)
        except BaseException as err:
            raise err    

    async def deleteUser(self, uid: int) -> bool:
        '''
        Delete a user from the user table.

        Parameters:
            uid (int): Primary key (uid) of the user to delete.

        Returns:
            bool: True if succesful, raises error otherwise.
        '''
        try:
            await self.logins.delete(uid)
            return await self.users.delete(uid)
        except BaseException as err:
            raise err
    
    async def fetchAllRoles(self) -> List[Role]:
        '''
        Fetch all roles from the role table.

        Returns:
            List(Role): All roles as a list of Role models.
        '''
        try:
            return await self.roles.fetchAll()
        except BaseException as err:
            raise err

    async def addRole(self, role: RoleIn) -> dict:
        '''
        Insert a role into the role table.

        Parameters:
            role (RoleIn): The new role to add.

        Returns:
            Dict: Primary key of the new role as a dict with key 'id'.
        '''
        try:
            return await self.roles.insert(role)
        except BaseException as err:
            raise err

    async def deleteRole(self, id: int) -> bool:
        '''
        Delete a role from the role table.

        Parameters:
            id (int): Primary key of the role to delete.

        Returns:
            bool: True if successful, raise error otherwise.
        '''
        try:
            return await self.roles.delete(id)
        except BaseException as err:
            raise err

    async def fetchAllRanks(self) -> List[Rank]:
        '''
        Fetch all rows from the rank table.

        Returns:
            list[Rank]: All ranks as list of Rank objects.
        '''
        try: 
            return await self.ranks.fetchAll()
        except BaseException as err:
            raise err

    async def fetchPassword(self, uid: int) -> Login:
        '''
        Fetch a password from the login table.

        Parameters:
            uid (int): The uid of the user associated with the password.

        Returns:
            Login: The password as a Login model.
        '''
        try:
            return await self.logins.fetchOne(uid)
        except BaseException as err:
            raise err

    async def verifyPassword(self, candidate: Login) -> bool:
        '''
        Validate a password in the login table.

        Parameters:
            candidate (Login): The password to verify.

        Returns:
            bool: True if the password exist for the uid, False otherwise.
        '''
        try:
            actual = await self.logins.fetchOne(candidate.uid)
            return auth.verify_password(candidate.password, actual.password)
        except BaseException as err:
            raise err   

    async def updatePassword(self, updated: Login) -> bool:
        '''
        Update a user's password in the login table. Requires verification of old password.

        Parameters:
            updated (Login): The updated password information.

        Returns: 
            bool: True if the password updates, false if the old password fails.
        '''
        try:
            hashed = auth.get_hashed_password(updated.password)
            new = Login(uid = updated.uid, password = hashed)            
            await self.logins.update(new)
            return True
        except BaseException as err:
            raise err

    async def login(self, attempt: LoginAttempt) -> LoginSuccess:
        '''
        User login function.

        Parameters:
            attempt (LoginAttempt): The attempted login (username and password).

        Returns:
            LoginSuccess: Bearer token and UserOut model for logged in user.
        '''
        try:
            uid = await self.fetchUid(attempt.username)
            actual = await self.fetchPassword(uid["uid"])
            if (not auth.verify_password(attempt.password, actual.password)):
                raise HTTPException(status_code=401, detail='Password is incorrect!')
            token = auth.encode_token(actual.uid)
            user = await self.fetchUser(uid["uid"])
            return LoginSuccess(token = token, user = user)
        except BaseException as err:
            raise err