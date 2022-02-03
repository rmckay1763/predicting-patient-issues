from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    '''
    Represents an entry in the user table.
    '''
    uid: int
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class UserIn(BaseModel):
    '''
    Represents a new user to insert into the table.
    '''
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class Role(BaseModel):
    '''
    Represents an entry in the role table.
    '''
    id: int
    name: str

class RoleIn(BaseModel):
    '''
    Represents a new role to insert into the table.
    '''
    name: str

class Login(BaseModel):
    '''
    Represents an entry in the login table.
    '''
    uid: int
    password: str

class LoginAttempt(BaseModel):
    '''
    Represents a login attempt from the frontend.
    '''
    username: str
    password: str

class Patient(BaseModel):
    '''
    Represents an entry in the patient table.
    '''
    pid: int
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status: str

class PatientIn(BaseModel):
    '''
    Represents a new entry in the patient table.
    '''
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status = "unobserved"

class Vital(BaseModel):
    '''
    Represents an entry in the vitals table
    '''
    pid: int
    entered_at: datetime
    heart_rate: float
    temperature: float