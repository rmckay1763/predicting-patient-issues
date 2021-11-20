from typing import List
from pydantic.tools import parse_obj_as
from tableUtils import TableUtils
from models import Users, UsersIn
from postgresconnector import PostgresConnector

class UsersUtils(TableUtils):
    """
    Abstracts interacting with the users table from the userinfo database (descended from TableUtils).
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # formatted strings to execute sql queries
        self.sqlFetchKey = "SELECT uid FROM public.users WHERE username='{username}';"
        self.sqlFetchAll = "SELECT * FROM public.users;"
        self.sqlFetchOne = "SELECT * FROM public.users WHERE uid={key};"
        self.sqlInsert = ("INSERT INTO public.users (firstname, lastname, username, rank, role) "
                          "VALUES ('{firstname}', '{lastname}', '{username}', '{rank}', {role}) "
                          "RETURNING uid;")
        self.sqlUpdate = ("UPDATE public.users "
                          "SET firstname='{firstname}', lastname='{lastname}', rank='{rank}', role={role} "
                          "WHERE uid={uid} RETURNING *;")
        self.sqlDelete = "DELETE FROM public.users WHERE uid={key};"

    async def fetchKey(self, value: str):
        args = {"username": value}
        self.conn.curr.execute(self.sqlFetchKey.format(**args))
        key = self.conn.curr.fetchone()
        return key

    async def fetchAll(self):
        self.conn.curr.execute(self.sqlFetchAll)
        users = self.conn.curr.fetchall()
        models = parse_obj_as(List[Users], users)
        return models

    async def fetchOne(self, key: int):
        args = {"key": key}
        self.conn.curr.execute(self.sqlFetchOne.format(**args))
        user = self.conn.curr.fetchone()
        model = parse_obj_as(Users, user)
        return model

    async def insert(self, user: UsersIn):
        args = user.dict()
        self.conn.curr.execute(self.sqlInsert.format(**args))
        self.conn.conn.commit()
        key = self.conn.curr.fetchone()
        return key

    async def update(self, updated: Users):
        args = updated.dict()
        self.conn.curr.execute(self.sqlUpdate.format(**args))
        self.conn.conn.commit()
        result = self.conn.curr.fetchone()
        model = parse_obj_as(Users, result)
        return model

    async def delete(self, key: int):
        args = {"key": key}
        self.conn.curr.execute(self.sqlDelete.format(**args))
        self.conn.conn.commit()
        if (self.conn.curr.rowcount == 1):
            return True
        else:
            return False
