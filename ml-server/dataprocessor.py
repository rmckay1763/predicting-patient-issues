from typing import List
from apimodels import Vital

class DataProcessor:
    '''
    Class to prepare patient/vital data for ml models.

    !!!IMPORTANT!!! Constructor expects list of vitals sorted by time in descending order.
    Expects five minute intervals between each vital. parseVitals method prepares the
    input for the forecasting models based on this assumption.
    '''

    def __init__(self, vitals: List[Vital]) -> None:
        '''
        Constructor.

        Parameters:
            vitals - List of vitals sorted by time in descending order. 
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
        Resorts vitals in descending order for ml models.
        '''
        self.heart_rate.reverse()
        self.sao2.reverse()
        self.respiration.reverse()
        self.systolic.reverse()
        self.diastolic.reverse()