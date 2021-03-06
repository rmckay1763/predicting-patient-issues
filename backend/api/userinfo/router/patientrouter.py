from typing import List
from fastapi import APIRouter, Depends
from api.userinfo.models import (
    Patient, 
    PatientIn, 
    PatientOut, 
    Vital, 
    VitalIn
)
from api.userinfo.services.patientservice import PatientService
from api.dependencies import auth

class PatientRouter:
    '''
    Implements routes for the patient table using an APIRouter
    '''

    def __init__(self, service: PatientService) -> None:
        '''
        Constructor.

        Parameters:
            service (PatientService): Service to interact with patient related tables.
        '''
        self.service = service
        self.router = APIRouter(
            prefix="/api/patient",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self) -> None:
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchAllPatients")(self.fetchAllPatients)
        self.router.post("/addPatient/")(self.addPatient)
        self.router.put("/updatePatient")(self.updatePatient)
        self.router.delete("/deletePatient")(self.deletePatient)
        self.router.get("/fetchVitals")(self.fetchVitals)
        self.router.post("/addVital")(self.addVital)
        self.router.put("/updateStatus")(self.updateStatus)

    async def fetchAllPatients(self) -> List[PatientOut]:
        """
        Route to fetch all rows from the patient table.

        Returns:
            list[PatientOut]: A list of PatientOut objects.
        """
        try:
            return await self.service.fetchAllPatients()
        except BaseException as err:
            raise err

    async def addPatient(self, patientinfo: PatientIn) -> dict:
        """
        Route to insert a new patient into the patients table.

        Parameters:
            patientinfo (PatientIn): The information for the new patient.

        Returns:
            dict: Primay key of the new patient as a dictionary with key 'pid'.
        """
        try:
            return await self.service.addPatient(patientinfo)
        except BaseException as err:
            raise err

    async def updatePatient(self, updated: Patient) -> PatientOut:
        """
        Route to update a patient's information.

        Parameters:
            updated (Patient): The patient with the updated information.

        Returns:
            PatientOut: The result of the update as a PatientOut object.
        """
        try:
            return await self.service.updatePatient(updated)
        except BaseException as err:
            raise err

    async def deletePatient(self, key: int) -> bool:
        """
        Route to delete a patient from the patient table.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            bool: True if successful, raise error otherwise.
        """
        try:
            return await self.service.deletePatient(key)
        except BaseException as err:
            raise err

    async def fetchVitals(self, key: int, limit: int = 20) -> List[Vital]:
        '''
        Route to fetch vitals records for a patient.

        Parameters:
            pid (int): Primary key of the patient.
            limit (int): Max number of records to return.

        Returns:
            list[Vital]: List of vital objects for given patient.
        '''
        try:
            return await self.service.fetchVitals(key, limit)
        except BaseException as err:
            raise err

    async def addVital(self, vital: VitalIn) -> dict:
        '''
        Route to insert a vital into the vital table.

        Parameters:
            vital (Vital): The Vital object to insert.

        Returns:
            dict: Primary key of the new vital as a dictionary with key 'id'.
        '''
        try:
            return await self.service.addVital(vital)
        except BaseException as err:
            raise err

    async def updateStatus(self, pid: int, status: int) -> PatientOut:
        '''
        Route to update the status of a patient.

        Parameters:
            pid (int): prmiary key of patient.
            status (int): primary key of the updated status.

        Returns:
            PatientOut: The result of the update.
        '''
        try:
            return await self.service.updateStatus(pid, status)
        except BaseException as err:
            raise err