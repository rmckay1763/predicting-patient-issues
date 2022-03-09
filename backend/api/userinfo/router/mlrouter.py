from fastapi import APIRouter, Depends
from api.userinfo.models import MLModelIn, MLModelOut
from api.utils.mlhandler import MLHandler
from api.userinfo.services.patientservice import PatientService
from api.dependencies import auth

class MLRouter:
    '''
    Implements routes for the machine learning
    '''

    def __init__(self, service: PatientService, mlhandler: MLHandler) -> None:
        '''
        Constructor.

        Parameters:
            none
        '''
        self.service = service
        self.mlhandler = mlhandler
        self.router = APIRouter(
            prefix="/api/predict",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self) -> None:
        '''
        Associates http routes with class functions.
        '''
        self.router.post("/")(self.getPrediction)

    async def getPrediction(self, mlmodelin: MLModelIn) -> MLModelOut:
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