from typing import List
from apimodels import Vital

class DataProcessor:
    '''
    Class to prepare patient/vital data for ml models.
    '''

    def __init__(self, vitals: List[Vital]) -> None:
        '''
        Constructor.

        Parameters:
            patient (Patient): The patient to send to the ml models.
            vitals (list[Vital]): Vitals records for selected patient.
        '''
        self.vitals = vitals
        self.heart_rate = []
        self.sao2 = []
        self.respiration = []
        self.systolic = []
        self.diastolic = []

    def parseVitals(self) -> None:
        '''
        Sets list for each individual vital.
        '''
        for vital in self.vitals:
            self.heart_rate.append(vital.heart_rate)
            self.sao2.append(vital.sao2)
            self.respiration.append(vital.respiration)
            self.systolic.append(vital.systolic)
            self.diastolic.append(vital.diastolic)
        self.orderVitals()

    def orderVitals(self) -> None:
        '''
        Sort vitals in descending order for ml models.
        '''
        self.heart_rate.reverse()
        self.sao2.reverse()
        self.respiration.reverse()
        self.systolic.reverse()
        self.diastolic.reverse()