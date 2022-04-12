from fastapi import FastAPI, HTTPException
from modelservice import ModelService
from apimodels import MLInput, MLVital, Status

app = FastAPI()
service = ModelService()
status = [1, 9, 10]

@app.get('/health')
async def healthCheck() -> bool:
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
        # need to set up rolling logs with python logging library
        #log(input, futureVitals, futureStatus)
        return futureStatus
    except HTTPException as err:
        raise err
    except KeyError as err:
        raise HTTPException(status_code=422, detail=str(err))

def log(input: MLInput, futureVitals: MLVital, futureStatus: Status):
    '''
    Logs input and predictions. Problamtic because of exceeding file size.
    Need to implement a logging system with python logging library.
    '''
    log = open('/var/log/predictions.log', 'a')
    print('*' * 80, file=log)
    for vital in input.vitals:
        print(vital, file=log)
    print('Predicted vitals: ', futureVitals, file=log)
    print('Predicted status: ', futureStatus, file=log)