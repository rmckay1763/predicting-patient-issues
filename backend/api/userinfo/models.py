from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class Users(BaseModel):
    uid: int
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class UsersIn(BaseModel):
    firstname: str
    lastname: str
    username: str
    rank: Optional[str] = ""
    role: Optional[int] = 0

class Roles(BaseModel):
    id: int
    name: str

class RolesIn(BaseModel):
    name: str

class Login(BaseModel):
    uid: int
    password: str

class LoginAttempt(BaseModel):
    username: str
    password: str