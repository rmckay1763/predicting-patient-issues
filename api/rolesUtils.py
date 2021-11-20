from typing import List
from psycopg2.extensions import SQL_IN
from pydantic.tools import parse_obj_as
from models import Roles, RolesIn
from tableUtils import TableUtils
from postgresconnector import PostgresConnector
from psycopg2 import sql
from fastapi import HTTPException

class RolesUtils(TableUtils):
    """
    Abstracts interacting with the roles table from the userinfo database (descended from TableUtils).
    """
    
    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        self.insertQuery = ("INSERT INTO {table} ({columns}) "
            "VALUES (%s) RETURNING {key};")

        self.updateQuery = "UPDATE {table} SET {name}=%s WHERE {key} = %s RETURNING *;"

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
        self.conn.curr.execute(self.fetchKeySQL, (value,))
        key = self.conn.curr.fetchone()
        return key
        
    async def fetchAll(self):
        self.conn.curr.execute(self.fetchAllSQL)
        roles = self.conn.curr.fetchall()
        models = parse_obj_as(List[Roles], roles)
        return models

    async def fetchOne(self, key: int):
        self.conn.curr.execute(self.fetchOneSQL, (key,))
        role = self.conn.curr.fetchone()
        model = parse_obj_as(Roles, role)
        return model

    async def insert(self, role: RolesIn):
        self.conn.curr.execute(self.insertSQL, (role.name,))
        self.conn.conn.commit()
        key = self.conn.curr.fetchone()
        return key

    async def update(self, updated: Roles):
        self.conn.curr.execute(self.udpateSQL, (updated.name, updated.id, ))
        self.conn.conn.commit()
        result = self.conn.curr.fetchone()
        model = parse_obj_as(Roles, result)
        return model

    async def delete(self, key: int):
        self.conn.curr.execute(self.deleteSQL, (key,))
        self.conn.conn.commit()
        if (self.conn.curr.rowcount == 1):
            return True
        else:
            return False

    
    
    