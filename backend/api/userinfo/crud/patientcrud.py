from typing import List
from xml.dom.minidom import Identified
from pydantic.tools import parse_obj_as
from psycopg2 import sql, DatabaseError
from fastapi import HTTPException
from api.userinfo.models import Patient, PatientIn
from api.userinfo.crud.basecrud import BaseCRUD
from api.utils.postgresconnector import PostgresConnector

class PatientCRUD(BaseCRUD):
    """
    Abstracts interacting with the patient table from the userinfo database.
    """

    def __init__(self, conn: PostgresConnector):
        super().__init__(conn)

        # table dependent sql query strings.
        self.insertQuery = (
            "INSERT INTO public.{table} ({columns}) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING {key};")

        self.updateQuery = (
            "UPDATE public.{table} "
            "SET {firstname}=%s, {lastname}=%s, {age}=%s, {gender}=%s "
            "WHERE {key} = %s RETURNING *;")

        self.updateStatus = (
            "UPDATE public.{table} "
            "SET {status}=%s "
            "WHERE {key}=%s RETURNING {key};"
        )

        # sequel statment objects
        self.fetchKeySQL = sql.SQL(self.fetchKeyQuery).format(
            table = sql.Identifier('patient'),
            key = sql.Identifier('pid'),
            column = sql.Identifier('lastname'))
        
        self.fetchAllSQL = sql.SQL(self.fetchAllQuery).format(
            table = sql.Identifier('patient'))

        self.fetchOneSQL = sql.SQL(self.fetchOneQuery).format(
            table = sql.Identifier('patient'),
            key = sql.Identifier('pid'))

        self.insertSQL = sql.SQL(self.insertQuery).format(
            table = sql.Identifier('patient'),
            key = sql.Identifier('pid'),
            columns = sql.SQL(',').join([
                sql.Identifier('firstname'),
                sql.Identifier('lastname'),
                sql.Identifier('age'),
                sql.Identifier('gender'),
                sql.Identifier('status')]))

        self.updateSQL = sql.SQL(self.updateQuery).format(
            table = sql.Identifier('patient'),
            firstname = sql.Identifier('firstname'),
            lastname = sql.Identifier('lastname'),
            age = sql.Identifier('age'),
            gender = sql.Identifier('gender'),
            key = sql.Identifier('pid'))

        self.updateStatusSQL = sql.SQL(self.updateStatus).format(
            key = sql.Identifier('pid'),
            table = sql.Identifier('patient'),
            status = sql.Identifier('status')
        )

        self.deleteSQL = sql.SQL(self.deleteQuery).format(
            table = sql.Identifier('patient'),
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

    async def insert(self, patient: PatientIn):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.insertSQL, (
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
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.updateSQL, (
                updated.firstname, 
                updated.lastname, 
                updated.age, 
                updated.gender,  
                updated.pid, ))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        result = cursor.fetchone()
        if (result == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to update patient status')
        model = parse_obj_as(Patient, result)
        cursor.close()
        return model

    async def updateStatus(self, pid: int, status: int):
        cursor = self.connector.getCursor()
        try:
            cursor.execute(self.updateStatusSQL, (
                status,
                pid,
            ))
        except DatabaseError as err:
            cursor.close()
            raise HTTPException(status_code=500, detail=err.pgerror)
        result = cursor.fetchone()
        if (result == None):
            cursor.close()
            raise HTTPException(status_code=404, detail='Failed to update patient status')
        cursor.close()
        return True

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