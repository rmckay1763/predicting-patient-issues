from typing import Union, List
from fastapi import FastAPI, HTTPException
from modelservice import ModelService
from apimodels import Status, Vital, Prediction
from loghandler import LogHandler

app = FastAPI()
service = ModelService()
mlLogger = LogHandler(name='ml_logger', logFile='ml.log', numLogs=5)
errLogger = LogHandler(name='exception_logger', logFile='error.log')

def handleException(err: Union[ValueError, HTTPException]) -> None:
    '''
    Handles exceptions from ml models.

    Parameters:
        err - The exception raised by one of the models.

    Raises:
        HTTPException: To return to api caller.
    '''
    if type(err) is HTTPException:
        message = f'HTTPException: {err.status_code} - {err.detail}'
        errLogger.log(message, level=LogHandler.ERROR)
        raise err
    else:
        message = f'{err.__class__.__name__}: {err}'
        errLogger.log(message, level=LogHandler.ERROR)
        raise HTTPException(status_code=422, detail=str(err))

def log(input: List[Vital], futureVitals: Vital, futureStatus: Status) -> None:
    '''
    Logs input and predictions to rotating log files. 

    Parameters:
        input - List of vitals to feed models.

        futureVitals - Predicted vitals returned from forecasters.

        futureStatus - Predicted status status based on future vitals.
    '''
    message = 'Previous 5 vital records:'
    mlLogger.log(message, level=LogHandler.INFO)
    for vital in input:
        mlLogger.log(vital, level=LogHandler.INFO, format=LogHandler.PLAIN)
    message = 'Predicted vitals: ' + str(futureVitals)
    mlLogger.log(message, level=LogHandler.INFO, format=LogHandler.PLAIN)
    message = 'Predicted status: ' + str(futureStatus)
    mlLogger.log(message, level=LogHandler.INFO, format=LogHandler.PLAIN)

@app.get('/health')
async def healthCheck() -> bool:
    '''
    Returns: True if the api is alive.
    '''
    return True

@app.post('/predict')
async def predict(input: List[Vital]) -> Prediction:
    '''
    Predicts future vitals/status from list of vitals.

    Parameters:
        input - List of vitals sorted by time in descending order. 

    Returns:
        Prediction: Predicted vitals and status.
    '''
    try:
        futureVitals = await service.predictVitals(input)
        futureStatus = await service.checkVitals(futureVitals)
        log(input, futureVitals, futureStatus)
        return Prediction(vitals=futureVitals, status=futureStatus)
    except (HTTPException, ValueError) as err:
        handleException(err)