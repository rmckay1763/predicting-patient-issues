from typing import List
from api.userinfo.crud.patientarchivecrud import PatientArchiveCRUD
from api.userinfo.crud.vitalarchivecrud import VitalArchiveCRUD
from api.userinfo.crud.patientcrud import PatientCRUD
from api.userinfo.crud.vitalcrud import VitalCRUD
from api.userinfo.models import Patient, Vital

class ArchiveHandler:
    '''
    Handler for archiving patient and associate vitals.
    '''

    def __init__(
        self, 
        patients: PatientCRUD, 
        vitals: VitalCRUD,
        archivedPatients: PatientArchiveCRUD,
        archivedVitals: VitalArchiveCRUD
        ):
        '''
        Constructor.

        Parameters:
            patients (PatientCRUD): The crud to interact with the patient table.
            vitals (VitalCRUD): The crud to interact with the vital table.
            archivedPatients (PatientArchiveCRUD): The crud to interact with the patient_archive table.
            archivedVitals (VitalArchiveCRUD): The crud to interact with vital_archive table.
        '''
        self.patients = patients
        self.vitals = vitals
        self.archivedPatients = archivedPatients
        self.archivedVitals = archivedVitals

    async def archive(self, pid: int):
        '''
        Saves patient and vital in archive tables.

        Parameters:
            pid (int): The pid of the patient to archive.

        Returns:
            int: The pid of the archived patient.
        '''
        try:
            patient = await self.patients.fetchOne(pid)
            vitals = await self.vitals.fetchOne(pid)
            await self.archivePatient(patient)
            await self.archiveVitals(vitals)
            return patient.pid
        except BaseException as err:
            raise err

    async def archivePatient(self, patient: Patient):
        '''
        Archive a patient.

        Parameters:
            patient (Patient): The patient to archive
        '''
        try:
            await self.archivedPatients.insert(patient)
        except BaseException as err:
            raise err

    async def archiveVitals(self, vitals: List[Vital]):
        '''
        Archive a list of vitals.

        Parameters:
            vitals (List[Vital]): The list of vitals to archive.
        '''
        try:
            for vital in vitals:
                await self.archivedVitals.insert(vital)
        except BaseException as err:
            raise err
