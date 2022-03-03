from fastapi import APIRouter, Depends
from api.userinfo.crud.archivecrud import ArchiveCRUD
from api.dependencies import auth

class ArchiveRouter:
    '''
    Implements routes for the archive tables using an APIRouter
    '''

    def __init__(self, archive: ArchiveCRUD):
        '''
        Constructor.

        Parameters:
            archive (ArchiveCRUD): The crud to interact with the archive tables.
        '''
        self.archive = archive
        self.router = APIRouter(
            prefix="/api/archive",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchAllPatients/")(self.fetchAllPatients)
        self.router.get("/fetchPatient/{key}")(self.fetchPatient)
        self.router.delete("/deletePatient/{key}")(self.deletePatient)
        self.router.get("/fetchAllVitals")(self.fetchAllVitals)
        self.router.get("/fetchPatientVitals/{key}")(self.fetchPatientVitals)

    async def fetchAllPatients(self):
        """
        Route to fetch all rows from the patient_archive table.

        Returns:
            list: A list of Patient objects.
        """
        try:
            return await self.archive.fetchAllPatients()
        except BaseException as err:
            raise err

    async def fetchPatient(self, key: int):
        """
        Route to fetch a patient given the primary key.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            Patient: The patient as a Patient model.
        """
        try:
            return await self.archive.fetchPatient(key)
        except BaseException as err:
            raise err

    async def deletePatient(self, key: int):
        """
        Route to delete a patient from the patient_archive table.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            return await self.archive.deletePatient(key)
        except BaseException as err:
            raise err
    
    async def fetchAllVitals(self):
        """
        Route to fetch all vitals from vital_archive table.

        Returns:
            list[Vital]: list of all entries in the vital_archive table.
        """
        try:
            return await self.archive.fetchAllVitals()
        except BaseException as err:
            raise err

    async def fetchPatientVitals(self, key: int):
        """
        Route to fetch all vitals from the given patient id.

        Parameters:
            key (int): Primary key (pid) of the patient.

        Returns:
            list: A list of Vital objects.
        """
        try:
            return await self.archive.fetchPatientVitals(key)
        except BaseException as err:
            raise err
