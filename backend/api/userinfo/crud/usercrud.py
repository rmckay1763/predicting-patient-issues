from typing import List
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.crud.basecrud import BaseCRUD
from api.userinfo.models import User, UserIn
from api.utils.postgresconnector import PostgresConnector


class UserCRUD(BaseCRUD):
    """
    Abstracts interacting with the user table from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # table dependent sql query strings
        self.insertQuery = ("INSERT INTO public.{table} ({columns}) "
            "VALUES (%s, %s, %s, %s,%s) RETURNING {key};")

        self.updateQuery = ("UPDATE public.{table} SET "
            "{firstname}=%s, {lastname}=%s, {username}=%s, {rank}=%s, {role}=%s, {admin}=%s "
            "WHERE {key} = %s RETURNING *;")

        # sql statement objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('user'),
            key = sql.Identifier('uid'),
            column = sql.Identifier('username'))
        
        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('user'))
        
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('user'),
            key = sql.Identifier('uid'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('user'),
            key = sql.Identifier('uid'),
            columns = sql.SQL(',').join([
                sql.Identifier('firstname'),
                sql.Identifier('lastname'),
                sql.Identifier('username'),
                sql.Identifier('rank'),
                sql.Identifier('role')]))

        self.updateSQL = sql.SQL(self.updateQuery).format(
            table = sql.Identifier('user'),
            key = sql.Identifier('uid'),
            firstname = sql.Identifier('firstname'),
            lastname = sql.Identifier('lastname'),
            username = sql.Identifier('username'),
            rank = sql.Identifier('rank'),
            role = sql.Identifier('role'),
            admin = sql.Identifier('admin'))
            
        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('user'),
            key = sql.Identifier('uid'))

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
            raise HTTPException(status_code=404, detail='Failed to find username')
        cursor.close()
        return key

    async def fetchAll(self):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllSQL)
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        users = cursor.fetchall()
        if (users == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find users')
        models = parse_obj_as(List[User], users)
        cursor.close()
        return models 

    async def fetchOne(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        user = cursor.fetchone()
        if (user == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find user')
        model = parse_obj_as(User, user)
        cursor.close()
        return model

    async def insert(self, user: UserIn):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.insertSQL, (
                user.firstname, 
                user.lastname, 
                user.username, 
                user.rank, 
                user.role,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to insert user')
        cursor.close()
        return key

    async def update(self, updated: User):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.updateSQL, (
                updated.firstname, 
                updated.lastname, 
                updated.username, 
                updated.rank, 
                updated.role,
                updated.admin, 
                updated.uid, ))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        result = cursor.fetchone()
        if (result == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to update user')
        model = parse_obj_as(User, result)
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
            raise HTTPException(status_code=404, detail='Failed to delete user')
        cursor.close()
        return True
        