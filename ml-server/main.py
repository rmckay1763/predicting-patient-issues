import random
from fastapi import FastAPI, HTTPException
import uvicorn
from modelservice import ModelService
from apimodels import MLInput

app = FastAPI()
service = ModelService()
status = [1, 9, 10]

@app.post('/predict')
async def predict(input: MLInput) -> int:
    '''
    Predicts status from patient vitals.

    Parameters:
        input (MLInput): Patient object and list of Vital objects.

    Returns:
        int: Primary key of the predicted status.
    '''
    try:
        futureVitals = await service.predictVitals(input)
        log = open('/var/log/predictions.log', 'a')
        print(futureVitals, file=log)
        log.close()
        return random.choice(status)
    except HTTPException as err:
        raise err