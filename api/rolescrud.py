from typing import List
from pydantic.tools import parse_obj_as
from models import Roles, RolesIn
from basecrud import BaseCRUD
from postgresconnector import PostgresConnector
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException

class RolesCRUD(BaseCRUD):
    """
    Abstracts interacting with the roles table from the userinfo database.
    """
    
    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # table dependent sql query strings.
        self.insertQuery = ("INSERT INTO public.{table} ({columns}) "
            "VALUES (%s) RETURNING {key};")

        self.updateQuery = "UPDATE public.{table} SET {name}=%s WHERE {key} = %s RETURNING *;"

        # sequel statment objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('roles'),
            key = sql.Identifier('id'),
            column = sql.Identifier('name'))
        
        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('roles'))
        
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('roles'),
            key = sql.Identifier('id'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('roles'),
            key = sql.Identifier('id'),
            columns = sql.Identifier('name'))

        self.udpateSQL = sql.SQL(self.updateQuery).format(
            table = sql.Identifier('roles'),
            name = sql.Identifier('name'),
            key = sql.Identifier('id'))
            
        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('roles'),
            key = sql.Identifier('id'))

    async def fetchKey(self, value: str):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchKeySQL, (value,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find role id')
        cursor.close()
        return key
        
    async def fetchAll(self):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllSQL)
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        roles = cursor.fetchall()
        if (roles == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find roles')
        models = parse_obj_as(List[Roles], roles)
        cursor.close()
        return models

    async def fetchOne(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        role = cursor.fetchone()
        if (role == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find role')
        model = parse_obj_as(Roles, role)
        cursor.close()
        return model

    async def insert(self, role: RolesIn):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.insertSQL, (role.name,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to insert role')
        cursor.close()
        return key

    async def update(self, updated: Roles):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.udpateSQL, (updated.name, updated.id, ))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        result = cursor.fetchone()
        if (result == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to update role')
        model = parse_obj_as(Roles, result)
        cursor.close()
        return model

    async def delete(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.deleteSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        if (cursor.rowcount == 0):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to delete role')
        cursor.close()
        return True

    
    
    