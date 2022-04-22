from pydantic import BaseModel

class Vital(BaseModel):
    '''
    Vital record from the patient database.
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

class Prediction(BaseModel):
    '''
    Represents the predicted vitals and status from a call to the ml server.
    '''
    vitals: Vital
    status: Status