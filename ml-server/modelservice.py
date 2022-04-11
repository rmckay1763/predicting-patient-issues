from apimodels import MLInput, MLVital, Status
from modelhandler import ModelHandler
from dataprocessor import DataProcessor

class ModelService:
    '''
    Service for ml models.
    '''

    '''
    Status objects to return to api caller.
    '''
    critical = Status(id = 1, text = 'Critical')
    stable = Status(id = 9, text = 'Stable')

    def __init__(self) -> None:
        '''
        Constructor.
        '''
        self.models = ModelHandler()

    async def predictVitals(self, input: MLInput) -> MLVital:
        '''
        Predicts each vital one time step in future.

        Parameters:
            input (MLInput): Patient and associated vital records.

        Returns:
            MLVital: Predicted vitals.
        '''
        data = DataProcessor(input.patient, input.vitals)
        data.setOffsets()
        data.parseVitals()

        heartRate = await self.models.predictHeartRate(data.heart_rate)
        sao2 = await self.models.predictSao2(data.sao2)
        respiration = await self.models.predictRespiration(data.respiration)
        cvp = await self.models.predictCvp(data.cvp)
        systolic = await self.models.predictSystolic(data.systolic)
        diastolic = await self.models.predictDiastolic(data.diastolic)
        temperature = await self.models.predictTemperature(data.temperature)

        prediction = MLVital(
            offset = data.offsets[-1] + 5,
            heart_rate = heartRate,
            sao2 = sao2,
            respiration = respiration,
            cvp = cvp,
            systolic = systolic,
            diastolic = diastolic,
            temperature = temperature,
            icp = 10
        )
        return prediction

    async def predictStatus(self, vitals: MLVital) -> Status:
        '''
        Predict a patient status from given vitals.

        Parameters: 
            vitals (MLVital) - The vitals to predict from.

        Returns:
            Status - Status object for the predicted status.
        '''
        model_input = [vitals.heart_rate, vitals.respiration, vitals.sao2]
        prediction = await self.models.predictStatus(model_input)
        if prediction == 0:
            return self.stable
        return self.critical