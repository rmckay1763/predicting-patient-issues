from fastapi import APIRouter, Depends, status
from api.userinfo.models import Users, UsersIn
from dependencies import users, auth

router = APIRouter(prefix="/users")

@router.get("/fetchKey/{username}")
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

@router.get("/fetchAll/")
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

@router.get("/fetchOne/{key}")
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

@router.post("/insert")
async def insertUser(userinfo: UsersIn, uid=Depends(auth.auth_wrapper)):
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

@router.put("/update")
async def updateUser(updated: Users, uid=Depends(auth.auth_wrapper)):
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

@router.delete("/delete/{key}", status_code=status.HTTP_204_NO_CONTENT)
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