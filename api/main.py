import configparser
from fastapi import status
from fastapi.applications import FastAPI
import models as m
from postgresconnector import PostgresConnector
from pydantic import parse_obj_as
from typing import List

# global variables
app = FastAPI()

# defines global variables for config file and database connection
@app.on_event("startup")
def startup():
    global config 
    config = configparser.ConfigParser()
    config.read('settings.ini')
    config.sections()
    global conn
    conn = PostgresConnector(config)

# route to get all users as json array
@app.get("/users")
async def getAllUsers():
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

