from typing import List
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Patient
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class PatientArchiveCRUD(BaseCRUD):
    """
    Abstracts interacting with the patient_archive table from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # table dependent sql query strings.
        self.insertQuery = (
            "INSERT INTO public.{table} ({columns}) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING {key};")

        # sequel statment objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('patient_archive'),
            key = sql.Identifier('pid'),
            column = sql.Identifier('lastname'))
        
        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('patient_archive'))

        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('patient_archive'),
            key = sql.Identifier('pid'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('patient_archive'),
            key = sql.Identifier('pid'),
            columns = sql.SQL(',').join([
                sql.Identifier('pid'),
                sql.Identifier('admit_time'),
                sql.Identifier('firstname'),
                sql.Identifier('lastname'),
                sql.Identifier('age'),
                sql.Identifier('gender'),
                sql.Identifier('status')]))

        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('patient_archive'),
            key = sql.Identifier('pid'))

    async def fetchKey(self, value: str):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchKeySQL, (value,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to find patient')
        cursor.close()
        return key

    async def fetchAll(self):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchAllSQL)
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

    async def fetchOne(self, key: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.fetchOneSQL, (key,))
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

    async def insert(self, patient: Patient):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.insertSQL, (
                patient.pid,
                patient.admit_time,
                patient.firstname, 
                patient.lastname, 
                patient.age, 
                patient.gender, 
                patient.status,))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        key = cursor.fetchone()
        if (key == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to insert patient')
        cursor.close()
        return key

    async def update(self, updated: Patient):
        pass

    async def delete(self, key: int):
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