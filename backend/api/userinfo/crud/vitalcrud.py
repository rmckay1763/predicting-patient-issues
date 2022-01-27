from typing import List
from pydantic import BaseModel
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Vital
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class VitalCRUD(BaseCRUD):
    """
    Abstracts interacting with the vital table from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('vital'),
            key = sql.Identifier('pid'))

        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('vital'))

    async def fetchKey(self, value: str):
        pass

    async def fetchOne(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        vitals = cursor.fetchall()
        if (vitals == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find records')
        models = parse_obj_as(List[Vital], vitals)
        cursor.close()
        return models

    async def fetchAll(self):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllSQL)
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        vitals = cursor.fetchall()
        if (vitals == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find records')
        models = parse_obj_as(List[Vital], vitals)
        cursor.close()
        return models 

    async def insert(self, vital: BaseModel):
        pass

    async def update(self, vital: BaseModel):
        pass

    async def delete(self, key: int):
        pass

