from typing import List
from api.userinfo.models import User, UserIn, UserOut, Login, LoginAttempt, LoginUpdated, Role, RoleIn
from api.userinfo.crud.usercrud import UserCRUD
from api.userinfo.crud.logincrud import LoginCRUD
from api.userinfo.crud.rolecrud import RoleCRUD

class UserService:

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
            newUser = await self.users.insert(userInfo)
            return await self.__hydrateUser(newUser)
        except BaseException as err:
            raise err

    async def updateUser(self, updated: User):
        try:
            updatedUser = await self.users.update(updated)
            return await self.__hydrateUser(updatedUser)
            

    async def deleteUser(self, uid):
        try:
            return await self.users.delete(uid)
        except BaseException as err:
            raise err