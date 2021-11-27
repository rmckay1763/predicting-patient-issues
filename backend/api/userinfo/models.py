from pydantic import BaseModel
from typing import Optional

class Users(BaseModel):
    '''
    Represents an entry in the users table.
    '''
    uid: int
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class UsersIn(BaseModel):
    '''
    Represents a new user to insert into the table.
    '''
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class Roles(BaseModel):
    '''
    Represents an entry in the roles table.
    '''
    id: int
    name: str

class RolesIn(BaseModel):
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