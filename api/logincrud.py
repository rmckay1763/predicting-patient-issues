from pydantic.tools import parse_obj_as
from basecrud import BaseCRUD
from models import Login
from postgresconnector import PostgresConnector
from fastapi import HTTPException
from psycopg2 import sql, DatabaseError

class LoginCRUD(BaseCRUD):
    """
    Abstracts interacting with the login table from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # table dependent sql query strings
        self.insertQuery = ("INSERT INTO public.{table} ({columns}) "
            "VALUES (%s, %s) RETURNING {key};")

        self.updateQuery = ("UPDATE public.{table} "
            "SET {password}=%s WHERE {key} = %s RETURNING *;")
        
        # sql statement objects
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('login'),
            key = sql.Identifier('uid'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('login'),
            key = sql.Identifier('uid'),
            columns = sql.SQL(',').join([
                sql.Identifier('uid'),
                sql.Identifier('password')]))

        self.updateSQL = sql.SQL(self.updateQuery).format(
            table = sql.Identifier('login'),
            key = sql.Identifier('uid'),
            password = sql.Identifier('password'))
            
        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('login'),
            key = sql.Identifier('uid'))


    # not necessary to implement (already know the primary key)
    def fetchKey(self, value: str):
        None

    # not necessary to implement (no need for a list of all passwords)
    def fetchAll(self):
        None

    async def fetchOne(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        login = cursor.fetchone()
        if (login == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find login')
        model = parse_obj_as(Login, login)
        cursor.close()
        return model

    async def insert(self, login: Login):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.insertSQL, (
                login.uid, 
                login.password))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to insert password')
        cursor.close()
        return key
    
    async def update(self, updated: Login):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.updateSQL, (updated.password, updated.uid,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        result = cursor.fetchone()
        if (result == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to update password')
        model = parse_obj_as(Login, result)
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
            raise HTTPException(status_code=404, detail='Failed to delete password')
        cursor.close()
        return True
