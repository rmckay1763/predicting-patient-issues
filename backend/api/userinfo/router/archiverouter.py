from fastapi import APIRouter, Depends
from api.userinfo.models import Patient, Vital
from api.userinfo.crud.patientarchivecrud import PatientArchiveCRUD
from api.userinfo.crud.vitalarchivecrud import VitalArchiveCRUD
from api.dependencies import auth

class ArchiveRouter:
    '''
    Implements routes for the archive tables using an APIRouter
    '''

    def __init__(self, patients: PatientArchiveCRUD, vitals: VitalArchiveCRUD):
        '''
        Constructor.

        Parameters:
            patients (PatientCRUD): The crud to interact with the table.
        '''
        self.patients = patients
        self.vitals = vitals
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
        self.router.get("/fetchOnePatient/{key}")(self.fetchOnePatient)
        self.router.post("/insertPatient/")(self.insertPatient)
        self.router.delete("/deletePatient/{key}")(self.deletePatient)
        self.router.get("/fetchPatientVitals/{key}")(self.fetchPatientVitals)

    async def fetchAllPatients(self):
        """
        Route to fetch all rows from the patient table.

        Returns:
            list: A list of Patient objects.
        """
        try:
            return await self.patients.fetchAll()
        except BaseException as err:
            raise err

    async def fetchOnePatient(self, key: int):
        """
        Route to fetch a patient given the primary key.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            Patient: The patient as a Patient model.
        """
        try:
            return await self.patients.fetchOne(key)
        except BaseException as err:
            raise err

    async def insertPatient(self, patientinfo: Patient):
        """
        Route to insert a new patient into the patients table.

        Parameters:
            patientinfo (PatientIn): The information for the new patient.

        Returns:
            RealDictRow: The primay key of the new patient.
        """
        try:
            return await self.patients.insert(patientinfo)
        except BaseException as err:
            raise err

    async def deletePatient(self, key: int):
        """
        Route to delete a patient from the patient table.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            bool: True if successful, false otherwise.
        """
        try:
            return await self.patients.delete(key)
        except BaseException as err:
            raise err


    async def fetchPatientVitals(self, key: int):
        """
        Route to fetch all vitals from the given patiend id.

        Returns:
            list: A list of Vital objects.
        """
        try:
            return await self.vitals.fetchOne(key)
        except BaseException as err:
            raise err
