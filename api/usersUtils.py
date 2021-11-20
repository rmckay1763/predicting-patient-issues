from typing import List
from pydantic.tools import parse_obj_as
from tableUtils import TableUtils
from models import Users, UsersIn
from postgresconnector import PostgresConnector
from psycopg2 import sql
from fastapi import HTTPException

class UsersUtils(TableUtils):
    """
    Abstracts interacting with the users table from the userinfo database (descended from TableUtils).
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        self.insertQuery = ("INSERT INTO {table} ({columns}) "
            "VALUES (%s, %s, %s, %s,%s) RETURNING {key};")

        self.updateQuery = ("UPDATE {table} SET "
            "{firstname}=%s, {lastname}=%s, {username}=%s, {rank}=%s, {role}=%s "
            "WHERE {key} = %s RETURNING *;")

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
        self.conn.curr.execute(self.fetchKeySQL, (value,))
        key = self.conn.curr.fetchone()
        return key

    async def fetchAll(self):
        self.conn.curr.execute(self.fetchAllSQL)
        users = self.conn.curr.fetchall()
        models = parse_obj_as(List[Users], users)
        return models 

    async def fetchOne(self, key: int):
        self.conn.curr.execute(self.fetchOneSQL, (key,))
        user = self.conn.curr.fetchone()
        model = parse_obj_as(Users, user)
        return model

    async def insert(self, user: UsersIn):
        self.conn.curr.execute(self.insertSQL, (
            user.firstname, 
            user.lastname, 
            user.username, 
            user.rank, 
            user.role,))
        self.conn.conn.commit()
        key = self.conn.curr.fetchone()
        return key

    async def update(self, updated: Users):
        self.conn.curr.execute(self.updateSQL, (
            updated.firstname, 
            updated.lastname, 
            updated.username, 
            updated.rank, 
            updated.role, 
            updated.uid, ))
        self.conn.conn.commit()
        result = self.conn.curr.fetchone()
        model = parse_obj_as(Users, result)
        return model

    async def delete(self, key: int):
        self.conn.curr.execute(self.deleteSQL, (key,))
        self.conn.conn.commit()
        if (self.conn.curr.rowcount == 1):
            return True
        else:
            return False
        