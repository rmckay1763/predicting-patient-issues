from typing import List
from pydantic import BaseModel
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Rank
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class RankCRUD(BaseCRUD):
    """
    Abstracts interacting with the rank table from the userinfo database.
    """

    def __init__(self, connector: PostgresConnector) -> None:
        super().__init__(connector)

    # sequel statment objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('rank'),
            key = sql.Identifier('id'),
            column = sql.Identifier('abbreviation'))

        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('rank'))
        
        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('rank'),
            key = sql.Identifier('id'))

    async def fetchKey(self, value: str) -> dict:
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchKeySQL, (value,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find rank id')
        cursor.close()
        return key

    async def fetchAll(self) -> List[Rank]:
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllSQL)
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        ranks = cursor.fetchall()
        if (ranks == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find ranks')
        models = parse_obj_as(List[Rank], ranks)
        cursor.close()
        return models

    async def fetchOne(self, key: int) -> Rank:
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        rank = cursor.fetchone()
        if (rank == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find rank')
        model = parse_obj_as(Rank, rank)
        cursor.close()
        return model

    async def insert(self, _: BaseModel) -> dict:
        pass

    async def update(self, _: BaseModel) -> BaseModel:
        pass

    async def delete(self, _: int) -> bool:
        pass