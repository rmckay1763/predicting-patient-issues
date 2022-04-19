from typing import List
from api.userinfo.models import (
    Patient, 
    PatientIn, 
    PatientOut,  
    Vital, 
    VitalIn,
    VitalOut, 
    Status
)
from api.userinfo.crud.patientcrud import PatientCRUD
from api.userinfo.crud.vitalcrud import VitalCRUD

class PatientService:
    '''
    Provides methods to interact with patient related tables.
    '''

    def __init__(self, patients: PatientCRUD, vitals: VitalCRUD) -> None:
        '''
        Constructor.

        Parameters:
            patients (PatientCRUD): CRUD class for the patient table.
            vitals (VitalCRUD): CRUD class for the vital table.
        '''
        self.patients = patients
        self.vitals = vitals
    
    async def __fetchStatus(self, id: int) -> Status:
        '''
        Get a Status model from the given id.

        Parameters:
            id (int): Primary key of the status table.

        Returns:
            Status: Model for the status.
        '''
        try:
            return await self.patients.fetchStatus(id)
        except BaseException as err:
            raise err

    async def __hydratePatient(self, patient: Patient) -> PatientOut:
        '''
        Hydrates the PatientOut model to send to the front end.

        Parameters:
            patient (Patient): patient model to hydrate.

        Returns:
            PatientOut: hydrated PatientOut model.
        '''
        try:
            status = await self.__fetchStatus(patient.status)
            out = PatientOut(
                pid = patient.pid,
                admit_time = patient.admit_time,
                firstname = patient.firstname,
                lastname = patient.lastname,
                age = patient.age,
                gender = patient.gender,
                status = status
            )
            return out
        except BaseException as err:
            raise err

    async def fetchAllPatients(self) -> List[PatientOut]:
        '''
        Fetch and hydrate all entries in the patient table.

        Returns:
            list[PatientOut]: All patients as a list of PatientOut objects.
        '''
        try:
            outList: List[PatientOut] = []
            patients = await self.patients.fetchAll()
            for patient in patients:
                out = await self.__hydratePatient(patient)
                outList.append(out)
            return outList
        except BaseException as err:
            raise err

    async def addPatient(self, patient: PatientIn) -> dict:
        '''
        Inserts a patient into the patient table.

        Parameters:
            patient (PatientIn): Information for the new patient.

        Returns:
            dict: Primary key of the new user as a dictionary with key 'pid'.
        '''
        try:
            return await self.patients.insert(patient)
        except BaseException as err:
            raise err

    async def updatePatient(self, patient: Patient) -> PatientOut:
        '''
        Updates a patient's information.

        Parameters:
            patient (Patient): Model with updated information.

        Returns:
            PatientOut: The result of the update as a PatientOut object.
        '''
        try:
            result = await self.patients.update(patient)
            return await self.__hydratePatient(result)
        except BaseException as err:
            raise err

    async def updateStatus(self, pid: int, status: int) -> PatientOut:
        '''
        Updates the status column of a patient.

        Parameters:
            pid (int): prmiary key of patient.
            status (int): primary key of the updated status.

        Returns:
            PatientOut: The result of the update as a PatientOut object.
        '''
        try:
            patient = await self.patients.fetchOne(pid)
            patient.status = status
            return await self.updatePatient(patient)
        except BaseException as err:
            raise err

    async def deletePatient(self, pid: int) -> bool:
        '''
        Deletes a patient from the patient table.

        Parameters:
            pid (int): Primary key of the patient to delete.

        Returns:
            bool: True if successful, raises error otherwise.
        '''
        try:
            return await self.patients.delete(pid)
        except BaseException as err:
            raise err

    async def fetchVitals(self, pid: int, limit: int) -> List[VitalOut]:
        '''
        Fetch vital records for a specified patient.

        Parameters:
            pid (int): Primary key of the patient.
            limit (int): Max number of records to return.

        Returns:
            list(Vital): List of Vital objects with given pid.
        '''
        outList: List[VitalOut] = []
        try:
            vitals =  await self.vitals.fetchOne(pid, limit)
            for vital in vitals:
                out = VitalOut(
                    heart_rate = vital.heart_rate,
                    sao2 = vital.sao2,
                    respiration = vital.respiration,
                    systolic = vital.systolic,
                    diastolic = vital.diastolic
                )
                outList.append(out)
            return outList
        except BaseException as err:
            raise err

    async def addVital(self, vital: VitalIn) -> dict:
        '''
        Adds a vital record into the vital table.

        Parameters:
            vital (VitalIn): Model with the vital information.

        Returns:
            dict: Primary key of the new vital record (foreign key from patient table).
        '''
        try:
            return await self.vitals.insert(vital)
        except BaseException as err:
            raise err

    
    