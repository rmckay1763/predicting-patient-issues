from tensorflow.keras.models import load_model
from tensorflow.keras import Sequential
from typing import List
from fastapi import HTTPException
from numpy import ndarray, sum

class ModelHandler:
    '''
    Provides access to predict method of ml models.
    '''

    def __init__(self) -> None:
        '''
        Constructor.
        '''
        try:
            self.heartRate: Sequential = load_model('hr_model')
            self.sao2: Sequential = load_model('sao2_model')
            self.respiration: Sequential = load_model('resp_model')
            self.cvp: Sequential = load_model('cvp_model')
            self.systolic: Sequential = load_model('systolic_model')
            self.diastolic: Sequential = load_model('diastolic_model')
            self.temperature: Sequential = load_model('temp_model')
        except IOError as err:
            raise err

    async def predictHeartRate(self, data: List[int]) -> int:
        '''
        Predicts heart rate.

        Parameters:
            data (list[int]): Previous 5 recorded heart rates.

        Returns:
            int: Next predicted heart rate.
        '''
        try:
            prediction: ndarray = self.heartRate.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'heart rate input data not valid')

    async def predictSao2(self, data: List[int]) -> int:
        '''
        Predicts sao2.

        Parameters:
            data (list[int]): Previous 5 recorded sao2 levels.

        Returns:
            int: Next predicted sao2 level.
        '''
        try:
            prediction: ndarray = self.sao2.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'sao2 input data not valid')

    async def predictRespiration(self, data: List[int]) -> int:
        '''
        Predicts respiration.

        Parameters:
            data (list[int]): Previous 5 recorded respiration levels.

        Returns:
            int: Next predicted respiration level.
        '''
        try:
            prediction: ndarray = self.respiration.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'respiration input data not valid')

    async def predictCvp(self, data: List[int]) -> int:
        '''
        Predicts cvp.

        Parameters:
            data (list[int]): Previous 5 recorded cvp levels.

        Returns:
            int: Next predicted cvp level.
        '''
        try:
            prediction: ndarray = self.cvp.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'cvp input data not valid')

    async def predictSystolic(self, data: List[int]) -> int:
        '''
        Predicts systolic blood pressure.

        Parameters:
            data (list[int]): Previous 5 recorded systolic levels.

        Returns:
            int: Next predicted systolic level.
        '''
        try:
            prediction: ndarray = self.systolic.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'systolic input data not valid')

    async def predictDiastolic(self, data: List[int]) -> int:
        '''
        Predicts diastolic blood pressure.

        Parameters:
            data (list[int]): Previous 5 recorded diastolic levels.

        Returns:
            int: Next predicted diastolic level.
        '''
        try:
            prediction: ndarray = self.diastolic.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'diastolic input data not valid')

    async def predictTemperature(self, data: List[float]) -> float:
        '''
        Predicts temperature.

        Parameters:
            data (list[float]): Previous 5 recorded temperatures (celcius).

        Returns:
            float: Next predicted temperature (celcius).
        '''
        try:
            prediction: ndarray = self.temperature.predict([data])
            value = sum(prediction.tolist())
            return round(value, 1)
        except ValueError:
            raise HTTPException(422, 'temperature input data not valid')