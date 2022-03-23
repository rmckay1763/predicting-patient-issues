from datetime import datetime
from typing import List
from pydantic import BaseModel
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Vital, VitalIn
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class VitalCRUD(BaseCRUD):
    """
    Abstracts interacting with the vital table from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector) -> None:
        super().__init__(conn)

        # table dependent sql query strings.
        self.insertQuery = ("INSERT INTO public.{table} ({columns}) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING {key};")
        
        # sequel statment objects
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('vital'),
            key = sql.Identifier('pid'))

        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('vital'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('vital'),
            key = sql.Identifier('pid'),
            columns = sql.SQL(',').join([
                sql.Identifier('pid'),
                sql.Identifier('timestamp'),
                sql.Identifier('heart_rate'),
                sql.Identifier('sao2'),
                sql.Identifier('respiration')]))

    # fetches all vital records associated with the given patient id
    async def fetchOne(self, key: int) -> List[Vital]:
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

    async def fetchAll(self) -> List[Vital]:
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

    async def insert(self, vital: VitalIn) -> dict:
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.insertSQL, (
                vital.pid, 
                datetime.now(), 
                vital.heart_rate, 
                vital.sao2, 
                vital.respiration,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to insert record')
        cursor.close()
        return key

    # use the primary key from the patient table
    async def fetchKey(self, value: str) -> None:
        pass

    # not updateable
    async def update(self, vital: BaseModel) -> None:
        pass

    # trigger deletes vitals when the patient is deleted
    async def delete(self, key: int) -> None:
        pass

