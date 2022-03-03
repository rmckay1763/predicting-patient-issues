from typing import List
from pydantic import BaseModel
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Patient, Vital
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class ArchiveCRUD(BaseCRUD):
    """
    Abstracts interacting with the archive tables from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # sequel statment objects
        self.fetchAllPatientsSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('patient_archive'))

        self.fetchPatientSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('patient_archive'),
            key = sql.Identifier('pid'))

        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('patient_archive'),
            key = sql.Identifier('pid'))

        self.fetchPatientVitalsSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('vital_archive'),
            key = sql.Identifier('pid'))

        self.fetchAllVitalsSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('vital_archive'))

    async def fetchPatient(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchPatientSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        patient = cursor.fetchone()
        if (patient == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find patient')
        model = parse_obj_as(Patient, patient)
        cursor.close()
        return model

    async def fetchAllPatients(self):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllPatientsSQL)
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        patients = cursor.fetchall()
        if (patients == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find patients')
        models = parse_obj_as(List[Patient], patients)
        cursor.close()
        return models

    async def deletePatient(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.deleteSQL, (key,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        if (cursor.rowcount == 0):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to delete patient')
        cursor.close()
        return True
    
    async def fetchPatientVitals(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchPatientVitalsSQL, (key,))
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

    async def fetchAllVitals(self):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllVitalsSQL)
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

    async def fetchKey(self, _: str):
        pass

    async def fetchAll(self):
        pass

    async def fetchOne(self, _: int):
        pass

    async def insert(self, _: BaseModel):
        pass

    async def update(self, _: BaseModel):
        pass

    async def delete(self, _: int):
        pass