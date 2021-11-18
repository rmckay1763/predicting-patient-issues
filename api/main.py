import configparser
from fastapi import status, HTTPException, Depends
from fastapi.applications import FastAPI
import models as m
from authhandler import AuthHandler
from postgresconnector import PostgresConnector
from pydantic import parse_obj_as
from typing import List

# global variables
config = configparser.ConfigParser()
config.read('settings.ini')
config.sections()

app = FastAPI()
auth = AuthHandler(config)
# defines global variables for config file and database connection
@app.on_event("startup")
def startup():
    global conn
    conn = PostgresConnector(config)

# route to get all users as json array
@app.get("/users/")
async def getAllUsers(uid=Depends(auth.auth_wrapper)):
    conn.curr.execute('SELECT * FROM public.users;')
    resultDict = conn.curr.fetchall()
    models = parse_obj_as(List[m.Users], resultDict)
    return models 

# route to get user by user id as a json object
@app.get("/users/{uid}")
async def getUser(uid: int):
    conn.curr.execute(f'SELECT * FROM public.users WHERE uid={uid};')
    resultDict = conn.curr.fetchone()
    model = parse_obj_as(m.Users, resultDict)
    return model

# route to delete a user by id. returns 1 if successful, 0 otherwise
@app.delete("/users/{uid}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteUser(uid: int):
    conn.curr.execute(f'DELETE FROM public.users WHERE uid={uid};')
    conn.conn.commit()
    rowcount = conn.curr.rowcount
    return {"rowcount": rowcount}

# route to add a new user. info sent in as json object
@app.post("/users/")
async def insertUser(userinfo: m.UsersIn):
    conn.curr.execute(f'INSERT INTO public.users (firstname, lastname, username, rank, role) VALUES (\'{userinfo.firstname}\', \'{userinfo.lastname}\', \'{userinfo.username}\', \'{userinfo.rank}\', {userinfo.role})')
    conn.conn.commit()
    rowcount = conn.curr.rowcount
    return {"rowcount": rowcount}

@app.post("/login/")
async def login(login: m.Login):
    conn.curr.execute(f'SELECT * FROM public.users WHERE username = \'{login.username}\';')
    user = conn.curr.fetchone()

    if (user == None):
        raise HTTPException(status_code=401, detail='Username or password is incorrect!')

    user_parsed = parse_obj_as(m.Users, user)

    conn.curr.execute(f'SELECT * FROM public.login WHERE uid = {user_parsed.uid};')
    password = conn.curr.fetchone()

    if (password == None):
        raise HTTPException(status_code=401, detail='Account has not been set up!')

    pass_parsed = parse_obj_as(m.Password, password)

    if (not auth.verify_password(pass_parsed.password, login.password)):
        raise HTTPException(status_code=401, detail='Username or password is incorrect!')    
    
    token = auth.encode_token(user_parsed.uid)
    return {"token" : token}
