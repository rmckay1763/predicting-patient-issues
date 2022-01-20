from fastapi import APIRouter, Depends
from api.userinfo.models import Patient, PatientIn
from api.userinfo.crud.patientcrud import PatientCRUD
from api.dependencies import auth

class PatientRouter:
    '''
    Implements routes for the patient table using an APIRouter
    '''

    def __init__(self, patients: PatientCRUD):
        '''
        Constructor.

        Parameters:
            patients (PatientCRUD): The crud to interact with the table.
        '''
        self.patients = patients
        self.router = APIRouter(
            prefix="/api/patient"
            # dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchKey/{lastname}")(self.fetchKey)
        self.router.get("/fetchAll/")(self.fetchAll)
        self.router.get("/fetchOne/{key}")(self.fetchOne)
        self.router.post("/insert/")(self.insert)
        self.router.put("/update")(self.update)
        self.router.delete("/delete/{key}")(self.delete)

    async def fetchKey(self, lastname: str):
        """
        Route to fetch the primary key of a patient.

        Parameters:
            lastname (str): The lastname of the patient.

        Returns:
            RealDictRow: The primay key of the patient.
        """
        try:
            return await self.patients.fetchKey(lastname)
        except BaseException as err:
            raise err

    async def fetchAll(self):
        """
        Route to fetch all rows from the patient table.

        Returns:
            list: A list of Patient objects.
        """
        try:
            return await self.patients.fetchAll()
        except BaseException as err:
            raise err

    async def fetchOne(self, key: int):
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

    async def insert(self, patientinfo: PatientIn):
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

    async def update(self, updated: Patient):
        """
        Route to update a patient's status.

        Parameters:
            updated (Patient): The patient with the updated status.

        Returns:
            Patient: The result of the update.
        """
        try:
            return await self.patients.update(updated)
        except BaseException as err:
            raise err

    async def delete(self, key: int):
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
