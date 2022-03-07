from typing import List
from api.userinfo.models import User, UserIn, UserOut, Login, LoginAttempt, LoginUpdated, Role, RoleIn
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolecrud import RoleCRUD

class UserService:
    '''
    '''

    def __init__(self, users: UserCRUD, logins: LoginCRUD, roles: RoleCRUD):
        self.users = users
        self.logins = logins
        self.roles = roles

    async def __hydrateUser(self, user: User):
        try:
            role = await self.roles.fetchOne(user.role)
            out = UserOut(
                uid = user.uid,
                firstname = user.firstname,
                lastname = user.lastname,
                username = user.username,
                rank = user.rank,
                role = role.name,
                admin = user.admin
            )
            return out
        except BaseException as err:
            raise err

    async def fetchUid(self, username: str):
        try:
            return await self.users.fetchKey(username)
        except BaseException as err:
            raise err

    async def fetchUser(self, uid: int):
        try:
            user = await self.users.fetchOne(uid)
            return await self.__hydrateUser(user)
        except BaseException as err:
            raise err

    async def fetchAllUsers(self):
        try:
            outList: List[UserOut] = []
            users = await self.users.fetchAll()
            for user in users:
                out = await self.__hydrateUser(user)
                outList.append(out)
            return outList
        except BaseException as err:
            raise err

    async def addUser(self, userInfo: UserIn):
        try:
            newid = await self.users.insert(userInfo)
            login = Login(uid = newid['uid'], password = userInfo.password)
            return await self.logins.insert(login)
        except BaseException as err:
            raise err

    async def updateUser(self, updated: User):
        try:
            updatedUser = await self.users.update(updated)
            return await self.__hydrateUser(updatedUser)
        except BaseException as err:
            raise err    

    async def deleteUser(self, uid):
        try:
            return await self.users.delete(uid)
        except BaseException as err:
            raise err
    
    async def fetchAllRoles(self):
        try:
            return await self.roles.fetchAll()
        except BaseException as err:
            raise err

    async def addRole(self, role: RoleIn):
        try:
            return await self.roles.insert(role)
        except BaseException as err:
            raise err

    async def deleteRole(self, id: int):
        try:
            return await self.roles.delete(id)
        except BaseException as err:
            raise err

    async def fetchPassword(self, uid: int):
        try:
            return await self.logins.fetchOne(uid)
        except BaseException as err:
            raise err