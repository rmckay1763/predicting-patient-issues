from fastapi import APIRouter, Depends
from api.userinfo.crud.patientcrud import PatientCRUD
from api.dependencies import auth
from api.userinfo.models import MLModelIn
from typing import List
from api.utils.mlhandler import MLHandler

class MLRouter:
    '''
    Implements routes for the machine learning
    '''

    def __init__(self, patients: PatientCRUD, mlhandler: MLHandler):
        '''
        Constructor.

        Parameters:
            none
        '''
        self.patients = patients
        self.mlhandler = mlhandler
        self.router = APIRouter(
            prefix="/api/predict",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.post("/")(self.getPrediction)

    async def getPrediction(self, mlmodelin: MLModelIn):
        """
        Route to make a prediction through the machine learning model.

        Parameters:
            mlmodelin (MLModelIn): The patient id and vital history

        Returns:
            none
        """
        try:
            prediction = self.mlhandler.predict(mlmodelin)
            return prediction
        except BaseException as err:
            raise err