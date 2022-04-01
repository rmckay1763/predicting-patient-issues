from typing import List
from apimodels import Patient, Vital

class DataProcessor:
    '''
    Class to prepare patient/vital data for ml models.
    '''

    def __init__(self, patient: Patient, vitals: List[Vital]) -> None:
        '''
        Constructor.

        Parameters:
            patient (Patient): The patient to send to the ml models.
            vitals (list[Vital]): Vitals records for selected patient.
        '''
        self.patient = patient
        self.vitals = vitals
        self.offsets = []
        self.heart_rate = []
        self.sao2 = []
        self.respiration = []
        self.cvp = []
        self.systolic = []
        self.diastolic = []
        self.temperature = []
        self.icp = []

    def setOffsets(self):
        '''
        Computes offset for each vital record in minutes.
        '''
        start = self.patient.admit_time
        for vital in self.vitals:
            end = vital.timestamp
            offset = (end.timestamp() - start.timestamp()) / 60
            self.offsets.append(int(offset))

    def parseVitals(self):
        '''
        Sets list for each individual vital.
        '''
        for vital in self.vitals:
            self.heart_rate.append(vital.heart_rate)
            self.sao2.append(vital.sao2)
            self.respiration.append(vital.respiration)
            self.cvp.append(vital.cvp)
            self.systolic.append(vital.systolic)
            self.diastolic.append(vital.diastolic)
            self.temperature.append(vital.temperature)
            self.icp.append(vital.icp)