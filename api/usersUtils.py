from typing import List
from pydantic.tools import parse_obj_as
from tableUtils import TableUtils
from models import Users, UsersIn
from postgresconnector import PostgresConnector
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException

class UsersUtils(TableUtils):
    """
    Abstracts interacting with the users table from the userinfo database (descended from TableUtils).
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # table dependent sql query strings
        self.insertQuery = ("INSERT INTO public.{table} ({columns}) "
            "VALUES (%s, %s, %s, %s,%s) RETURNING {key};")

        self.updateQuery = ("UPDATE public.{table} SET "
            "{firstname}=%s, {lastname}=%s, {username}=%s, {rank}=%s, {role}=%s "
            "WHERE {key} = %s RETURNING *;")

        # sql statement objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('users'),
            key = sql.Identifier('uid'),
            column = sql.Identifier('username'))
        
        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('users'))
        
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('users'),
            key = sql.Identifier('uid'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('users'),
            key = sql.Identifier('uid'),
            columns = sql.SQL(',').join([
                sql.Identifier('firstname'),
                sql.Identifier('lastname'),
                sql.Identifier('username'),
                sql.Identifier('rank'),
                sql.Identifier('role')]))

        self.updateSQL = sql.SQL(self.updateQuery).format(
            table = sql.Identifier('users'),
            key = sql.Identifier('uid'),
            firstname = sql.Identifier('firstname'),
            lastname = sql.Identifier('lastname'),
            username = sql.Identifier('username'),
            rank = sql.Identifier('rank'),
            role = sql.Identifier('role'))
            
        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('users'),
            key = sql.Identifier('uid'))

    async def fetchKey(self, value: str):
        cursor = self.getCursor()
        try:
            cursor.execute(self.fetchKeySQL, (value,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find user id')
        cursor.close()
        return key

    async def fetchAll(self):
        cursor = self.getCursor()
        try:
            cursor.execute(self.fetchAllSQL)
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        users = cursor.fetchall()
        if (users == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find users')
        models = parse_obj_as(List[Users], users)
        cursor.close()
        return models 

    async def fetchOne(self, key: int):
        cursor = self.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        user = cursor.fetchone()
        if (user == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find user')
        model = parse_obj_as(Users, user)
        cursor.close()
        return model

    async def insert(self, user: UsersIn):
        cursor = self.getCursor()
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

    async def update(self, updated: Users):
        cursor = self.getCursor()
        try:
            cursor.execute(self.updateSQL, (
                updated.firstname, 
                updated.lastname, 
                updated.username, 
                updated.rank, 
                updated.role, 
                updated.uid, ))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        result = cursor.fetchone()
        if (result == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to update user')
        model = parse_obj_as(Users, result)
        cursor.close()
        return model

    async def delete(self, key: int):
        cursor = self.getCursor()
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
        