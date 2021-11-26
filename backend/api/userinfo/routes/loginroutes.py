from fastapi import APIRouter, Depends, status
from api.userinfo.models import Login
from dependencies import logins, auth

router = APIRouter(prefix="/login")

@router.get("/fetchOne/{key}")
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

@router.post("/insert/")
async def insertLogin(login: Login, uid=Depends(auth.auth_wrapper)):
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

@router.put("/update")
async def updateLogin(updated: Login, uid=Depends(auth.auth_wrapper)):
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

@router.delete("/delete/{key}")
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