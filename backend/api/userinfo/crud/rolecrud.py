from typing import List
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Role, RoleIn
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class RoleCRUD(BaseCRUD):
    """
    Abstracts interacting with the role table from the userinfo database.
    """
    
    def __init__(self, conn: PostgresConnector) -> None:
        super().__init__(conn)

        # table dependent sql query strings.
        self.insertQuery = ("INSERT INTO public.{table} ({columns}) "
            "VALUES (%s) RETURNING {key};")

        self.updateQuery = "UPDATE public.{table} SET {name}=%s WHERE {key} = %s RETURNING *;"

        # sequel statment objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('role'),
            key = sql.Identifier('id'),
            column = sql.Identifier('name'))
        
        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('role'))
        
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('role'),
            key = sql.Identifier('id'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('role'),
            key = sql.Identifier('id'),
            columns = sql.Identifier('name'))

        self.udpateSQL = sql.SQL(self.updateQuery).format(
            table = sql.Identifier('role'),
            name = sql.Identifier('name'),
            key = sql.Identifier('id'))
            
        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('role'),
            key = sql.Identifier('id'))

    async def fetchKey(self, value: str) -> dict:
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
        
    async def fetchAll(self) -> List[Role]:
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
        models = parse_obj_as(List[Role], roles)
        cursor.close()
        return models

    async def fetchOne(self, key: int) -> Role:
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
        model = parse_obj_as(Role, role)
        cursor.close()
        return model

    async def insert(self, role: RoleIn) -> dict:
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

    async def update(self, updated: Role) -> Role:
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
        model = parse_obj_as(Role, result)
        cursor.close()
        return model

    async def delete(self, key: int) -> bool:
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

    
    
    