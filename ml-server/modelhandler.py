from tensorflow.keras.models import load_model
from tensorflow.keras import Sequential
from typing import List, Union
from fastapi import HTTPException
from numpy import ndarray, sum

class ModelHandler:
    '''
    Provides access to predict method of ml models.
    '''

    inputSize = 5

    def __init__(self) -> None:
        '''
        Constructor.
        '''
        try:
            self.heartRate: Sequential = load_model('hr_model')
            self.sao2: Sequential = load_model('sao2_model')
            self.respiration: Sequential = load_model('resp_model')
            self.systolic: Sequential = load_model('systolic_model')
            self.diastolic: Sequential = load_model('diastolic_model')
        except IOError as err:
            raise err

    def validateData(self, data: List[Union[int, float]]) -> None:
        '''
        Validates the number of records in a list of vitals.

        Parameters:
            data - List of a single vital, e.g. list of heart rate recordings.
        '''
        if len(data) != self.inputSize:
            raise HTTPException(422, detail=f'Number of records not equal to {self.inputSize}')

    async def predictHeartRate(self, data: List[int]) -> int:
        '''
        Predicts heart rate.

        Parameters:
            data (list[int]): Previous 5 recorded heart rates.

        Returns:
            int: Next predicted heart rate.
        '''
        self.validateData(data)
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
        self.validateData(data)
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
        self.validateData(data)
        try:
            prediction: ndarray = self.respiration.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'respiration input data not valid')

    async def predictSystolic(self, data: List[int]) -> int:
        '''
        Predicts systolic blood pressure.

        Parameters:
            data (list[int]): Previous 5 recorded systolic levels.

        Returns:
            int: Next predicted systolic level.
        '''
        self.validateData(data)
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
        self.validateData(data)
        try:
            prediction: ndarray = self.diastolic.predict([data])
            value = sum(prediction.tolist())
            return round(value)
        except ValueError:
            raise HTTPException(422, 'diastolic input data not valid')