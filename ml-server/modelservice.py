from typing import List
from dataclasses import dataclass
from apimodels import Status, Vital
from modelhandler import ModelHandler
from dataprocessor import DataProcessor

@dataclass
class Bound:
    '''
    Data class to store upper and lower bounds for a vital.
    '''
    lower: int
    upper: int

@dataclass
class VitalBounds:
    '''
    Data class to store Bounds for each vital.
    '''
    heartrate: Bound
    respiration: Bound
    sao2: Bound
    systolic: Bound
    diastolic: Bound

class ModelService:
    '''
    Service for ml models.
    '''

    alert = Status(id = 1, text = 'Alert')
    '''Alert status to return to caller'''

    normal = Status(id = 9, text = 'Normal')
    '''Normal status to return to caller'''

    vitalBounds = VitalBounds(
        heartrate = Bound(lower=50, upper=200),
        respiration = Bound(lower=10, upper=40),
        sao2 = Bound(upper=100, lower=70),
        systolic = Bound(upper=150, lower=80),
        diastolic = Bound(upper=80, lower=40)
    )
    '''Vital bounds for checking predicted vitals'''

    def __init__(self) -> None:
        '''
        Constructor.
        '''
        self.models = ModelHandler()

    async def predictVitals(self, input: List[Vital]) -> Vital:
        '''
        Predicts each vital one time step in future.

        Parameters:
            input (MLInput): Patient and associated vital records.

        Returns:
            MLVital: Predicted vitals.
        '''
        data = DataProcessor(input)
        data.parseVitals()

        heartRate = await self.models.predictHeartRate(data.heart_rate)
        sao2 = await self.models.predictSao2(data.sao2)
        respiration = await self.models.predictRespiration(data.respiration)
        systolic = await self.models.predictSystolic(data.systolic)
        diastolic = await self.models.predictDiastolic(data.diastolic)

        prediction = Vital(
            heart_rate = heartRate,
            sao2 = sao2,
            respiration = respiration,
            systolic = systolic,
            diastolic = diastolic
        )
        return prediction

    async def checkVitals(self, vitals: Vital) -> Status:
        '''
        Check vital .

        Parameters: 
            vitals (MLVital) - The vitals to predict from.

        Returns:
            Status - Status object for the predicted status.
        '''
        return self.normal if self.checkBounds(vitals) else self.alert

    def checkBounds(self, vitals: Vital) -> bool:
        '''
        Check if vitals are within known safe bounds.

        Parameters:
            vitals - Vital object to check.

        Returns:
            bool - True if all vitals within safe range, false otherwise.
        '''
        return (
            self.checkRange(
                value = vitals.heart_rate, 
                lower = self.vitalBounds.heartrate.lower, 
                upper = self.vitalBounds.heartrate.upper
            ) and
            self.checkRange(
                value = vitals.respiration,
                lower = self.vitalBounds.respiration.lower,
                upper = self.vitalBounds.respiration.upper
            ) and
            self.checkRange(
                value = vitals.sao2,
                lower = self.vitalBounds.sao2.lower,
                upper = self.vitalBounds.sao2.upper
            ) and
            self.checkRange(
                value = vitals.systolic,
                lower = self.vitalBounds.systolic.lower,
                upper = self.vitalBounds.systolic.upper
            ) and
            self.checkRange(
                value = vitals.diastolic,
                lower = self.vitalBounds.diastolic.lower,
                upper = self.vitalBounds.diastolic.upper
            )
        )

    def checkRange(self, value, upper, lower) -> bool:
        '''
        Check if a value is within a given range

        Parameters:
            value - The value to check.

            lower - The lower limit.

            upper - The upper limit.

        Returns:
            bool - True if value is within range, false otherwise.
        '''
        return value >= lower and value <= upper