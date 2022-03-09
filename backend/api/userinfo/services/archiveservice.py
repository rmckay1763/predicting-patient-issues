from typing import List
from api.userinfo.models import Patient, Vital
from api.userinfo.crud.archivecrud import ArchiveCRUD

class ArchiveService:
    '''
    Service to interact with archive tables.
    '''

    def __init__(self, archive: ArchiveCRUD) -> None:
        '''
        Constructor.

        Parameters:
            archive (ArchiveCRUD): CRUD class for the archive tables.
        '''
        self.archive = archive

    async def fetchAllPatients(self) -> List[Patient]:
        '''
        Fetch all patiens from the patient archive table.

        Returns:
            list[Patient]: All archived patients as a list of Patient objects.
        '''
        try:
            return await self.archive.fetchAllPatients()
        except BaseException as err:
            raise err

    async def fetchPatient(self, pid: int) -> Patient:
        '''
        Fetch a patient from the patient archive table given the primary key.

        Parameters:
            pid (int): Primary key of the patient.

        Returns:
            Patient: Model for the selected patient.
        '''
        try:
            return await self.archive.fetchPatient(pid)
        except BaseException as err:
            raise err

    async def deletePatient(self, pid: int) -> bool:
        '''
        Delete a patient from the patient archive table.

        Parameters:
            pid (int): Primary key of the patient to delete.

        Returns:
            bool: True if deletion successful.
        '''
        try:
            return await self.archive.deletePatient(pid)
        except BaseException as err:
            raise err

    async def fetchVitals(self, pid: int) -> List[Vital]:
        '''
        Fetch vitals for a given patient from the vital archive table.

        Parameters:
            pid (int): Primary key of the patient associated with the vitals.

        Returns:
            list[Vital]: Vital records linked with the patient's pid.
        '''
        try:
            return await self.archive.fetchVitals(pid)
        except BaseException as err:
            raise err

    async def fetchAllVitals(self) -> List[Vital]:
        '''
        Fetch all vital records from the vital archive table.

        Returns:
            list[Vital]: All entries in the vital archive table.
        '''
        try:
            return await self.archive.fetchAllVitals()
        except BaseException as err:
            raise err