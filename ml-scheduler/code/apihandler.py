import os
import json
from typing import List
from requests.exceptions import HTTPError, ConnectionError
import requests
from dotenv import load_dotenv
from pydantic.tools import parse_obj_as
from apimodels import Vital, Patient, Status

class APIHandler:
    '''
    Handles api calls to server with patient database.
    '''

    def __init__(self) -> None:
        '''
        Constructor. Expects environment variables for endpoint.
        '''
        load_dotenv()
        self.patientServer = os.environ['PATIENT_SERVER']
        self.mlServer = os.environ['ML_SERVER']
        self.username = os.environ['USERNAME']
        self.password = os.environ['PASSWORD']

    def headers(self) -> dict:
        '''
        Sets request headers for bearer authentication.
        '''
        token = os.environ['TOKEN']
        return {'Authorization': 'Bearer ' + token}
    
    async def login(self) -> None:
        '''
        Logs in to endpoint and sets environment variable for token.
        '''
        route = self.patientServer + '/api/login'
        credentials = {
            'username': self.username,
            'password': self.password
        }
        try:
            response = requests.post(route, json=credentials)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except ConnectionError as err:
            raise err
        else:
            os.environ['TOKEN'] = response.json()['token']

    async def checkToken(self) -> None:
        '''
        Checks if token stored in environment variable is valid. 
        If not, calls self.login to update token.
        '''
        route = self.patientServer + '/api/validate'
        try:
            response = requests.get(route, headers=self.headers())
            response.raise_for_status()
        except HTTPError:
            return await self.login()
        except ConnectionError as err:
            raise err
        else:
            return True

    async def fetchPatients(self) -> List[Patient]:
        '''
        Fetch patients from the server database.

        Returns:
            list[Patient]: List of Patient models.
        '''
        route = self.patientServer + '/api/patient/fetchAllPatients'
        try:
            response = requests.get(route, headers=self.headers())
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except ConnectionError as err:
            raise err
        else:
            patients = response.json()
            models = parse_obj_as(List[Patient], patients)
            return models

    async def fetchVitals(self, pid: int, limit: int = 5) -> List[Vital]:
        '''
        Fetch vitals for a given patent.

        Parameters:
            pid (int): Primary key of patient associated with vitals.
            limit (int): Max number of records to return.

        Returns:
            list[Vital]: List of Vital models.
        '''
        route = self.patientServer + '/api/patient/fetchVitals/'
        payload = {'key': pid, 'limit': limit}
        try:
            response = requests.get(route, headers=self.headers(), params=payload)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except ConnectionError as err:
            raise err
        else:
            vitals = response.json()
            models = parse_obj_as(List[Vital], vitals)
            return models

    async def updateStatus(self, pid: int, status: int) -> None:
        '''
        Updates the status of a given patient.

        Parameters:
            pid (int): Primary key of the patient to update.
            status(int): Primary key of the updated status.
        '''
        route = self.patientServer + '/api/patient/updateStatus'
        payload = {'pid': pid, 'status': status}
        try:
            response = requests.put(route, headers=self.headers(), params=payload)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except ConnectionError as err:
            raise err

    async def checkMLServer(self) -> bool:
        '''
        Health check for ml server.

        Returns:
            bool - True if server is online, false otherwise.
        '''
        route = self.mlServer + '/health'
        try:
            response = requests.get(route)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except ConnectionError as err:
            raise err
        else:
            return True

    async def getPrediction(self, patient: Patient, vitals: List[Vital]) -> Status:
        '''
        Gets status prediction from ml api for given patient and vitals.

        Parameters:
            patient (Patient): Patient model.
            vitals: (list[Vital]): Vitals records associated with patient.

        Returns:
            int: Primary key for the predicted status.
        '''
        route = self.mlServer + '/predict'
        patientExport = json.loads(patient.json())
        vitalsExport = []
        for vital in vitals:
            temp = json.loads(vital.json())
            vitalsExport.append(temp)
        payload = {
            'patient': patientExport,
            'vitals': vitalsExport
        }
        try:
            response = requests.post(route, json=payload)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except ConnectionError as err:
            raise err
        else:
            status = response.json()
            model = parse_obj_as(Status, status)
            return model
