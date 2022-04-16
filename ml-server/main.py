from typing import Union
from fastapi import FastAPI, HTTPException
from modelservice import ModelService
from apimodels import MLInput, MLVital, Status
from loghandler import LogHandler

app = FastAPI()
service = ModelService()
mlLogger = LogHandler(name='ml_logger', logFile='ml.log', numLogs=5)
errLogger = LogHandler(name='exception_logger', logFile='error.log')

def handleException(err: Union[ValueError, HTTPException]) -> None:
    '''
    Handles exceptions from ml models.

    Parameters:
        err: The exception raised by one of the models.

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

def log(input: MLInput, futureVitals: MLVital, futureStatus: Status) -> None:
    '''
    Logs input and predictions to rotating log files. 

    Parameters:
        MLInput - Input passed to ml models.

        futureVitals - Predicted vitals returned from ml models.

        futureStatus - Predicted status returned from classifier.
    '''
    message = 'Previous 5 vital records, predicted vitals, predicted status:'
    mlLogger.log(message, level=LogHandler.INFO)
    for vital in input.vitals:
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
async def predict(input: MLInput) -> Status:
    '''
    Predicts status from patient vitals.

    Parameters:
        input (MLInput): Patient object and list of Vital objects.

    Returns:
        Status: Status object for the predicted status.
    '''
    try:
        futureVitals = await service.predictVitals(input)
        futureStatus = await service.predictStatus(futureVitals)
        log(input, futureVitals, futureStatus)
        return futureStatus
    except (HTTPException, ValueError) as err:
        handleException(err)