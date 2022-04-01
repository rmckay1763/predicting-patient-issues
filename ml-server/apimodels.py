from datetime import datetime
from pydantic import BaseModel
from typing import Any, Optional, List

class Vital(BaseModel):
    '''
    Vital record from the patient database.
    '''
    pid: int
    timestamp: datetime
    heart_rate: int
    sao2: int
    respiration: int
    cvp: int
    systolic: int
    diastolic: int
    temperature: float
    icp: int

class MLVital(BaseModel):
    '''
    Vital record for input for ml models.
    '''
    offset: int
    heart_rate: int
    sao2: int
    respiration: int
    cvp: int
    systolic: int
    diastolic: int
    temperature: float
    icp: int

class Status(BaseModel):
    '''
    Represents a row from the status table.
    '''
    id: int
    text: str

class Patient(BaseModel):
    '''
    Patient from the patient database.
    '''
    pid: int
    admit_time: datetime
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status: Status

class MLInput(BaseModel):
    '''
    Post body for predict route.
    '''
    patient: Patient
    vitals: List[Vital]