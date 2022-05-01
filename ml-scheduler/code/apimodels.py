from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class Vital(BaseModel):
    '''
    Represents a vital record.
    '''
    heart_rate: int
    sao2: int
    respiration: int
    systolic: int
    diastolic: int

class Status(BaseModel):
    '''
    Represents a row from the status table.
    '''
    id: int
    text: str

class Patient(BaseModel):
    '''
    Represents a patient.
    '''
    pid: int
    admit_time: datetime
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status: Status

class Prediction(BaseModel):
    '''
    Represents the predicted vitals and status from a call to the ml server.
    '''
    vitals: Vital
    status: Status