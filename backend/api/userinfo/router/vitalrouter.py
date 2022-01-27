from fastapi import APIRouter, Depends
from api.userinfo.models import Vital
from api.userinfo.crud.vitalcrud import VitalCRUD
from api.dependencies import auth

class VitalRouter:
    '''
    Implements routes for the vital table using an APIRouter
    '''

    def __init__(self, vitals: VitalCRUD):
        '''
        Constructor.

        Parameters:
            vitals (VitalCRUD): The crud to interact with the table.
        '''
        self.vitals = vitals
        self.router = APIRouter(
            prefix="/api/vital",
            dependencies=[Depends(auth.auth_wrapper)]
        )
        self.__addRoutes__()

    def __addRoutes__(self):
        '''
        Associates http routes with class functions.
        '''
        self.router.get("/fetchOne/{key}")(self.fetchOne)
        self.router.get("/fetchAll/")(self.fetchAll)

    async def fetchOne(self, key: int):
        """
        Route to fetch vital records for a given patient id.

        Parameters:
            key (int): The primary key (pid) of the patient.

        Returns:
            list: A list of vital records.
        """
        try:
            return await self.vitals.fetchOne(key)
        except BaseException as err:
            raise err

    async def fetchAll(self):
        """
        Route to fetch all rows from the vital table.

        Returns:
            list: A list of Vital objects.
        """
        try:
            return await self.vitals.fetchAll()
        except BaseException as err:
            raise err

