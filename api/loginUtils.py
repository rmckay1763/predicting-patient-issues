from pydantic.tools import parse_obj_as
from authhandler import AuthHandler
from tableUtils import TableUtils
from models import Login
from postgresconnector import PostgresConnector
from fastapi import HTTPException

class LoginUtils(TableUtils):
    """
    Abstracts interacting with the login table from the userinfo database.

    Attributes:
        auth (AuthHandler): Authentication handler.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)
        self.auth = AuthHandler(self.conn.config)

        # formatted strings to execute sql queries
        self.sqlFetchOne = "SELECT * FROM public.login WHERE uid={key};"
        self.sqlInsert = ("INSERT INTO public.login (uid, password) "
                          "VALUES ({uid}, '{password}') RETURNING uid;")
        self.sqlUpdate = "UPDATE public.login SET password='{password}' WHERE uid={uid} RETURNING *;"
        self.sqlDelete = "DELETE FROM public.login WHERE uid={key};"


    # not necessary to implement (already know the primary key)
    def fetchKey(self, value: str):
        None

    # not necessary to implement (no need for a list of all passwords)
    def fetchAll(self):
        None

    async def fetchOne(self, key: int):
        args = {"key": key}
        self.conn.curr.execute(self.sqlFetchOne.format(**args))
        login = self.conn.curr.fetchone()
        model = parse_obj_as(Login, login)
        return model

    async def insert(self, login: Login):
        args = login.dict()
        self.conn.curr.execute(self.sqlInsert.format(**args))
        self.conn.conn.commit()
        key = self.conn.curr.fetchone()
        return key

    async def update(self, updated: Login):
        args = updated.dict()
        self.conn.curr.execute(self.sqlUpdate.format(**args))
        self.conn.conn.commit()
        result = self.conn.curr.fetchone()
        model = parse_obj_as(Login, result)
        return model

    async def delete(self, key: int):
        args = {"key": key}
        self.conn.curr.execute(self.sqlDelete.format(**args))
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