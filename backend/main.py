import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.utils.loginhandler import LoginHandler
from api.userinfo.models import LoginAttempt
import dependencies
dependencies.init()
from api.userinfo.routes import usersroutes, loginroutes, rolesroutes

app = FastAPI()
loginHandler = dependencies.loginHandler

@app.on_event("startup")
def startup():
    app.add_middleware(
        CORSMiddleware,
        allow_origins = ['*'],
        allow_credentials = True,
        allow_methods = ['*'],
        allow_headers = ['*']
    )
    app.include_router(usersroutes.router)
    app.include_router(loginroutes.router)
    app.include_router(rolesroutes.router)

@app.post("/login/")
async def login(attempt: LoginAttempt):
    """
    Route to authenticate an attempted login.

    Parameters:
        attempt (LoginAttempt): The attempted login.

    Raises:
        HTTPException: If authentication fails.

    Returns:
        token (str): Session token.
    """
    try:
        return await loginHandler.login(attempt)
    except BaseException as err:
        raise err

if __name__ == '__main__':
    uvicorn.run('main:app', host='127.0.0.1', port=8000, reload=True)