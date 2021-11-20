from typing import List
from pydantic.tools import parse_obj_as
from models import Roles, RolesIn
from tableUtils import TableUtils
from postgresconnector import PostgresConnector

class RolesUtils(TableUtils):
    """
    Abstracts interacting with the roles table from the userinfo database (descended from TableUtils).
    """
    
    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # formatted strings to execute sql queries
        self.sqlFetchKey = "SELECT id FROM public.roles WHERE name='{name}';"
        self.sqlFetchAll = "SELECT * FROM public.roles;"
        self.sqlFetchOne = "SELECT * FROM public.roles WHERE id={key};"
        self.sqlInsert = "INSERT INTO public.roles (name) VALUES ('{name}') RETURNING id;"
        self.sqlUpdate = "UPDATE public.roles SET name='{name}' WHERE id={id} RETURNING *;"
        self.sqlDelete = "DELETE FROM public.roles WHERE id={key};"
        
    async def fetchKey(self, value: str):
        args = {"name": value}
        self.conn.curr.execute(self.sqlFetchKey.format(**args))
        key = self.conn.curr.fetchone()
        return key
        
    async def fetchAll(self):
        self.conn.curr.execute(self.sqlFetchAll)
        roles = self.conn.curr.fetchall()
        models = parse_obj_as(List[Roles], roles)
        return models

    async def fetchOne(self, key: int):
        args = {"key": key}
        self.conn.curr.execute(self.sqlFetchOne.format(**args))
        role = self.conn.curr.fetchone()
        model = parse_obj_as(Roles, role)
        return model

    async def insert(self, role: RolesIn):
        args = role.dict()
        self.conn.curr.execute(self.sqlInsert.format(**args))
        self.conn.conn.commit()
        key = self.conn.curr.fetchone()
        return key

    async def update(self, updated: Roles):
        args = updated.dict()
        self.conn.curr.execute(self.sqlUpdate.format(**args))
        self.conn.conn.commit()
        result = self.conn.curr.fetchone()
        model = parse_obj_as(Roles, result)
        return model

    async def delete(self, key: int):
        args = {"key": key}
        self.conn.curr.execute(self.sqlDelete.format(**args))
        self.conn.conn.commit()
        if (self.conn.curr.rowcount == 1):
            return True
        else:
            return False

    
    
    