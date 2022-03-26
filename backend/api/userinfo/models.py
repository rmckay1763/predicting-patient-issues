from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from typing import List

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

class Rank(BaseModel):
    '''
    Represents an entry in the rank table.
    '''
    id: int
    pay_grade: Optional[str] = None
    abbreviation: str
    name: str

class User(BaseModel):
    '''
    Represents an entry in the user table.
    '''
    uid: int
    firstname: str
    lastname: str
    username: str
    rank: int
    role: int
    admin: bool

class UserIn(BaseModel):
    '''
    Represents a new user to insert into the table.
    '''
    firstname: str
    lastname: str
    username: str
    rank: int
    role: int
    admin = False
    password: str

class UserOut(BaseModel):
    '''
    Represents a user model to send to the frontend.
    '''
    uid: int
    firstname: str
    lastname: str
    username: str
    rank: Rank
    role: Role
    admin: bool

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

class LoginUpdated(BaseModel):
    '''
    Represents a login update from the frontend.
    '''
    uid: int
    old_password: str
    new_password: str

class LoginSuccess(BaseModel):
    '''
    Response to fronted for successful login.
    '''
    token: str
    user: UserOut

class Status(BaseModel):
    '''
    Represents an entry in the status table.
    '''
    id: int
    text: str 

class Patient(BaseModel):
    '''
    Represents an entry in the patient table.
    '''
    pid: int
    admit_time: datetime
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status: int

class PatientIn(BaseModel):
    '''
    Represents a new entry in the patient table.
    '''
    admit_time = datetime.now()
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status = 10

class PatientOut(BaseModel):
    '''
    Represents a pateint model to send to the frontend.
    '''
    pid: int
    admit_time: datetime
    firstname: str
    lastname: str
    age: Optional[int] = None
    gender: Optional[str] = None
    status: Status

class Vital(BaseModel):
    '''
    Represents an entry in the vitals table
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

class VitalIn(BaseModel):
    '''
    Represents a new entry in the vitals table
    '''
    pid: int
    heart_rate: int
    sao2: int
    respiration: int
    cvp: int
    systolic: int
    diastolic: int
    temperature: float
    icp: int

class MLVitals(BaseModel):
    timestamp: datetime
    heart_rate: int
    sao2: int
    respiration: int

class MLModelIn(BaseModel):
    pid: int
    vitals: List[MLVitals]

class MLModelOut(BaseModel):
    pid: int
    status: str
    vitals: MLVitals

