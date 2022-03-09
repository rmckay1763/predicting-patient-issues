from datetime import datetime
from api.userinfo.models import MLModelIn, MLModelOut, MLVitals
from typing import List
from tensorflow.keras.models import load_model

class MLHandler:

    def __init__(self):
        try:
            self.hr_model = load_model('/app/api/utils/mlmodels/hr_model/')
            self.respiration_model = load_model('/app/api/utils/mlmodels/respiration_model/')
            self.sao2_model = load_model('/app/api/utils/mlmodels/sao2_model/')
        except:
            pass

    def predict_heart_rate(self, history: List[int]):
        return self.hr_model.predict([history])

    def predict_respiration(self, history: List[int]):
        return self.respiration_model.predict([history])

    def predict_sao2(self, history: List[int]):
        return self.sao2_model.predict([history])

    def process_input(self, mlmodelin: MLModelIn):
        time_history = []
        heart_rate_history = []
        sao2_history = []
        respiration_history = []
        for vital in mlmodelin.vitals:
            time_history.append(vital.timestamp)
            heart_rate_history.append(vital.heart_rate)
            sao2_history.append(vital.sao2)
            respiration_history.append(vital.respiration)

        return {
            'time': time_history,
            'heart_rate': heart_rate_history,
            'sao2': sao2_history,
            'respiration': respiration_history
        }

    def predict(self, mlmodelin: MLModelIn) -> MLModelOut:
        processed_input = self.process_input(mlmodelin)
        pred_hr = self.predict_heart_rate(processed_input['heart_rate'])
        pred_respiration = self.predict_respiration(processed_input['respiration'])
        pred_sao2 = self.predict_sao2(processed_input['sao2'])

        vitals = MLVitals(
            heart_rate = pred_hr,
            sao2 = pred_sao2,
            respiration = pred_respiration,
            timestamp = datetime.now()
        )
        prediction = MLModelOut(
            pid = mlmodelin.pid,
            status = 'Critical',
            vitals = vitals
        )

        return prediction
