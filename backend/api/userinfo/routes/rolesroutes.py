from fastapi import APIRouter, Depends, status
from api.userinfo.models import Roles, RolesIn
from dependencies import roles, auth

router = APIRouter(prefix="/roles")

@router.get("/fetchKey/{name}")
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

@router.get("/fetchAll/")
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

@router.get("/fetchOne/{key}")
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

@router.post("/insert/")
async def insertRole(role: RolesIn, uid=Depends(auth.auth_wrapper)):
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

@router.put("/update/")
async def updateRole(updated: Roles, uid=Depends(auth.auth_wrapper)):
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

@router.delete("/delete/{key}")
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
