import os
from typing import List
from requests.exceptions import HTTPError
import requests
from dotenv import load_dotenv
from pydantic.tools import parse_obj_as
from apimodels import Vital, Patient

class APIHandler:
    '''
    Handles api calls to server with patient database.
    '''

    def __init__(self) -> None:
        '''
        Constructor. Expects environment variables for endpoint.
        '''
        load_dotenv()
        self.baseRoute = os.environ['PATIENT_SERVER']
        self.username = os.environ['USERNAME']
        self.password = os.environ['PASSWORD']

    def headers(self) -> dict:
        '''
        Sets request headers for bearer authentication.
        '''
        token = os.environ['TOKEN']
        return {'Authorization': 'Bearer ' + token}
    
    def login(self) -> None:
        '''
        Logs in to endpoint and sets environment variable for token.
        '''
        route = self.baseRoute + '/api/login'
        credentials = {
            'username': self.username,
            'password': self.password
        }
        try:
            response = requests.post(route, json=credentials)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except Exception as err:
            raise err
        else:
            os.environ['TOKEN'] = response.json()['token']

    def checkToken(self) -> None:
        '''
        Checks if token stored in environment variable is valid. 
        If not, calls self.login to update token.
        '''
        route = self.baseRoute + '/api/validate'
        try:
            response = requests.get(route, headers=self.headers())
            response.raise_for_status()
        except HTTPError as err:
            self.login()
        except Exception as err:
            raise err

    def fetchPatients(self) -> List[Patient]:
        '''
        Fetch patients from the server database.

        Returns:
            list[Patient]: List of Patient models.
        '''
        route = self.baseRoute + '/api/patient/fetchAllPatients'
        try:
            response = requests.get(route, headers=self.headers())
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except Exception as err:
            raise err
        else:
            patients = response.json()
            models = parse_obj_as(List[Patient], patients)
            return models

    def fetchVitals(self, pid: int, limit: int = 3) -> List[Vital]:
        '''
        Fetch vitals for a given patent.

        Parameters:
            pid (int): Primary key of patient associated with vitals.
            limit (int): Max number of records to return.

        Returns:
            list[Vital]: List of Vital models.
        '''
        route = self.baseRoute + '/api/patient/fetchVitals/'
        payload = {'key': pid, 'limit': limit}
        try:
            response = requests.get(route, headers=self.headers(), params=payload)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except Exception as err:
            raise err
        else:
            vitals = response.json()
            models = parse_obj_as(List[Vital], vitals)
            return models

    def updateStatus(self, pid: int, status: int) -> None:
        '''
        Updates the status of a given patient.

        Parameters:
            pid (int): Primary key of the patient to update.
            status(int): Primary key of the updated status.
        '''
        route = self.baseRoute + '/api/patient/updateStatus'
        payload = {'pid': pid, 'status': status}
        try:
            response = requests.put(route, headers=self.headers(), params=payload)
            response.raise_for_status()
        except HTTPError as err:
            raise err
        except Exception as err:
            raise err