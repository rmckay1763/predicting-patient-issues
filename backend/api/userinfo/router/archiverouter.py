from typing import List
from fastapi import APIRouter, Depends
from api.userinfo.models import Patient, Vital
from api.userinfo.services.archiveservice import ArchiveService
from api.dependencies import auth

class ArchiveRouter:
    '''
    Implements routes for the archive tables using an APIRouter
    '''

    def __init__(self, service: ArchiveService) -> None:
        '''
        Constructor.

        Parameters:
            service (ArchiveService): Service to interact with the archive tables.
        '''
        self.service = service
        self.router = APIRouter(
            prefix="/api/archive",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self) -> None:
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchAllPatients/")(self.fetchAllPatients)
        self.router.get("/fetchPatient")(self.fetchPatient)
        self.router.delete("/deletePatient")(self.deletePatient)
        self.router.get("/fetchAllVitals")(self.fetchAllVitals)
        self.router.get("/fetchVitals")(self.fetchVitals)

    async def fetchAllPatients(self) -> List[Patient]:
        """
        Route to fetch all rows from the patient_archive table.

        Returns:
            list[Patient]: A list of Patient objects.
        """
        try:
            return await self.service.fetchAllPatients()
        except BaseException as err:
            raise err

    async def fetchPatient(self, key: int) -> Patient:
        """
        Route to fetch a patient given the primary key.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            Patient: The patient as a Patient model.
        """
        try:
            return await self.service.fetchPatient(key)
        except BaseException as err:
            raise err

    async def deletePatient(self, key: int) -> bool:
        """
        Route to delete a patient from the patient_archive table.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            return await self.service.deletePatient(key)
        except BaseException as err:
            raise err
    
    async def fetchAllVitals(self) -> List[Vital]:
        """
        Route to fetch all vitals from vital_archive table.

        Returns:
            list[Vital]: list of all entries in the vital_archive table.
        """
        try:
            return await self.service.fetchAllVitals()
        except BaseException as err:
            raise err

    async def fetchVitals(self, key: int) -> List[Vital]:
        """
        Route to fetch all vitals from the given patient id.

        Parameters:
            key (int): Primary key (pid) of the patient.

        Returns:
            list[Vital]: A list of Vital objects.
        """
        try:
            return await self.service.fetchVitals(key)
        except BaseException as err:
            raise err
