from pydantic.tools import parse_obj_as
from authhandler import AuthHandler
from tableUtils import TableUtils
from models import Login
from postgresconnector import PostgresConnector
from fastapi import HTTPException
from psycopg2 import sql

class LoginUtils(TableUtils):
    """
    Abstracts interacting with the login table from the userinfo database.

    Attributes:
        auth (AuthHandler): Authentication handler.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)
        self.auth = AuthHandler(self.conn.config)

        self.insertQuery = ("INSERT INTO {table} ({columns}) "
            "VALUES (%s, %s) RETURNING {key};")

        self.updateQuery = ("UPDATE {table} "
            "SET {password}=%s WHERE {key} = %s RETURNING *;")
        
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
        self.conn.curr.execute(self.fetchOneSQL, (key,))
        login = self.conn.curr.fetchone()
        model = parse_obj_as(Login, login)
        return model

    async def insert(self, login: Login):
        self.conn.curr.execute(self.insertSQL, (
            login.uid, 
            login.password))
        self.conn.conn.commit()
        key = self.conn.curr.fetchone()
        return key
    
    async def update(self, updated: Login):
        self.conn.curr.execute(self.updateSQL, (updated.password, updated.uid,))
        self.conn.conn.commit()
        result = self.conn.curr.fetchone()
        model = parse_obj_as(Login, result)
        return model

    async def delete(self, key: int):
        self.conn.curr.execute(self.deleteSQL, (key,))
        self.conn.conn.commit()
        if (self.conn.curr.rowcount == 1):
            return True
        else:
            return False
    async def login(self, attempt: Login):
        """
        Authenticates an attempted login.

        Parameters:
            attempt (Login): The attempted login.

        Raises:
            HTTPException: If authentication fails.

        Returns:
            token (str): Session token.
        """
        actual = await self.fetchOne(attempt.uid)
        if (actual == None):
            raise HTTPException(status_code=401, detail='Username is incorrect!')

        if (not self.auth.verify_password(attempt.password, actual.password)):
            raise HTTPException(status_code=401, detail='Password is incorrect!')

        token = self.auth.encode_token(actual.uid)
        return {"token" : token}