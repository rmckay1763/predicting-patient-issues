from configparser import ConfigParser
from fastapi import status, Depends
from fastapi.applications import FastAPI
from authhandler import AuthHandler
import models as m
from postgresconnector import PostgresConnector
from rolescrud import RolesCRUD
from userscrud import UsersCRUD
from logincrud import LoginCRUD
from loginhandler import LoginHandler

# global variables
app = FastAPI()
config = ConfigParser()
config.read('settings.ini')
config.sections()
auth = AuthHandler(config)

@app.on_event("startup")
def startup():
    """
    Initialize database connection and instantiate utility classes.
    """
    global roles
    global users
    global logins
    global loginHandler
    connector = PostgresConnector(config)
    roles = RolesCRUD(connector)
    users = UsersCRUD(connector)
    logins = LoginCRUD(connector)
    loginHandler = LoginHandler(users, logins, auth)

#################### routes to interact with the users table ##################

@app.get("/users/fetchKey/{username}")
async def fetchUserKey(username: str, uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch the primary key of a user.

    Parameters:
        username (str): The username of the user.

    Returns:
        RealDictRow: The primay key of the user.
    """
    try:
        return await users.fetchKey(username)
    except BaseException as err:
        raise err

@app.get("/users/fetchAll")
async def fetchAllUsers(uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch all rows from the users table.

    Returns:
        list: A list of Users objects.
    """
    try:
        return await users.fetchAll()
    except BaseException as err:
        raise err

@app.get("/users/fetchOne/{key}")
async def fetchOneUser(key: int, uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch a user given the primary key.

    Parameters:
        key (int): The primary key (uid) of the user.

    Returns:
        Users: The user as a users model.
    """
    try:
        return await users.fetchOne(key)
    except BaseException as err:
        raise err

@app.post("/users/insert")
async def insertUser(userinfo: m.UsersIn, uid=Depends(auth.auth_wrapper)):
    """
    Route to insert a new user into the users table.

    Parameters:
        userinfo (UsersIn): The information for the new user.

    Returns:
        RealDictRow: The primay key of the new user.
    """
    try:
        return await users.insert(userinfo)
    except BaseException as err:
        raise err

@app.put("/users/update")
async def updateUser(updated: m.Users, uid=Depends(auth.auth_wrapper)):
    """
    Route to update a user in the users table.

    Parameters:
        updated (Users): The user with the updated data.

    Returns:
        Users: The result of the update.
    """
    try:
        return await users.update(updated)
    except BaseException as err:
        raise err

@app.delete("/users/delete/{key}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteUser(key: int, uid=Depends(auth.auth_wrapper)):
    """
    Route to delete a user from the users table.

    Parameters:
        key (int): The primary key (uid) of the user.

    Returns:
        bool: True if successful, false otherwise.
    """
    try:
        return await users.delete(key)
    except BaseException as err:
        raise err

#################### routes to interact with the roles table ##################

@app.get("/roles/fetchKey/{name}")
async def fetchRoleKey(name: str, uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch the primary key of a role given the role name.

    Parameters:
        name (str): The name of the role.

    Returns:
        RealDictRow: The primay key of the role.
    """
    try:
        return await roles.fetchKey(name)
    except BaseException as err:
        raise err

@app.get("/roles/fetchAll/")
async def fetchAllRoles(uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch all rows from the roles table.

    Returns:
        list: A list of Roles objects.
    """
    try:
        return await roles.fetchAll()
    except BaseException as err:
        raise err

@app.get("/roles/fetchOne/{key}")
async def fetchOneRole(key: int, uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch a role given the primary key.

    Parameters:
        key (int): The primary key (id) of the role.

    Returns:
        Roles: The role as a roles model.
    """
    try:
        return await roles.fetchOne(key)
    except BaseException as err:
        raise err

@app.post("/roles/insert/")
async def insertRole(role: m.RolesIn, uid=Depends(auth.auth_wrapper)):
    """
    Route to insert a new role into the roles table.

    Parameters:
        role (RolesIn): The new role to insert.

    Returns:
        RealDictRow: The primay key of the new role.
    """
    try:
        return await roles.insert(role)
    except BaseException as err:
        raise err

@app.put("/roles/update")
async def updateRole(updated: m.Roles, uid=Depends(auth.auth_wrapper)):
    """
    Route to update a role in the roles table.

    Parameters:
        updated (Roles): The role with the updated data.

    Returns:
        Roles: The result of the update.
    """
    try:
        return await roles.update(updated)
    except BaseException as err:
        raise err

@app.delete("/roles/delete/{key}")
async def deleteRole(key: int, uid=Depends(auth.auth_wrapper)):
    """
    Route to delete a role from the roles table.

    Parameters:
        key (int): The primary key (id) of the role.

    Returns:
        bool: True if successful, false otherwise.
    """
    try:
        return await roles.delete(key)
    except BaseException as err:
        raise err

#################### routes to interact with the login table ##################

@app.get("/login/fetchOne/{key}")
async def fetchOneLogin(key: int, uid=Depends(auth.auth_wrapper)):
    """
    Route to fetch a login given the primary key.

    Parameters:
        key (int): The primary key (uid) of the login.

    Returns:
        Login: The login as a login model.
    """
    try:
        return await logins.fetchOne(key)
    except BaseException as err:
        raise err

@app.post("/login/insert/")
async def insertLogin(login: m.Login, uid=Depends(auth.auth_wrapper)):
    """
    Route to insert a new login into the login table.

    Parameters:
        login (Login): The new login to insert.

    Returns:
        RealDictRow: The primay key of the new login.
    """
    try:
        return await logins.insert(login)
    except BaseException as err:
        raise err

@app.put("/login/update")
async def updateLogin(updated: m.Login, uid=Depends(auth.auth_wrapper)):
    """
    Route to update a login in the login table.

    Parameters:
        updated (Login): The login with the updated data.

    Returns:
        Login: The result of the update.
    """
    try:
        return await logins.update(updated)
    except BaseException as err:
        raise err

@app.delete("/login/delete/{key}")
async def deleteLogin(key: int, uid=Depends(auth.auth_wrapper)):
    """
    Route to delete a login from the login table.

    Parameters:
        key (int): The primary key (uid) of the login.

    Returns:
        bool: True if successful, false otherwise.
    """
    try:
        return await logins.delete(key)
    except BaseException as err:
        raise err

@app.post("/login/")
async def login(attempt: m.LoginAttempt):
    """
    Route to authenticate an attempted login.

    Parameters:
        attempt (LoginAttempt): The attempted login.

    Raises:
        HTTPException: If authentication fails.

    Returns:
        token (str): Session token.
    """
    try:
        return await loginHandler.login(attempt)
    except BaseException as err:
        raise err